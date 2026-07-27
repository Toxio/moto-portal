import {
  DEFAULT_SKETCHFAB_FOV,
  DEFAULT_SKETCHFAB_ZOOM,
  SKETCHFAB_MOTO_MODEL_ID,
} from '@/features/parts/sketchfab';
import {
  setupPartInteraction,
  type PartInteractionHandlers,
} from '@/features/parts/sketchfabInteraction';

const SKETCHFAB_SCRIPT = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';

interface CameraLookAt {
  position: number[];
  target: number[];
}

export interface SketchfabMaterial {
  id?: string;
  name?: string;
  stateSetID?: number;
}

export interface SketchfabApi {
  start: (callback?: (err?: Error) => void) => void;
  stop: (callback?: (err?: Error) => void) => void;
  addEventListener: (
    event: string,
    callback: (info?: unknown) => void,
    options?: { pick?: 'fast' | 'slow' },
  ) => void;
  setFov: (angle: number, callback?: (err?: Error) => void) => void;
  getCameraLookAt: (callback: (err: Error | null, camera?: CameraLookAt) => void) => void;
  setCameraLookAt: (
    position: number[],
    target: number[],
    duration?: number,
    callback?: (err?: Error) => void,
  ) => void;
  setEnableCameraConstraints: (
    enable: boolean,
    options: { preventCameraConstraintsFocus?: boolean },
    callback?: (err?: Error) => void,
  ) => void;
  getNodeMap: (callback: (err: Error | null, nodes?: Record<string, unknown>[]) => void) => void;
  getMaterialList: (callback: (err: Error | null, materials?: SketchfabMaterial[]) => void) => void;
  setHighlightOptions: (
    options: {
      outlineWidth: number;
      outlineColor: number[];
      outlineDuration: number;
      highlightColor: number[];
      highlightDuration: number;
    },
    callback?: () => void,
  ) => void;
  highlightMaterial: (material: SketchfabMaterial) => void;
  pickFromScreen: (
    position2D: number[],
    callback: (err: Error | null, coord?: Record<string, unknown>) => void,
  ) => void;
}

interface SketchfabClient {
  init: (
    uid: string,
    options: Record<string, unknown> & {
      success?: (api: SketchfabApi) => void;
      error?: () => void;
    },
  ) => void;
}

declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => SketchfabClient;
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadSketchfabScript(): Promise<void> {
  if (window.Sketchfab) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SKETCHFAB_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Sketchfab viewer'));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

function pullCameraBack(
  api: SketchfabApi,
  initialFov: number,
  cameraZoom: number,
  onDone: () => void,
): void {
  api.setFov(initialFov, () => {
    api.getCameraLookAt((err, camera) => {
      if (err || !camera?.position || !camera?.target) {
        onDone();
        return;
      }

      const eye = camera.position;
      const target = camera.target;
      const dx = eye[0] - target[0];
      const dy = eye[1] - target[1];
      const dz = eye[2] - target[2];

      api.setCameraLookAt(
        [target[0] + dx * cameraZoom, target[1] + dy * cameraZoom, target[2] + dz * cameraZoom],
        target,
        0,
        () => onDone(),
      );
    });
  });
}

export function applyInitialCamera(
  api: SketchfabApi,
  initialFov: number,
  cameraZoom: number,
  onDone: () => void,
): void {
  api.setEnableCameraConstraints(false, { preventCameraConstraintsFocus: true }, () => {
    pullCameraBack(api, initialFov, cameraZoom, onDone);
  });
}

export function initSketchfabViewer(
  iframe: HTMLIFrameElement,
  options: {
    initialFov?: number;
    cameraZoom?: number;
    interaction?: PartInteractionHandlers;
    onReady?: () => void;
    onError?: () => void;
  },
): () => void {
  const initialFov = options.initialFov ?? DEFAULT_SKETCHFAB_FOV;
  const cameraZoom = options.cameraZoom ?? DEFAULT_SKETCHFAB_ZOOM;

  let api: SketchfabApi | null = null;
  let teardownInteraction: (() => void) | null = null;
  let cancelled = false;

  loadSketchfabScript()
    .then(() => {
      if (cancelled || !window.Sketchfab) return;

      const client = new window.Sketchfab(iframe);
      client.init(SKETCHFAB_MOTO_MODEL_ID, {
        autostart: 1,
        transparent: 1,
        ui_theme: 'dark',
        ui_controls: 1,
        ui_infos: 0,
        scrollwheel: 1,
        success: (sketchfabApi) => {
          if (cancelled) return;
          api = sketchfabApi;
          sketchfabApi.start();
          sketchfabApi.addEventListener('viewerready', () => {
            if (cancelled) return;
            applyInitialCamera(sketchfabApi, initialFov, cameraZoom, () => {
              if (cancelled) return;

              if (options.interaction) {
                teardownInteraction = setupPartInteraction(sketchfabApi, options.interaction);
              }

              options.onReady?.();
            });
          });
        },
        error: () => options.onError?.(),
      });
    })
    .catch(() => options.onError?.());

  return () => {
    cancelled = true;
    teardownInteraction?.();
    api?.stop();
  };
}

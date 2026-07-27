import { useEffect, useRef, useState } from 'react';
import {
  DEFAULT_SKETCHFAB_FOV,
  DEFAULT_SKETCHFAB_ZOOM,
  SKETCHFAB_MOTO_MODEL_URL,
} from '@/features/parts/sketchfab';
import type { PartInteractionController } from '@/features/parts/sketchfabViewer';
import type { PartInteractionHandlers } from '@/features/parts/sketchfabInteraction';
import { initSketchfabViewer } from '@/features/parts/sketchfabViewer';
import { cn } from '@/lib/utils';

interface SketchfabMotoViewerProps {
  className?: string;
  height?: number;
  initialFov?: number;
  cameraZoom?: number;
  showAttribution?: boolean;
  interactive?: boolean;
  interaction?: PartInteractionHandlers;
  interactionControllerRef?: React.MutableRefObject<PartInteractionController | null>;
  isHoveringPart?: boolean;
  isWholeModelHighlighted?: boolean;
}

export function SketchfabMotoViewer({
  className,
  height = 480,
  initialFov = DEFAULT_SKETCHFAB_FOV,
  cameraZoom = DEFAULT_SKETCHFAB_ZOOM,
  showAttribution = true,
  interactive = false,
  interaction,
  interactionControllerRef,
  isHoveringPart = false,
  isWholeModelHighlighted = false,
}: SketchfabMotoViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const interactionRef = useRef(interaction);
  const [loadError, setLoadError] = useState(false);
  const [isReady, setIsReady] = useState(false);

  interactionRef.current = interaction;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    setLoadError(false);
    setIsReady(false);

    if (interactionControllerRef) {
      interactionControllerRef.current = null;
    }

    return initSketchfabViewer(iframe, {
      initialFov,
      cameraZoom,
      interaction: interactive
        ? {
            onPartHover: (partId) => interactionRef.current?.onPartHover?.(partId),
            onPartSelect: (partId) => interactionRef.current?.onPartSelect?.(partId),
          }
        : undefined,
      onInteractionReady: (controller) => {
        if (interactionControllerRef) {
          interactionControllerRef.current = controller;
        }
      },
      onReady: () => setIsReady(true),
      onError: () => setLoadError(true),
    });
  }, [initialFov, cameraZoom, interactive, interactionControllerRef]);

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border transition-shadow duration-300',
        isWholeModelHighlighted && isReady
          ? 'border-accent/35 shadow-[0_0_28px_rgba(220,38,38,0.18)]'
          : 'border-white/10',
        className,
      )}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative w-full touch-manipulation',
          isHoveringPart && isReady && 'cursor-pointer',
        )}
        style={{ height }}
      >
        {!isReady && !loadError && (
          <div className="bg-secondary/50 absolute inset-0 z-10 animate-pulse rounded-xl" />
        )}
        <iframe
          ref={iframeRef}
          title="Moto 3D model by evschazenez"
          src=""
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          className={cn(
            'pointer-events-auto absolute inset-0 h-full w-full border-0 transition-opacity duration-500',
            isReady ? 'opacity-100' : 'opacity-0',
          )}
        />
        {loadError && (
          <div className="bg-secondary/80 absolute inset-0 flex items-center justify-center p-4 text-center text-sm">
            Не удалось загрузить 3D-модель.{' '}
            <a
              href={SKETCHFAB_MOTO_MODEL_URL}
              target="_blank"
              rel="noreferrer"
              className="text-accent"
            >
              Открыть на Sketchfab
            </a>
          </div>
        )}
      </div>
      {showAttribution && (
        <p className="text-muted border-t border-white/10 px-3 py-2 text-center text-xs">
          3D-модель{' '}
          <a
            href={SKETCHFAB_MOTO_MODEL_URL}
            target="_blank"
            rel="noreferrer"
            className="text-accent hover:underline"
          >
            Moto
          </a>{' '}
          by evschazenez on Sketchfab
        </p>
      )}
    </div>
  );
}

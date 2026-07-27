import {
  buildInstancePartMap,
  buildMaterialPartMap,
  logSketchfabScene,
  normalizeMaterials,
  resolvePartId,
  type SketchfabSceneMaterial,
  type SketchfabSceneNode,
} from '@/features/parts/partNodeMap';
import type { SketchfabApi } from '@/features/parts/sketchfabViewer';

const PART_OUTLINE: [number, number, number] = [1, 0.2, 0.2];
const PART_FILL: [number, number, number, number] = [0.86, 0.15, 0.15, 0.35];
const PICK_OPTIONS = { pick: 'slow' as const };

interface SketchfabPickResult {
  instanceID?: number;
  material?: SketchfabSceneMaterial;
}

interface SketchfabHoverNode extends SketchfabSceneNode {
  material?: SketchfabSceneMaterial;
}

interface MaterialChannels {
  EmitColor?: {
    enable?: boolean;
    factor?: number;
    color?: number[];
    type?: string;
  };
  AlbedoPBR?: { enable?: boolean; factor?: number; color?: number[] };
  DiffusePBR?: { enable?: boolean; factor?: number; color?: number[] };
  DiffuseColor?: { enable?: boolean; factor?: number; color?: number[] };
}

type MaterialSnapshot = SketchfabSceneMaterial & { channels?: MaterialChannels };

export interface PartInteractionHandlers {
  onPartHover?: (partId: string | null) => void;
  onPartSelect?: (partId: string) => void;
}

export interface PartInteractionController {
  highlightPart: (partId: string | null, fromList?: boolean) => void;
}

function getMaterialKey(material: SketchfabSceneMaterial): string | null {
  return material.id ?? (material.stateSetID != null ? String(material.stateSetID) : null);
}

function cloneMaterial(material: SketchfabSceneMaterial): MaterialSnapshot {
  return JSON.parse(JSON.stringify(material)) as MaterialSnapshot;
}

function resolvePartFromNode(
  node: SketchfabHoverNode,
  instancePartMap: Map<number, string>,
  materialPartMap: Map<string, string>,
): string | null {
  const fromInstance = instancePartMap.get(node.instanceID);
  if (fromInstance) return fromInstance;

  const materialKey = node.material ? getMaterialKey(node.material) : null;
  if (materialKey) {
    const fromMaterial = materialPartMap.get(materialKey);
    if (fromMaterial) return fromMaterial;
  }

  return resolvePartId(node.name, node.material?.name) ?? resolvePartId(undefined, node.name);
}

function buildPartMaterialsMap(
  materialPartMap: Map<string, string>,
  materialList: SketchfabSceneMaterial[],
): Map<string, SketchfabSceneMaterial[]> {
  const map = new Map<string, SketchfabSceneMaterial[]>();

  for (const [materialKey, partId] of materialPartMap) {
    const material = materialList.find((item) => getMaterialKey(item) === materialKey);
    if (!material) continue;

    const existing = map.get(partId) ?? [];
    if (existing.some((item) => getMaterialKey(item) === materialKey)) continue;

    map.set(partId, [...existing, material]);
  }

  return map;
}

function dimMaterial(material: MaterialSnapshot): void {
  const channels = material.channels;
  if (!channels) return;

  if (channels.AlbedoPBR) {
    channels.AlbedoPBR.factor = 0.08;
  }
  if (channels.DiffusePBR) {
    channels.DiffusePBR.factor = 0.08;
  }
  if (channels.DiffuseColor) {
    channels.DiffuseColor.factor = 0.08;
  }
}

function emphasizeMaterial(material: MaterialSnapshot): void {
  const channels = material.channels;
  if (!channels) return;

  channels.EmitColor = {
    ...channels.EmitColor,
    enable: true,
    factor: 0.55,
    color: [0.86, 0.15, 0.15],
    type: channels.EmitColor?.type ?? 'additive',
  };
}

function resolveMaterialPartId(
  material: SketchfabSceneMaterial,
  materialPartMap: Map<string, string>,
): string | null {
  const key = getMaterialKey(material);
  if (key) {
    const fromMap = materialPartMap.get(key);
    if (fromMap) return fromMap;
  }

  return resolvePartId(undefined, material.name);
}

export function setupPartInteraction(
  api: SketchfabApi,
  handlers: PartInteractionHandlers,
): PartInteractionSetup {
  let instancePartMap = new Map<number, string>();
  let materialPartMap = new Map<string, string>();
  let partMaterialsMap = new Map<string, SketchfabSceneMaterial[]>();
  let originalMaterials: MaterialSnapshot[] = [];
  let materialList: SketchfabSceneMaterial[] = [];
  let lastHoveredPart: string | null = null;
  let externalHighlightPart: string | null = null;
  let sceneReady = false;
  let cancelled = false;
  let pendingVisualToken = 0;

  const resolveFromPick = (info: SketchfabPickResult): string | null => {
    if (info.instanceID != null) {
      const fromNode = instancePartMap.get(info.instanceID);
      if (fromNode) return fromNode;
    }

    if (info.material) {
      return resolveMaterialPartId(info.material, materialPartMap);
    }

    return null;
  };

  const highlightMaterials = (materials: SketchfabSceneMaterial[], token: number): void => {
    if (!materials.length) return;

    api.setHighlightOptions(
      {
        outlineWidth: 8,
        outlineColor: PART_OUTLINE,
        outlineDuration: 0,
        highlightColor: PART_FILL,
        highlightDuration: 0,
      },
      () => {
        if (cancelled || token !== pendingVisualToken) return;
        materials.forEach((material) => api.highlightMaterial(material));
      },
    );
  };

  const resetOutline = (token: number): void => {
    api.setHighlightOptions(
      {
        outlineWidth: 0,
        outlineColor: PART_OUTLINE,
        outlineDuration: 0,
        highlightColor: [0, 0, 0, 0],
        highlightDuration: 0,
      },
      () => {
        if (cancelled || token !== pendingVisualToken) return;
        materialList.forEach((material) => api.highlightMaterial(material));
      },
    );
  };

  const restoreAllMaterials = (): void => {
    for (const material of originalMaterials) {
      api.setMaterial(cloneMaterial(material));
    }
  };

  const applyMaterialEmphasis = (partId: string | null, token: number): void => {
    if (!originalMaterials.length) return;

    if (!partId) {
      restoreAllMaterials();
      resetOutline(token);
      return;
    }

    for (const original of originalMaterials) {
      const updated = cloneMaterial(original);
      const matPartId = resolveMaterialPartId(original, materialPartMap);

      if (matPartId === partId) {
        emphasizeMaterial(updated);
      } else {
        dimMaterial(updated);
      }

      api.setMaterial(updated);
    }

    const materials = partMaterialsMap.get(partId) ?? [];
    highlightMaterials(materials, token);
  };

  const applyVisualState = (partId: string | null): void => {
    const token = ++pendingVisualToken;
    applyMaterialEmphasis(partId, token);
  };

  const highlightPart = (partId: string | null, fromList = false): void => {
    if (cancelled) return;

    if (fromList) {
      externalHighlightPart = partId;
    }

    lastHoveredPart = partId;

    if (sceneReady) {
      applyVisualState(partId);
    }
  };

  const updateHover = (partId: string | null): void => {
    if (cancelled) return;

    externalHighlightPart = null;

    if (partId !== lastHoveredPart) {
      lastHoveredPart = partId;
      handlers.onPartHover?.(partId);
    }

    if (sceneReady) {
      applyVisualState(partId);
    }
  };

  api.getNodeMap((err, nodes) => {
    if (cancelled || err || !nodes) return;

    instancePartMap = buildInstancePartMap(nodes);

    api.getMaterialList((materialErr, materials) => {
      if (cancelled || materialErr || !materials) return;

      materialList = normalizeMaterials(materials);
      originalMaterials = materialList.map(cloneMaterial);
      materialPartMap = buildMaterialPartMap(materials);
      partMaterialsMap = buildPartMaterialsMap(materialPartMap, materialList);
      sceneReady = true;

      logSketchfabScene(nodes, materials);
      applyVisualState(externalHighlightPart);
    });
  });

  const onNodeEnter = (node: SketchfabHoverNode): void => {
    if (externalHighlightPart) return;

    const partId = resolvePartFromNode(node, instancePartMap, materialPartMap);
    if (!partId) return;

    updateHover(partId);
  };

  const onNodeLeave = (): void => {
    if (externalHighlightPart) return;
    updateHover(null);
  };

  const onClick = (info: SketchfabPickResult): void => {
    const partId = resolveFromPick(info);

    if (!partId) {
      if (!externalHighlightPart) {
        updateHover(null);
      }
      return;
    }

    externalHighlightPart = partId;
    lastHoveredPart = partId;
    handlers.onPartHover?.(partId);
    applyVisualState(partId);
    handlers.onPartSelect?.(partId);
  };

  api.addEventListener(
    'nodeMouseEnter',
    (info) => onNodeEnter(info as SketchfabHoverNode),
    PICK_OPTIONS,
  );
  api.addEventListener('nodeMouseLeave', () => onNodeLeave(), PICK_OPTIONS);
  api.addEventListener('click', (info) => onClick(info as SketchfabPickResult), PICK_OPTIONS);

  const controller: PartInteractionController = {
    highlightPart,
  };

  const destroy = (): void => {
    cancelled = true;
    pendingVisualToken += 1;
    restoreAllMaterials();
  };

  return Object.assign(controller, { destroy });
}

export type PartInteractionSetup = PartInteractionController & { destroy: () => void };

import {
  buildInstancePartMap,
  buildMaterialPartMap,
  findMaterialForNode,
  logSketchfabScene,
  resolvePartId,
  type SketchfabSceneMaterial,
  type SketchfabSceneNode,
} from '@/features/parts/partNodeMap';
import type { SketchfabApi } from '@/features/parts/sketchfabViewer';

const HIGHLIGHT_COLOR: [number, number, number, number] = [0.86, 0.15, 0.15, 0.35];
const OUTLINE_COLOR: [number, number, number, number] = [0.86, 0.15, 0.15, 1];
const PICK_OPTIONS = { pick: 'fast' as const };

interface SketchfabPickResult {
  instanceID?: number;
  material?: SketchfabSceneMaterial;
}

interface SketchfabHoverNode extends SketchfabSceneNode {
  material?: SketchfabSceneMaterial;
}

export interface PartInteractionHandlers {
  onPartHover?: (partId: string | null) => void;
  onPartSelect?: (partId: string) => void;
}

function getMaterialKey(material?: SketchfabSceneMaterial): string | null {
  if (!material) return null;
  return material.id ?? (material.stateSetID != null ? String(material.stateSetID) : null);
}

function resolvePartFromNode(
  node: SketchfabHoverNode,
  instancePartMap: Map<number, string>,
  materialPartMap: Map<string, string>,
): string | null {
  const fromInstance = instancePartMap.get(node.instanceID);
  if (fromInstance) return fromInstance;

  const materialKey = getMaterialKey(node.material);
  if (materialKey) {
    const fromMaterial = materialPartMap.get(materialKey);
    if (fromMaterial) return fromMaterial;
  }

  return resolvePartId(node.name, node.material?.name) ?? resolvePartId(undefined, node.name);
}

export function setupPartInteraction(
  api: SketchfabApi,
  handlers: PartInteractionHandlers,
): () => void {
  let instancePartMap = new Map<number, string>();
  let materialPartMap = new Map<string, string>();
  let materialList: SketchfabSceneMaterial[] = [];
  let highlightedMaterial: SketchfabSceneMaterial | null = null;
  let lastHoveredPart: string | null = null;
  let cancelled = false;

  const resolveFromPick = (info: SketchfabPickResult): string | null => {
    if (info.instanceID != null) {
      const fromNode = instancePartMap.get(info.instanceID);
      if (fromNode) return fromNode;
    }

    const materialKey = getMaterialKey(info.material);
    if (materialKey) {
      const fromMaterial = materialPartMap.get(materialKey);
      if (fromMaterial) return fromMaterial;
    }

    return resolvePartId(undefined, info.material?.name);
  };

  const clearHighlight = (): void => {
    if (!highlightedMaterial) return;

    const material = highlightedMaterial;
    highlightedMaterial = null;

    api.setHighlightOptions(
      {
        outlineWidth: 0,
        outlineColor: OUTLINE_COLOR,
        outlineDuration: 0,
        highlightColor: [0, 0, 0, 0],
        highlightDuration: 0,
      },
      () => {
        api.highlightMaterial(material);
      },
    );
  };

  const applyHighlight = (material?: SketchfabSceneMaterial): void => {
    if (!material) return;

    highlightedMaterial = material;
    api.setHighlightOptions(
      {
        outlineWidth: 4,
        outlineColor: OUTLINE_COLOR,
        outlineDuration: 0,
        highlightColor: HIGHLIGHT_COLOR,
        highlightDuration: 0,
      },
      () => {
        api.highlightMaterial(material);
      },
    );
  };

  const updateHover = (partId: string | null, material?: SketchfabSceneMaterial): void => {
    if (cancelled) return;

    if (partId !== lastHoveredPart) {
      lastHoveredPart = partId;
      handlers.onPartHover?.(partId);
    }

    if (partId && material) {
      applyHighlight(material);
    } else if (!partId) {
      clearHighlight();
    }
  };

  api.getNodeMap((err, nodes) => {
    if (cancelled || err || !nodes) return;

    instancePartMap = buildInstancePartMap(nodes);

    api.getMaterialList((materialErr, materials) => {
      if (cancelled || materialErr || !materials) return;

      materialPartMap = buildMaterialPartMap(materials);
      materialList = Array.isArray(materials) ? materials : Object.values(materials);
      logSketchfabScene(nodes, materials);
    });
  });

  const onNodeEnter = (node: SketchfabHoverNode): void => {
    const partId = resolvePartFromNode(node, instancePartMap, materialPartMap);
    if (!partId) return;

    const material = node.material ?? findMaterialForNode(node, materialList);
    updateHover(partId, material);
  };

  const onNodeLeave = (): void => {
    updateHover(null);
  };

  const onClick = (info: SketchfabPickResult): void => {
    const partId = resolveFromPick(info);
    if (!partId) return;

    if (info.material) {
      applyHighlight(info.material);
    }

    handlers.onPartSelect?.(partId);
  };

  api.addEventListener('nodeMouseEnter', onNodeEnter, PICK_OPTIONS);
  api.addEventListener('nodeMouseLeave', onNodeLeave, PICK_OPTIONS);
  api.addEventListener('click', onClick, PICK_OPTIONS);

  return () => {
    cancelled = true;
    clearHighlight();
  };
}

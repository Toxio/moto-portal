export interface SketchfabSceneNode {
  instanceID: number;
  name: string;
  type?: string;
}

export interface SketchfabSceneMaterial {
  id?: string;
  name?: string;
  stateSetID?: number;
}

interface PartMatchRule {
  partId: string;
  nodePatterns: RegExp[];
  materialPatterns: RegExp[];
}

/** Порядок важен: более специфичные правила — выше */
const PART_MATCH_RULES: PartMatchRule[] = [
  {
    partId: 'front-wheel',
    nodePatterns: [/tyre_f/i, /disk_f/i, /rims_d/i, /front.*wheel/i, /wheel.*front/i],
    materialPatterns: [/^tyre_f$/i, /^disk_f_d$/i, /^rims_d$/i],
  },
  {
    partId: 'rear-wheel',
    nodePatterns: [/tyre_r/i, /disc_rear/i, /rear.*wheel/i, /wheel.*rear/i],
    materialPatterns: [/^tyre_r$/i, /^disc_rear$/i],
  },
  {
    partId: 'wheels',
    nodePatterns: [/wheel/i, /tire/i, /tyre/i, /rim/i, /disc/i, /колес/i, /шин/i],
    materialPatterns: [/wheel/i, /tire/i, /tyre/i, /rim/i, /disc/i],
  },
  {
    partId: 'engine',
    nodePatterns: [/mechanics_d/i, /radiator/i, /engine/i, /motor/i, /двиг/i],
    materialPatterns: [/^mechanics_d$/i, /^radiator$/i, /engine/i, /motor/i],
  },
  {
    partId: 'exhaust',
    nodePatterns: [/exh_/i, /detail_exhaust/i, /exhaust/i, /muffler/i, /выхлоп/i],
    materialPatterns: [/^exh_/i, /^detail_exhaust$/i, /exhaust/i, /muffler/i],
  },
  {
    partId: 'tank',
    nodePatterns: [/PAINT_1/i, /livery_m1k/i, /tank/i, /fuel/i, /бак/i],
    materialPatterns: [/PAINT_1/i, /^livery_m1k_d$/i, /tank/i, /fuel/i],
  },
  {
    partId: 'seat',
    nodePatterns: [/cockpit_d/i, /seat/i, /saddle/i, /сид/i],
    materialPatterns: [/^cockpit_d$/i, /seat/i, /saddle/i],
  },
];

function matchesPatterns(value: string | undefined, patterns: RegExp[]): boolean {
  if (!value) return false;
  return patterns.some((pattern) => pattern.test(value));
}

function extractMaterialHint(nodeName?: string): string | undefined {
  if (!nodeName) return undefined;

  const motoMatch = nodeName.match(/Moto_fb_(.+?)_\d+$/i);
  if (motoMatch?.[1]) return motoMatch[1];

  return nodeName;
}

export function resolvePartId(nodeName?: string, materialName?: string): string | null {
  const materialHint = materialName ?? extractMaterialHint(nodeName);

  for (const rule of PART_MATCH_RULES) {
    if (matchesPatterns(nodeName, rule.nodePatterns)) {
      return rule.partId;
    }
  }

  for (const rule of PART_MATCH_RULES) {
    if (matchesPatterns(materialHint, rule.materialPatterns)) {
      return rule.partId;
    }
  }

  return null;
}

function normalizeNodes(
  nodes: SketchfabSceneNode[] | Record<string, SketchfabSceneNode>,
): SketchfabSceneNode[] {
  if (Array.isArray(nodes)) return nodes;
  return Object.values(nodes);
}

function normalizeMaterials(
  materials: SketchfabSceneMaterial[] | Record<string, SketchfabSceneMaterial>,
): SketchfabSceneMaterial[] {
  if (Array.isArray(materials)) return materials;
  return Object.values(materials);
}

export function buildInstancePartMap(
  nodes: SketchfabSceneNode[] | Record<string, SketchfabSceneNode>,
): Map<number, string> {
  const map = new Map<number, string>();

  for (const node of normalizeNodes(nodes)) {
    const partId = resolvePartId(node.name);
    if (partId) {
      map.set(node.instanceID, partId);
    }
  }

  return map;
}

export function buildMaterialPartMap(
  materials: SketchfabSceneMaterial[] | Record<string, SketchfabSceneMaterial>,
): Map<string, string> {
  const map = new Map<string, string>();

  for (const material of normalizeMaterials(materials)) {
    const partId = resolvePartId(undefined, material.name);
    const key = material.id ?? String(material.stateSetID);
    if (partId && key) {
      map.set(key, partId);
    }
  }

  return map;
}

export function findMaterialForNode(
  node: SketchfabSceneNode,
  materials: SketchfabSceneMaterial[],
): SketchfabSceneMaterial | undefined {
  const hint = extractMaterialHint(node.name)?.toLowerCase();

  if (!hint) return undefined;

  return materials.find((material) => material.name?.toLowerCase() === hint);
}

export function logSketchfabScene(
  nodes: SketchfabSceneNode[] | Record<string, SketchfabSceneNode>,
  materials: SketchfabSceneMaterial[] | Record<string, SketchfabSceneMaterial>,
): void {
  if (!import.meta.env.DEV) return;

  const nodeList = normalizeNodes(nodes);
  const materialList = normalizeMaterials(materials);

  console.group('[La Moto] Sketchfab scene map');
  console.table(
    nodeList.map((node) => ({
      instanceID: node.instanceID,
      name: node.name,
      partId: resolvePartId(node.name) ?? '—',
    })),
  );
  console.table(
    materialList.map((material) => ({
      id: material.id ?? material.stateSetID,
      name: material.name,
      partId: resolvePartId(undefined, material.name) ?? '—',
    })),
  );
  console.groupEnd();

  if (typeof window !== 'undefined') {
    (window as Window & { __laMotoSketchfabScene?: unknown }).__laMotoSketchfabScene = {
      nodes: nodeList,
      materials: materialList,
    };
  }
}

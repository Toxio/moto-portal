/** Sketchfab: https://sketchfab.com/3d-models/moto-8531981223a741578626fe397b032504 */
export const SKETCHFAB_MOTO_MODEL_ID = '8531981223a741578626fe397b032504';

export const SKETCHFAB_MOTO_MODEL_URL =
  'https://sketchfab.com/3d-models/moto-8531981223a741578626fe397b032504';

export function getSketchfabEmbedUrl(modelId = SKETCHFAB_MOTO_MODEL_ID): string {
  const params = new URLSearchParams({
    autostart: '1',
    transparent: '1',
    ui_theme: 'dark',
    ui_controls: '1',
    ui_infos: '0',
    ui_stop: '0',
    scrollwheel: '1',
  });

  return `https://sketchfab.com/models/${modelId}/embed?${params.toString()}`;
}

/** Угол обзора (градусы). Больше = модель дальше. Диапазон ~45–70 */
export const DEFAULT_SKETCHFAB_FOV = 68;
/** Множитель дистанции камеры от центра модели. Больше = дальше */
export const DEFAULT_SKETCHFAB_ZOOM = 0.47;

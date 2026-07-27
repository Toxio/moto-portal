import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bikeParts } from '@/mocks/parts';
import { DEFAULT_SKETCHFAB_FOV, DEFAULT_SKETCHFAB_ZOOM } from '@/features/parts/sketchfab';
import { SketchfabMotoViewer } from '@/features/parts/SketchfabMotoViewer';
import { cn } from '@/lib/utils';

interface InteractiveBikeModelProps {
  className?: string;
  activePart?: string | null;
  onPartSelect?: (partId: string) => void;
  linkToListings?: boolean;
  viewerHeight?: number;
  /** Угол обзора (градусы). Больше = дальше */
  initialFov?: number;
  /** Множитель дистанции после recenter. 1 = дефолт, 2 = в 2 раза дальше */
  cameraZoom?: number;
}

export function InteractiveBikeModel({
  className,
  activePart,
  onPartSelect,
  linkToListings = true,
  viewerHeight = 480,
  initialFov = DEFAULT_SKETCHFAB_FOV,
  cameraZoom = DEFAULT_SKETCHFAB_ZOOM,
}: InteractiveBikeModelProps) {
  const navigate = useNavigate();
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const highlighted = activePart ?? hoveredPart;

  const handlePartClick = (partId: string) => {
    if (onPartSelect) {
      onPartSelect(partId);
      return;
    }
    if (linkToListings) {
      navigate(`/listings?tab=parts&part=${partId}`);
    }
  };

  return (
    <div className={cn('relative', className)}>
      <SketchfabMotoViewer
        height={viewerHeight}
        initialFov={initialFov}
        cameraZoom={cameraZoom}
        className="mx-auto max-w-4xl"
      />

      <p className="text-muted mt-4 text-center text-sm">
        Вращайте модель мышью, затем выберите деталь для поиска запчастей
      </p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {bikeParts.map((part) => (
          <button
            key={part.id}
            type="button"
            onClick={() => handlePartClick(part.id)}
            onMouseEnter={() => setHoveredPart(part.id)}
            onMouseLeave={() => setHoveredPart(null)}
            className={cn(
              'rounded-full border px-3 py-1.5 text-xs font-medium transition',
              (activePart === part.id || hoveredPart === part.id) &&
                'border-accent bg-accent/20 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]',
              activePart !== part.id &&
                hoveredPart !== part.id &&
                'text-muted hover:border-accent/50 border-white/10 bg-white/5 hover:text-white',
            )}
          >
            {part.name}
          </button>
        ))}
      </div>

      {highlighted && (
        <p className="text-muted mt-3 text-center text-sm">
          {bikeParts.find((p) => p.id === highlighted)?.description}
          {linkToListings && !onPartSelect && ' — нажмите, чтобы найти запчасти'}
        </p>
      )}
    </div>
  );
}

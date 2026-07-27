import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bikeParts } from '@/mocks/parts';
import {
  DEFAULT_SKETCHFAB_FOV,
  DEFAULT_SKETCHFAB_ZOOM,
  SKETCHFAB_MOTO_MODEL_URL,
} from '@/features/parts/sketchfab';
import { SketchfabMotoViewer } from '@/features/parts/SketchfabMotoViewer';
import type { PartInteractionController } from '@/features/parts/sketchfabViewer';
import { cn } from '@/lib/utils';

interface InteractiveBikeModelProps {
  className?: string;
  activePart?: string | null;
  onPartSelect?: (partId: string) => void;
  linkToListings?: boolean;
  viewerHeight?: number;
  initialFov?: number;
  cameraZoom?: number;
}

function isCoarsePointer(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;
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
  const interactionControllerRef = useRef<PartInteractionController | null>(null);
  const [hoveredPart, setHoveredPart] = useState<string | null>(null);

  const highlighted = activePart ?? hoveredPart;
  const highlightedPart = highlighted ? bikeParts.find((p) => p.id === highlighted) : null;

  const handlePartClick = useCallback(
    (partId: string) => {
      if (onPartSelect) {
        onPartSelect(partId);
        return;
      }
      if (linkToListings) {
        navigate(`/listings?tab=parts&part=${partId}`);
      }
    },
    [linkToListings, navigate, onPartSelect],
  );

  const focusPart = useCallback((partId: string | null) => {
    setHoveredPart(partId);
    interactionControllerRef.current?.highlightPart(partId, true);
  }, []);

  const handleModelPartTap = useCallback(
    (partId: string) => {
      focusPart(partId);

      if (onPartSelect) {
        onPartSelect(partId);
        return;
      }

      if (!isCoarsePointer() && linkToListings) {
        navigate(`/listings?tab=parts&part=${partId}`);
      }
    },
    [focusPart, linkToListings, navigate, onPartSelect],
  );

  const handlePartButtonPress = useCallback(
    (partId: string) => {
      focusPart(partId);
      handlePartClick(partId);
    },
    [focusPart, handlePartClick],
  );

  useEffect(() => {
    if (activePart) {
      interactionControllerRef.current?.highlightPart(activePart, true);
    }
  }, [activePart]);

  const showMobileSearchCta = Boolean(
    highlightedPart && linkToListings && !onPartSelect && isCoarsePointer(),
  );

  return (
    <div className={cn('relative', className)}>
      <div className="relative mx-auto max-w-4xl">
        <SketchfabMotoViewer
          height={viewerHeight}
          initialFov={initialFov}
          cameraZoom={cameraZoom}
          showAttribution={false}
          interactive
          interactionControllerRef={interactionControllerRef}
          isHoveringPart={Boolean(highlighted)}
          isWholeModelHighlighted={!highlighted}
          interaction={{
            onPartHover: setHoveredPart,
            onPartSelect: handleModelPartTap,
          }}
        />

        <div
          className={cn(
            'absolute inset-x-0 bottom-0 rounded-b-xl bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-10 pb-3 text-center transition-opacity duration-150',
            highlighted ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          aria-hidden={!highlighted}
        >
          {highlightedPart && (
            <>
              {showMobileSearchCta ? (
                <button
                  type="button"
                  onClick={() => handlePartClick(highlightedPart.id)}
                  className="text-accent text-sm font-medium underline-offset-2 hover:underline"
                >
                  {highlightedPart.name} — нажмите для поиска
                </button>
              ) : (
                <p className="text-accent text-sm font-medium">
                  {highlightedPart.name}
                  {linkToListings && !onPartSelect && ' — кликните для поиска'}
                </p>
              )}
              <p className="text-muted mt-0.5 text-xs">{highlightedPart.description}</p>
            </>
          )}
        </div>
      </div>

      <p className="text-muted mt-3 text-center text-sm">
        <span className="hidden sm:inline">
          Наведите на деталь в модели или выберите кнопкой ниже
        </span>
        <span className="sm:hidden">Нажмите на деталь в модели или выберите кнопкой ниже</span>
      </p>

      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {bikeParts.map((part) => (
          <button
            key={part.id}
            type="button"
            onClick={() => handlePartButtonPress(part.id)}
            onMouseEnter={() => focusPart(part.id)}
            onMouseLeave={() => focusPart(activePart ?? null)}
            onFocus={() => focusPart(part.id)}
            onBlur={() => focusPart(activePart ?? null)}
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

      <p className="text-muted mt-3 text-center text-xs">
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
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

const ZOOM_SCALE = 2.5;
const SWIPE_THRESHOLD_PX = 50;

interface ImageLightboxProps {
  images: string[];
  index: number;
  alt: string;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

/** Fullscreen image viewer: tap/click to zoom (pan by moving), swipe or arrows to change image. */
const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  index,
  alt,
  open,
  onClose,
  onIndexChange,
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const movedRef = useRef(false);
  const count = images.length;

  const go = (delta: number) => {
    if (count < 2) return;
    setZoomed(false);
    onIndexChange((index + delta + count) % count);
  };

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, index, count]);

  useEffect(() => {
    if (!open) setZoomed(false);
  }, [open]);

  if (!open || count === 0) return null;

  const setOriginFromPoint = (target: HTMLElement, clientX: number, clientY: number) => {
    const rect = target.getBoundingClientRect();
    setOrigin({
      x: Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)),
    });
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (movedRef.current) return; // it was a swipe / pan, not a tap
    setOriginFromPoint(e.currentTarget, e.clientX, e.clientY);
    setZoomed((z) => !z);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
    movedRef.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    const t = e.touches[0];
    if (!start) return;
    if (Math.abs(t.clientX - start.x) > 8 || Math.abs(t.clientY - start.y) > 8) {
      movedRef.current = true;
    }
    if (zoomed) setOriginFromPoint(e.currentTarget, t.clientX, t.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || zoomed) return;
    const dx = e.changedTouches[0].clientX - start.x;
    if (Math.abs(dx) > SWIPE_THRESHOLD_PX) go(dx < 0 ? 1 : -1);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex flex-col bg-black/95 text-white"
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} images`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-white/70">
          {count > 1 ? `${index + 1} / ${count}` : ""}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label={zoomed ? "Zoom out" : "Zoom in"}
          >
            {zoomed ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        <div
          className={cn(
            "flex h-full w-full items-center justify-center select-none",
            zoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={handleImageClick}
          onMouseDown={() => (movedRef.current = false)}
          onMouseMove={(e) => zoomed && setOriginFromPoint(e.currentTarget, e.clientX, e.clientY)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[index]}
            alt={alt}
            draggable={false}
            className="max-h-full max-w-full object-contain transition-transform duration-200 ease-out"
            style={{
              transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
              transformOrigin: `${origin.x}% ${origin.y}%`,
            }}
          />
        </div>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2 hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {images.map((image, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setZoomed(false);
                onIndexChange(i);
              }}
              className={cn(
                "h-14 w-14 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white",
                i === index ? "border-[#8DEB6E]" : "border-transparent opacity-60"
              )}
              aria-label={`View image ${i + 1}`}
            >
              <img src={image} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}
    </div>,
    document.body
  );
};

export default ImageLightbox;

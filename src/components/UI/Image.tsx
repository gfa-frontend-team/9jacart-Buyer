import React, { useState, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";
import logoImage from "../../assets/logo.png";
import { getCachedImageUrl } from "../../lib/imageCache";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: string;
  lazy?: boolean;
  cache?: boolean;
  aspectRatio?: "square" | "16/9" | "4/3" | "3/2" | "auto";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  blur?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  fallback = "/placeholder-image.jpg",
  placeholder,
  lazy = true,
  cache = true,
  aspectRatio = "auto",
  objectFit = "cover",
  blur = true,
  className,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const [currentSrc, setCurrentSrc] = useState(placeholder || "");

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || isInView) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, isInView]);

  const objectUrlRef = useRef<string | null>(null);

  // Load and optionally cache image when in view
  useEffect(() => {
    if (!isInView || hasError) return;

    const validSrc =
      typeof src === "string" && src.trim().length > 0 ? src : fallback;

    if (!cache || !validSrc.startsWith("http")) {
      setCurrentSrc(validSrc);
      return;
    }

    let cancelled = false;

    getCachedImageUrl(validSrc).then(({ url, revoke }) => {
      if (cancelled) {
        if (revoke && url) URL.revokeObjectURL(url);
        return;
      }
      if (revoke && url) objectUrlRef.current = url;
      setCurrentSrc(url || validSrc);
    });

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, [isInView, src, hasError, fallback, cache]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setCurrentSrc(fallback);
    onError?.();
  };

  const aspectRatioClasses = {
    square: "aspect-square",
    "16/9": "aspect-video",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    auto: "",
  };

  const objectFitClasses = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
    none: "object-none",
    "scale-down": "object-scale-down",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-100",
        aspectRatioClasses[aspectRatio],
        className
      )}
    >
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        </div>
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={typeof currentSrc === "string" ? currentSrc : fallback}
        alt={alt}
        className={cn(
          "w-full h-full transition-all duration-300",
          objectFitClasses[objectFit],
          isLoading && blur ? "blur-sm scale-105" : "blur-0 scale-100",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? "lazy" : "eager"}
        {...props}
      />

      {/* Error state */}
      {hasError && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <img
              src={logoImage}
              alt="Logo"
              className="w-32 h-32 mx-auto mb-2 grayscale opacity-80 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { Image };

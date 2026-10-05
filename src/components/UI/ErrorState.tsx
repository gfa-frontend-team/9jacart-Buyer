import React from "react";
import { WifiOff, ServerCrash, SearchX, AlertTriangle, RotateCcw, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { getErrorKind, type ErrorKind } from "@/lib/errorKind";

const CONTENT: Record<ErrorKind, { icon: React.ElementType; title: string; message: string }> = {
  network: {
    icon: WifiOff,
    title: "You seem to be offline",
    message: "We couldn't reach 9ja-cart. Check your internet connection and try again.",
  },
  server: {
    icon: ServerCrash,
    title: "We're having a little trouble",
    message: "Our servers are taking a quick break. Please try again in a moment.",
  },
  notfound: {
    icon: SearchX,
    title: "Page not found",
    message: "The page you're looking for doesn't exist or may have been moved.",
  },
  generic: {
    icon: AlertTriangle,
    title: "Something went wrong",
    message: "An unexpected problem occurred. Please try again.",
  },
};

interface ErrorStateProps {
  /** The thrown error or error message; used to pick the right message. */
  error?: unknown;
  /** Force a specific kind instead of detecting it from `error`. */
  kind?: ErrorKind;
  title?: string;
  message?: string;
  /** Retry handler. Defaults to reloading the page. Pass `null` to hide the button. */
  onRetry?: (() => void) | null;
  showHomeButton?: boolean;
  /** `page` fills the viewport area; `inline` fits inside a section. */
  variant?: "page" | "inline";
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  kind,
  title,
  message,
  onRetry,
  showHomeButton = true,
  variant = "page",
  className,
}) => {
  const resolvedKind = kind ?? getErrorKind(error);
  const content = CONTENT[resolvedKind];
  const Icon = content.icon;
  const retry = onRetry === undefined ? () => window.location.reload() : onRetry;
  const isPage = variant === "page";

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center justify-center px-4",
        isPage ? "min-h-[70vh] py-12" : "py-8",
        className
      )}
    >
      <div className="w-full max-w-md text-center">
        <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-[#8DEB6E]/25 animate-ping [animation-duration:2.5s]" aria-hidden />
          <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#8DEB6E]/40 to-[#8DEB6E]/10 ring-1 ring-[#8DEB6E]/50">
            <Icon className="h-10 w-10 text-primary" aria-hidden />
          </span>
        </div>

        {resolvedKind === "notfound" && isPage && (
          <p className="mb-2 text-5xl font-extrabold tracking-tight text-primary">404</p>
        )}

        <h1 className={cn("font-bold text-gray-900", isPage ? "text-2xl sm:text-3xl" : "text-xl")}>
          {title ?? content.title}
        </h1>
        <p className="mt-3 text-gray-600">{message ?? content.message}</p>

        <div className="mt-8 flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          {showHomeButton && (
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-white px-5 py-2.5 font-medium text-primary transition-colors hover:bg-[#8DEB6E]/15"
            >
              <Home className="h-4 w-4" aria-hidden />
              Go to homepage
            </a>
          )}
          {retry && resolvedKind !== "notfound" && (
            <button
              type="button"
              onClick={retry}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorState;

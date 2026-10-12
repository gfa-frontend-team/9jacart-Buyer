/** Classifies thrown values / error messages into user-facing error kinds. */
export type ErrorKind = "network" | "server" | "notfound" | "generic";

const getErrorText = (error: unknown): string => {
  if (!error) return "";
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null) {
    const e = error as { message?: unknown; statusText?: unknown; data?: unknown };
    if (typeof e.message === "string") return e.message;
    if (typeof e.statusText === "string") return e.statusText;
    if (typeof e.data === "string") return e.data;
  }
  return "";
};

const getErrorStatus = (error: unknown): number | undefined => {
  if (typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    return typeof status === "number" ? status : undefined;
  }
  return undefined;
};

/** Classifies any thrown value / error string into a user-facing error kind. */
export function getErrorKind(error: unknown): ErrorKind {
  if (typeof navigator !== "undefined" && navigator.onLine === false) return "network";

  const status = getErrorStatus(error);
  const text = getErrorText(error).toLowerCase();

  if (status === 404) return "notfound";
  if (
    status === 0 ||
    text.includes("network") ||
    text.includes("failed to fetch") ||
    text.includes("connect") ||
    text.includes("internet") ||
    text.includes("dynamically imported module") ||
    text.includes("loading chunk") ||
    text.includes("load failed")
  ) {
    return "network";
  }
  if ((status !== undefined && (status >= 500 || status === 408)) || /timeout|server|on our end|longer than usual/.test(text)) {
    return "server";
  }
  return "generic";
}


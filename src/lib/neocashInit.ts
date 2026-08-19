import { init as initBnplWidget } from "@neocash/bnpl-widget";
import type { InitOptions, WidgetHandle } from "@neocash/bnpl-widget";
import { setBnplWidgetOpen } from "./bnplOverlayState";
import { config } from "./config";

export type NeoCashInitOptions = Omit<InitOptions, "publicKey" | "assetPrefix">;

/**
 * Mount NeoCash via the npm bundle. Omits CDN `assetPrefix` so the liveness
 * chunk resolves from installed `@aws-amplify/ui-react-liveness` peers.
 */
export function initNeoCashBnplWidget(options: NeoCashInitOptions): WidgetHandle {
  const { onClose, onError, ...rest } = options;

  const handle = initBnplWidget({
    ...rest,
    publicKey: config.neocash.publicKey,
    onClose: () => {
      setBnplWidgetOpen(false);
      onClose?.();
    },
    onError: (err) => {
      setBnplWidgetOpen(false);
      onError?.(err);
    },
  });

  setBnplWidgetOpen(true);
  return handle;
}

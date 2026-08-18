/** Shared flag so Layout popups skip while the NeoCash checkout overlay is open. */
let bnplWidgetOpen = false;

export function setBnplWidgetOpen(open: boolean): void {
  bnplWidgetOpen = open;
}

export function isBnplWidgetOpen(): boolean {
  return bnplWidgetOpen;
}

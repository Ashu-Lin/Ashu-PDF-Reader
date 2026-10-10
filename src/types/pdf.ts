export type ZoomMode = "fit" | "manual";

export interface ReaderShortcutActions {
  openFile: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  fitWidth: () => void;
  toggleCommands: () => void;
  closeOverlay: () => void;
}

import type React from "react";
import { useShortcut } from "../hooks/use-shortcut";

export interface FlashcardShorcutLayerProps {
  triggerFlip: () => void;
  triggerPrev: () => void;
  triggerNext: () => void;
}

export const FlashcardShorcutLayer: React.FC<FlashcardShorcutLayerProps> = ({
  triggerFlip,
  triggerPrev,
  triggerNext,
}) => {
  useShortcut([" "], triggerFlip, false, true);
  useShortcut(["ArrowRight"], triggerNext, false, true);
  useShortcut(["ArrowLeft"], triggerPrev, false, true);

  return null;
};

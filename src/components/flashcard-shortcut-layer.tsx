import React from "react";
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
  useShortcut([" "], triggerFlip, false, undefined, true);
  useShortcut(["ArrowRight"], triggerNext, false, undefined, true);
  useShortcut(["ArrowLeft"], triggerPrev, false, undefined, true);

  return null;
};

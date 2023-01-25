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
  useShortcut([" "], triggerFlip, false);
  useShortcut(["ArrowRight"], triggerNext, false);
  useShortcut(["ArrowLeft"], triggerPrev, false);

  return null;
};

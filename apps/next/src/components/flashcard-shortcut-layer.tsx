import type React from "react";

import { useShortcut } from "@quenti/lib/hooks/use-shortcut";

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
  useShortcut([" "], triggerFlip, {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["ArrowRight"], triggerNext, {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["ArrowLeft"], triggerPrev, {
    ctrlKey: false,
    allowInput: true,
  });

  return null;
};

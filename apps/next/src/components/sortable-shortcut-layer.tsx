import type React from "react";

import { useShortcut } from "@quenti/lib/hooks/use-shortcut";

export interface SortableShortcutLayer {
  triggerFlip: () => void;
  triggerStillLearning: () => void;
  triggerKnow: () => void;
}

export const SortableShortcutLayer: React.FC<SortableShortcutLayer> = ({
  triggerFlip,
  triggerStillLearning,
  triggerKnow,
}) => {
  useShortcut([" "], triggerFlip, {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["1"], triggerStillLearning, {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["2"], triggerKnow, {
    ctrlKey: false,
    allowInput: true,
  });

  return null;
};

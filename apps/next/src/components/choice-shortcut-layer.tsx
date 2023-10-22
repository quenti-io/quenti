import type React from "react";

import { useShortcut } from "@quenti/lib/hooks/use-shortcut";

export interface ChoiceShortcutLayerProps {
  choose: (index: number) => void;
}

export const ChoiceShortcutLayer: React.FC<ChoiceShortcutLayerProps> = ({
  choose,
}) => {
  useShortcut(["1"], () => choose(0), {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["2"], () => choose(1), {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["3"], () => choose(2), {
    ctrlKey: false,
    allowInput: true,
  });
  useShortcut(["4"], () => choose(3), {
    ctrlKey: false,
    allowInput: true,
  });

  return null;
};

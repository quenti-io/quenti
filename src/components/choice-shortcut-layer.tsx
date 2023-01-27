import React from "react";
import { useShortcut } from "../hooks/use-shortcut";

export interface ChoiceShortcutLayerProps {
  choose: (index: number) => void;
}

export const ChoiceShortcutLayer: React.FC<ChoiceShortcutLayerProps> = ({
  choose,
}) => {
  useShortcut(["1"], () => choose(0), false, undefined, true);
  useShortcut(["2"], () => choose(1), false, undefined, true);
  useShortcut(["3"], () => choose(2), false, undefined, true);
  useShortcut(["4"], () => choose(3), false, undefined, true);

  return null;
};

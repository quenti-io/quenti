import { useShortcut } from "../../hooks/use-shortcut";

export const AnyKeyPressLayer = ({ onSubmit }: { onSubmit: () => void }) => {
  useShortcut([], onSubmit, {
    ctrlKey: false,
    allowInput: true,
  });
  return null;
};

import { useShortcut } from "@quenti/lib/hooks/use-shortcut";

import { Center, useColorModeValue } from "@chakra-ui/react";

import { PhotoContainer } from "./photo-container";
import { PhotoPortal } from "./photo-portal";

interface InternalViewProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  currentRef: HTMLElement | null;
  currentSrc?: string;
  borderRadius: number;
}

export const InternalView: React.FC<InternalViewProps> = ({
  visible,
  setVisible,
  currentRef,
  currentSrc,
  borderRadius,
}) => {
  return (
    <PhotoPortal pointerEvents={visible ? "auto" : "none"}>
      <Center
        w="full"
        h="full"
        bg=""
        backdropFilter="blur(8px)"
        backgroundColor={useColorModeValue(
          "rgba(247, 250, 252, 75%)",
          "rgba(23, 25, 35, 40%)",
        )}
        transition="opacity 0.2s ease-in-out"
        opacity={visible ? 1 : 0}
        onClick={() => {
          setVisible(false);
        }}
      >
        {visible && <EscLayer onClose={() => setVisible(false)} />}
        <PhotoContainer
          visible={visible}
          src={currentSrc}
          origin={currentRef}
          borderRadius={borderRadius}
        />
      </Center>
    </PhotoPortal>
  );
};

const EscLayer: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useShortcut(["Escape"], onClose, { ctrlKey: false, allowInput: false });

  return null;
};

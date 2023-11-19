import React from "react";

import { Center, useColorModeValue } from "@chakra-ui/react";

import { PhotoContainer } from "./photo-container";
import { PhotoPortal } from "./photo-portal";

interface PhotoViewContextProps {
  show: (src: string, id: string, borderRadius?: number) => void;
}

export const PhotoViewContext = React.createContext<PhotoViewContextProps>({
  show: () => undefined,
});

export const PhotoViewProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [currentId, setCurrentId] = React.useState<string>();
  const [currentSrc, setCurrentSrc] = React.useState<string>();
  const [borderRadius, setBorderRadius] = React.useState<number>(0);

  return (
    <PhotoViewContext.Provider
      value={{
        show: (src, id, borderRadius) => {
          setCurrentSrc(src);
          setCurrentId(id);
          setVisible(true);
          setBorderRadius(borderRadius || 0);
        },
      }}
    >
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
          <PhotoContainer
            visible={visible}
            src={currentSrc}
            originId={currentId}
            borderRadius={borderRadius}
          />
        </Center>
      </PhotoPortal>
      {children}
    </PhotoViewContext.Provider>
  );
};

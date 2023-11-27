import dynamic from "next/dynamic";
import React from "react";

const InternalView = dynamic(
  () => import("./internal-view").then((mod) => mod.InternalView),
  {
    ssr: false,
  },
);

interface PhotoViewContextProps {
  show: (src: string, elem: HTMLElement, borderRadius?: number) => void;
}

export const PhotoViewContext = React.createContext<PhotoViewContextProps>({
  show: () => undefined,
});

export const PhotoViewProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [currentRef, setCurrentRef] = React.useState<HTMLElement | null>(null);
  const [currentSrc, setCurrentSrc] = React.useState<string>();
  const [borderRadius, setBorderRadius] = React.useState<number>(0);

  return (
    <PhotoViewContext.Provider
      value={{
        show: (src, ref, borderRadius) => {
          setCurrentSrc(src);
          setCurrentRef(ref);
          setVisible(true);
          setBorderRadius(borderRadius || 0);
        },
      }}
    >
      <InternalView
        visible={visible}
        setVisible={setVisible}
        currentRef={currentRef}
        currentSrc={currentSrc}
        borderRadius={borderRadius}
      />
      {children}
    </PhotoViewContext.Provider>
  );
};

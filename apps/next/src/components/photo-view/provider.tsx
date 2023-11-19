import dynamic from "next/dynamic";
import React from "react";

const InternalView = dynamic(
  () => import("./internal-view").then((mod) => mod.InternalView),
  {
    ssr: false,
  },
);

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
      <InternalView
        visible={visible}
        setVisible={setVisible}
        currentId={currentId}
        currentSrc={currentSrc}
        borderRadius={borderRadius}
      />
      {children}
    </PhotoViewContext.Provider>
  );
};

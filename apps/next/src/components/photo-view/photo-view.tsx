import React, { Children, cloneElement } from "react";

import { PhotoViewContext } from "./provider";

interface PhotoViewProps {
  src: string;
  children?: React.ReactElement;
  borderRadius?: number;
}

export const PhotoView: React.FC<PhotoViewProps> = ({
  src,
  children,
  borderRadius,
}) => {
  const context = React.useContext(PhotoViewContext);
  const originRef = React.useRef<HTMLElement>(null);

  if (children) {
    return Children.only(
      cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          context.show(src, originRef.current!, borderRadius);
        },
        ref: originRef,
      }),
    );
  }
  return null;
};

import React from "react";

import { Box } from "@chakra-ui/react";

interface PhotoContainerProps {
  visible: boolean;
  src?: string;
  origin: HTMLElement | null;
  borderRadius?: number;
}

export const PhotoContainer: React.FC<PhotoContainerProps> = ({
  visible,
  src,
  origin,
  borderRadius,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [originalWidth, setOriginalWidth] = React.useState<number>();
  const [originalHeight, setOriginalHeight] = React.useState<number>();
  const originalWidthRef = React.useRef<number>();
  const originalHeightRef = React.useRef<number>();
  originalWidthRef.current = originalWidth;
  originalHeightRef.current = originalHeight;

  const [rounded, setRounded] = React.useState<number>(0);
  const [height, setHeight] = React.useState<number>();
  const [width, setWidth] = React.useState<number>();

  const [x, setX] = React.useState(0);
  const [y, setY] = React.useState(0);
  const [animate, setAnimate] = React.useState(false);

  const [scale, setScale] = React.useState(1);
  const scaleRef = React.useRef<number>();
  scaleRef.current = scale;

  const setBounded = () => {
    if (!origin || !containerRef.current) return;

    const originWidth = origin.offsetWidth;
    const containerWidth = containerRef.current.offsetWidth;
    const scale =
      originWidth && containerWidth ? originWidth / containerWidth : 1;
    const originRect = origin.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    setRounded((borderRadius || 0) / scale);

    setOriginalWidth(containerRect.width);
    setOriginalHeight(containerRect.height);

    setX(originRect.left - containerRect.left);
    setY(originRect.top - containerRect.top);

    setScale(scale);
    setWidth(originRect.width / scale);
    setHeight(originRect.height / scale);
  };

  React.useLayoutEffect(() => {
    setBounded();

    if (visible) {
      setTimeout(() => {
        setAnimate(true);
        setX(0);
        setY(0);
        setScale(1);
        setRounded(8);
        setWidth(originalWidthRef.current);
        setHeight(originalHeightRef.current);
      }, 10);
    } else {
      setTimeout(() => {
        setAnimate(false);
        setOriginalHeight(undefined);
        setOriginalWidth(undefined);
        setHeight(undefined);
        setWidth(undefined);
      }, 300);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!src || !origin) return null;

  return (
    <Box ref={containerRef} width={originalWidth} height={originalHeight}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Photo preview"
        src={src}
        className={
          animate
            ? "transition-[width,height,transform,border-radius] duration-[500ms]"
            : ""
        }
        style={{
          width,
          height,
          cursor: "zoom-out",
          borderRadius: rounded,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
          transformOrigin: "top left",
          overflow: "hidden",
          objectFit: "cover",
        }}
      />
    </Box>
  );
};

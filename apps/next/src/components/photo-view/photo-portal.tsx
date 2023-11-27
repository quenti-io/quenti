import React from "react";
import { createPortal } from "react-dom";

import { Box, type BoxProps } from "@chakra-ui/react";

export const PhotoPortal = ({
  container = document.body,
  ...props
}: React.PropsWithChildren<BoxProps> & {
  container?: HTMLElement;
}) => {
  return createPortal(
    <Box
      position="fixed"
      role="dialog"
      top="0"
      left="0"
      width="100%"
      height="100%"
      zIndex={2000}
      overflow="hidden"
      style={{
        touchAction: "none",
      }}
      {...props}
    />,
    container,
  );
};

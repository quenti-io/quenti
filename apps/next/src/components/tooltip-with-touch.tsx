import React from "react";

import { Box, Tooltip, type TooltipProps } from "@chakra-ui/react";

export const TooltipWithTouch: React.FC<
  React.PropsWithChildren<TooltipProps> & {
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
    onClick?: () => void;
  }
> = ({ children, ...props }) => {
  const [isLabelOpen, setIsLabelOpen] = React.useState(false);

  return (
    <Tooltip isOpen={isLabelOpen} {...props}>
      <Box
        onMouseEnter={() => {
          setIsLabelOpen(true);
          props.onMouseEnter?.();
        }}
        onMouseLeave={() => {
          setIsLabelOpen(false);
          props.onMouseLeave?.();
        }}
        onClick={() => {
          setIsLabelOpen(true);
          props.onClick?.();
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};

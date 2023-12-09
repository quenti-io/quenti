import { motion } from "framer-motion";
import React from "react";

import { Box, Flex, HStack, useColorModeValue } from "@chakra-ui/react";

interface SegmentedProgressProps {
  steps: number;
  currentStep: number;
  clickable?: boolean;
  disableFrom?: number;
  onClick?: (step: number) => void;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
  steps,
  currentStep,
  clickable = false,
  disableFrom,
  onClick,
}) => {
  const [currentHover, setCurrentHover] = React.useState<number | null>(null);

  return (
    <HStack h="12px">
      {Array.from({ length: steps }).map((_, i) => (
        <Segment
          key={i}
          step={i}
          currentStep={currentStep}
          clickable={clickable && (!disableFrom || i < disableFrom)}
          width={
            i == currentHover
              ? "120%"
              : currentHover !== 0 &&
                  currentHover !== steps - 1 &&
                  (i + 1 == currentHover || i - 1 == currentHover)
                ? "90%"
                : (currentHover === 0 && i === 1) ||
                    (currentHover === steps - 1 && i === steps - 2)
                  ? "80%"
                  : "100%"
          }
          height={i == currentHover ? "12px" : "6px"}
          onHover={(hover) => {
            if (!clickable || (disableFrom && i >= disableFrom)) return;
            if (hover) setCurrentHover(i);
            else setCurrentHover(null);
          }}
          onClick={() => {
            if (!clickable || (disableFrom && i >= disableFrom)) return;
            onClick?.(i);
          }}
        />
      ))}
    </HStack>
  );
};

interface SegmentProps {
  step: number;
  currentStep: number;
  clickable: boolean;
  width: string;
  height: string;
  onHover: (hover: boolean) => void;
  onClick?: () => void;
}

const Segment: React.FC<SegmentProps> = ({
  step,
  width,
  height,
  currentStep,
  clickable,
  onHover,
  onClick,
}) => {
  const bg = useColorModeValue("gray.100", "gray.750");
  const hoverBg = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex
      h="20px"
      w={width}
      alignItems="center"
      transition="all 0.2s ease"
      role="group"
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onClick={onClick}
      cursor={clickable ? "pointer" : "default"}
    >
      <Box
        bg={bg}
        w="full"
        h={height}
        rounded="full"
        position="relative"
        overflow="hidden"
        transition="all 0.2s ease"
        _groupHover={clickable ? { bg: hoverBg } : {}}
      >
        <motion.div
          initial={step >= currentStep ? { width: 0 } : { width: "100%" }}
          animate={step > currentStep ? { width: 0 } : { width: "100%" }}
          transition={{ easings: ["easeOut"], duration: 0.1 }}
          style={{
            position: "absolute",
            transition: "all 0.2s ease",
            top: 0,
            left: 0,
            height,
            backgroundColor: "#4b83ff",
            borderRadius: "3px",
          }}
        />
      </Box>
    </Flex>
  );
};

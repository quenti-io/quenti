import { Box, HStack, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

interface SegmentedProgressProps {
  steps: number;
  currentStep: number;
}

export const SegmentedProgress: React.FC<SegmentedProgressProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <HStack>
      {Array.from({ length: steps }).map((_, i) => (
        <Segment key={i} step={i} currentStep={currentStep} />
      ))}
    </HStack>
  );
};

interface SegmentProps {
  step: number;
  currentStep: number;
}

const Segment: React.FC<SegmentProps> = ({ step, currentStep }) => {
  const bg = useColorModeValue("gray.100", "gray.750");

  return (
    <Box
      bg={bg}
      h="6px"
      w="full"
      rounded="full"
      position="relative"
      overflow="hidden"
    >
      <motion.div
        initial={step >= currentStep ? { width: 0 } : { width: "100%" }}
        animate={step > currentStep ? { width: 0 } : { width: "100%" }}
        transition={{ easings: ["easeOut"] }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 6,
          backgroundColor: "#4b83ff",
          borderRadius: "3px",
        }}
      />
    </Box>
  );
};

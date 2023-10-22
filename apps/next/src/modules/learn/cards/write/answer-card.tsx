import React from "react";

import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../../../components/animated-icons/check";
import { AnimatedXCircle } from "../../../../components/animated-icons/x";
import { ScriptFormatter } from "../../../../components/script-formatter";

export interface AnswerCardProps {
  text: string | React.ReactNode;
  correct: boolean;
  skipped?: boolean;
  showIcon?: boolean;
}

export const AnswerCard: React.FC<AnswerCardProps> = ({
  text,
  correct,
  skipped = false,
  showIcon = true,
}) => {
  // const correctColor = useColorModeValue("green.500", "green.200");
  // const incorrectColor = useColorModeValue("red.500", "red.200");

  const greenText = useColorModeValue("green.600", "green.200");
  const redText = useColorModeValue("red.600", "red.200");
  const correctColor = useColorModeValue(
    "rgba(47, 133, 90, 0.2)",
    "rgba(154, 230, 180, 0.2)",
  );
  const incorrectColor = useColorModeValue(
    "rgba(197, 48, 48, 0.2)",
    "rgba(252, 129, 129, 0.2)",
  );

  const skipBorderColor = useColorModeValue("gray.200", "gray.600");
  const grayColor = useColorModeValue("gray.600", "gray.300");

  return (
    <Box
      w="full"
      px="8"
      py="4"
      border="2px"
      borderColor={
        correct ? correctColor : !skipped ? incorrectColor : skipBorderColor
      }
      color={correct ? greenText : !skipped ? redText : grayColor}
      rounded="xl"
    >
      <Flex alignItems="center" w="full" gap={4}>
        {showIcon ? (
          <div style={{ transform: "scale(1.125)" }}>
            {correct ? <AnimatedCheckCircle /> : <AnimatedXCircle />}
          </div>
        ) : (
          <div style={{ width: 24, height: 24 }} />
        )}
        <Text
          whiteSpace="normal"
          color={!skipped ? (correct ? greenText : redText) : grayColor}
          textAlign="start"
          fontWeight={500}
        >
          {typeof text === "string" ? (
            <ScriptFormatter>{text}</ScriptFormatter>
          ) : (
            text
          )}
        </Text>
      </Flex>
    </Box>
  );
};

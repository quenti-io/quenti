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
  const correctBg = useColorModeValue("green.200", "green.600");
  const correctColor = useColorModeValue("green.600", "green.200");
  const incorrectColor = useColorModeValue("red.600", "red.200");

  const grayColor = useColorModeValue("gray.600", "gray.400");
  const textColor = useColorModeValue("gray.900", "whiteAlpha.900");

  return (
    <Box
      w="full"
      px="8"
      py="4"
      border="2px"
      bg={correct ? correctBg : "transparent"}
      borderColor={
        correct ? correctColor : !skipped ? incorrectColor : grayColor
      }
      color={correct ? correctColor : !skipped ? incorrectColor : grayColor}
      rounded="lg"
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
          color={!skipped ? textColor : grayColor}
          textAlign="start"
          fontWeight="normal"
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

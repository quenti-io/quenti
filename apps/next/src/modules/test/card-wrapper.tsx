import { TestQuestionType } from "@quenti/interfaces";

import { Box, Card, Fade, Stack, useColorModeValue } from "@chakra-ui/react";

import { MatchCard } from "./cards/match-card";
import { MultipleChoiceCard } from "./cards/multiple-choice-card";
import { TrueFalseCard } from "./cards/true-false-card";
import { WriteCard } from "./cards/write-card";

export interface CardWrapperProps {
  type: TestQuestionType;
  i: number;
  correctness?: boolean;
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  type,
  i,
  correctness,
}) => {
  const card = (type: TestQuestionType, i: number) => {
    const result = correctness !== undefined;

    switch (type) {
      case TestQuestionType.TrueFalse:
        return <TrueFalseCard i={i} result={result} />;
      case TestQuestionType.MultipleChoice:
        return <MultipleChoiceCard i={i} result={result} />;
      case TestQuestionType.Match:
        return <MatchCard i={i} result={result} />;
      case TestQuestionType.Write:
        return <WriteCard i={i} result={result} />;
      default:
        return null;
    }
  };

  const correctColor = useColorModeValue("#38a169", "#68d391");
  const incorrectColor = useColorModeValue("#e53e3e", "#fc8181");

  return (
    <Card
      id={`test-card-${i}`}
      bg="white"
      borderWidth="2px"
      borderColor="gray.100"
      _dark={{
        bg: "gray.750",
        borderColor: "gray.700",
      }}
      rounded="2xl"
      position="relative"
    >
      {correctness !== undefined && (
        <Fade
          in
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: -1,
          }}
          transition={{
            enter: {
              duration: 2,
            },
          }}
        >
          <Box
            w="full"
            h="full"
            background="transparent"
            rounded="2xl"
            boxShadow={`0 -15px 60px -5px ${
              correctness ? correctColor : incorrectColor
            }`}
            opacity="0.1"
            zIndex={-1}
          />
        </Fade>
      )}
      <Stack
        spacing={6}
        px={{ base: 5, sm: 6, md: 8 }}
        py={{ base: 5, sm: 5, md: 7 }}
      >
        {card(type, i)}
      </Stack>
    </Card>
  );
};

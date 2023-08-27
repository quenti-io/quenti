import { TestQuestionType } from "@quenti/interfaces";

import { Card, Stack } from "@chakra-ui/react";

import { MatchCard } from "./cards/match-card";
import { MultipleChoiceCard } from "./cards/multiple-choice-card";
import { TrueFalseCard } from "./cards/true-false-card";

export const CardWrapper: React.FC<{ type: TestQuestionType; i: number }> = ({
  type,
  i,
}) => {
  const card = (type: TestQuestionType, i: number) => {
    switch (type) {
      case TestQuestionType.TrueFalse:
        return <TrueFalseCard i={i} />;
      case TestQuestionType.MultipleChoice:
        return <MultipleChoiceCard i={i} />;
      case TestQuestionType.Match:
        return <MatchCard i={i} />;
      default:
        return null;
    }
  };

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
    >
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

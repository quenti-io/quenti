import { shuffleArray } from "@quenti/lib/array";
import type { Term } from "@quenti/prisma/client";

import { SimpleGrid } from "@chakra-ui/react";

import { word } from "../../../stores/use-learn-store";
import { useTestContext } from "../../../stores/use-test-store";
import { Clickable } from "../clickable";
import { PromptDisplay } from "../prompt-display";
import { useCardSelector } from "../use-card-selector";

export const MultipleChoiceCard = ({ i }: { i: number }) => {
  const q = useTestContext((s) => s.timeline[i]!);

  const entry = q.entries[0]!;
  const distractors = entry.distractors;

  const choices = shuffleArray(distractors.concat(entry.term));

  return (
    <>
      <PromptDisplay
        label={q.answerMode == "Definition" ? "Term" : "Definition"}
        content={word(q.answerMode, entry.term, "prompt")}
      />
      <Choices i={i} choices={choices} />
    </>
  );
};

const Choices = ({ i: index, choices }: { i: number; choices: Term[] }) => {
  const { q, isAnswered, answer } = useCardSelector(index);

  const answerQuestion = useTestContext((s) => s.answerQuestion);
  const clearAnswer = useTestContext((s) => s.clearAnswer);

  return (
    <SimpleGrid columns={2} gap="6">
      {choices.map((choice, i) => (
        <Clickable
          key={i}
          isSelected={isAnswered && answer?.term == choice.id}
          onClick={() => {
            if (!(isAnswered && answer?.term == choice.id))
              answerQuestion(index, 0, choice.id);
            else clearAnswer(index, 0);
          }}
        >
          {word(q.answerMode, choice, "answer")}
        </Clickable>
      ))}
    </SimpleGrid>
  );
};

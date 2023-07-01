import { Button, Flex, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { diffChars } from "diff";
import { motion, useAnimationControls } from "framer-motion";
import levenshtein from "js-levenshtein";
import React from "react";
import { ScriptFormatter } from "../../../../components/script-formatter";
import { useSet } from "../../../../hooks/use-set";
import type { Question } from "../../../../interfaces/question";
import { useLearnContext, word } from "../../../../stores/use-learn-store";
import { api } from "../../../../utils/api";
import { getRandom } from "../../../../utils/array";
import { AnswerCard } from "./answer-card";

export interface IncorrectStateProps {
  active: Question;
  guess?: string;
}

export const IncorrectState: React.FC<IncorrectStateProps> = ({
  active,
  guess,
}) => {
  const { container } = useSet();
  const overrideCorrect = useLearnContext((s) => s.overrideCorrect);

  const feedbackBank = useLearnContext((s) => s.feedbackBank);
  const [remark] = React.useState(getRandom(feedbackBank.incorrect));

  const put = api.studiableTerms.put.useMutation();

  const controls = useAnimationControls();
  const colorScheme = useColorModeValue("red.600", "red.200");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const fullStackRef = React.useRef<HTMLDivElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);

  const [checkVisible, setCheckVisible] = React.useState(false);

  const handleOverrideCorrect = () => {
    overrideCorrect();

    void (async () =>
      await put.mutateAsync({
        id: active.term.id,
        containerId: container.id,
        mode: "Learn",
        correctness: 2,
        appearedInRound: active.term.appearedInRound || 0,
        incorrectCount: active.term.incorrectCount,
      }))();
  };

  React.useEffect(() => {
    setTimeout(() => {
      void (async () => {
        controls.set({
          height: `${stackRef.current!.offsetHeight}px`,
        });
        await controls.start({
          height: `${fullStackRef.current!.offsetHeight}px`,
          transition: {
            duration: 0.5,
            delay: 0.5,
          },
        });
      })();
    });

    setTimeout(() => setCheckVisible(true), 1000);
  }, [controls]);

  const diff = guess
    ? diffChars(guess, word(active.answerMode, active.term, "answer"))
    : [];
  const showDiff = guess
    ? levenshtein(guess, word(active.answerMode, active.term, "answer")) <= 3
    : false;

  return (
    <motion.div
      style={{
        overflow: "hidden",
      }}
      animate={controls}
    >
      <Stack spacing={6} marginTop="0" ref={fullStackRef}>
        <Stack spacing={4} ref={stackRef} marginTop="0">
          <Flex
            justifyContent="space-between"
            alignItems={{ base: "flex-start", md: "center" }}
            flexDir={{ base: "column", md: "row" }}
            w="full"
            gap={{ base: 2, md: 4 }}
          >
            <Text fontWeight={600} color={guess ? colorScheme : grayText}>
              {guess ? remark : "You skipped this term"}
            </Text>
            {guess && (
              <Button
                size="sm"
                flexShrink="0"
                variant="ghost"
                onClick={handleOverrideCorrect}
                px={{ base: 0, md: 3 }}
              >
                Override: I was correct
              </Button>
            )}
          </Flex>
          <AnswerCard
            text={guess || "Skipped"}
            correct={false}
            skipped={!guess}
          />
        </Stack>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 1 } }}
        >
          <Stack spacing={4}>
            <Text fontWeight={600} color={grayText}>
              Correct answer
            </Text>
            <AnswerCard
              text={
                <>
                  {showDiff ? (
                    diff.map((x, i) =>
                      x.added && x.value.length <= 3 ? (
                        <b key={i}>
                          <ScriptFormatter>{x.value}</ScriptFormatter>
                        </b>
                      ) : x.removed ? (
                        ""
                      ) : (
                        <ScriptFormatter>{x.value}</ScriptFormatter>
                      )
                    )
                  ) : (
                    <ScriptFormatter>
                      {word(active.answerMode, active.term, "answer")}
                    </ScriptFormatter>
                  )}
                </>
              }
              correct
              showIcon={checkVisible}
            />
          </Stack>
        </motion.div>
      </Stack>
    </motion.div>
  );
};

import { diffChars } from "diff";
import { motion, useAnimationControls } from "framer-motion";
import levenshtein from "js-levenshtein";
import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import React from "react";

import { GenericLabel } from "@quenti/components";
import type { Question } from "@quenti/interfaces";
import { getRandom } from "@quenti/lib/array";
import { api } from "@quenti/trpc";

import { Button, Flex, Stack } from "@chakra-ui/react";

import { IconProgressCheck } from "@tabler/icons-react";

import { ScriptFormatter } from "../../../../components/script-formatter";
import { useAuthedSet } from "../../../../hooks/use-set";
import { useLearnContext } from "../../../../stores/use-learn-store";
import { word } from "../../../../utils/terms";
import { AnswerCard } from "./answer-card";

export interface IncorrectStateProps {
  active: Question;
  guess?: string;
}

export const IncorrectState: React.FC<IncorrectStateProps> = ({
  active,
  guess,
}) => {
  const session = useSession();
  const { container } = useAuthedSet();
  const overrideCorrect = useLearnContext((s) => s.overrideCorrect);

  const feedbackBank = useLearnContext((s) => s.feedbackBank);
  const [remark] = React.useState(getRandom(feedbackBank.incorrect));

  const put = api.studiableTerms.put.useMutation();

  const controls = useAnimationControls();

  const fullStackRef = React.useRef<HTMLDivElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);

  const [checkVisible, setCheckVisible] = React.useState(false);

  const handleOverrideCorrect = () => {
    overrideCorrect();

    log.info("learn.write.overrideCorrect", {
      userId: session.data?.user?.id,
      containerId: container.id,
      termId: active.term.id,
      guess,
      answer: word(active.answerMode, active.term, "answer"),
    });

    put.mutate({
      id: active.term.id,
      containerId: container.id,
      mode: "Learn",
      correctness: 2,
      appearedInRound: active.term.appearedInRound || 0,
      incorrectCount: active.term.incorrectCount,
    });
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
      <Stack spacing={6} marginTop="0" ref={fullStackRef} pb="2">
        <Stack spacing="2" ref={stackRef} marginTop="0">
          <Flex
            justifyContent="space-between"
            alignItems={{ base: "flex-start", md: "center" }}
            flexDir={{ base: "column", md: "row" }}
            w="full"
            gap={{ base: 0, md: 4 }}
          >
            <GenericLabel evaluation={guess ? false : undefined}>
              {guess ? remark : "You skipped this term"}
            </GenericLabel>
            {guess && (
              <Button
                size="sm"
                flexShrink="0"
                variant="ghost"
                fontSize="xs"
                onClick={handleOverrideCorrect}
                px={{ base: 0, md: 2 }}
                leftIcon={
                  <IconProgressCheck
                    style={{
                      marginRight: -4,
                    }}
                    size={16}
                  />
                }
              >
                Override - I was correct
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
          <Stack>
            <GenericLabel>Correct answer</GenericLabel>
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
                      ),
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

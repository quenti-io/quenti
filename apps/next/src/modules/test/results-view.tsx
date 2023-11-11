import { useSession } from "next-auth/react";
import { log } from "next-axiom";
import React from "react";

import { Link } from "@quenti/components";

import {
  Button,
  ButtonGroup,
  Fade,
  HStack,
  Heading,
  ScaleFade,
  SlideFade,
  Stack,
  VStack,
} from "@chakra-ui/react";

import {
  IconArrowLeft,
  IconArrowUp,
  IconRotateClockwise2,
} from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSet } from "../../hooks/use-set";
import { useTestContext } from "../../stores/use-test-store";
import { TestCardGapRaw } from "./card-gap";
import { CardWrapper } from "./card-wrapper";
import { ResultsCard } from "./results-card";

export const ResultsView = () => {
  const session = useSession();
  const { id } = useSet();
  const result = useTestContext((s) => s.result!);
  const questionCount = useTestContext((s) => s.questionCount);
  const outline = useTestContext((s) => s.outline);
  const reset = useTestContext((s) => s.reset);
  const [startedAt, endedAt] = useTestContext((s) => [s.startedAt, s.endedAt]);

  const rootUrl = useEntityRootUrl();

  React.useEffect(() => {
    log.info("test.results", {
      userId: session.data?.user?.id,
      studySetId: id,
      result: {
        score: result.score,
        byType: result.byType,
      },
      questionCount,
      startedAt,
      endedAt,
      elapsed:
        (endedAt || new Date()).getTime() - (startedAt || new Date()).getTime(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack spacing="6">
      <Fade
        in
        transition={{
          enter: {
            duration: 0.5,
          },
        }}
      >
        <HStack
          justifyContent="space-between"
          flexDir={{
            base: "column",
            sm: "row",
          }}
          spacing="4"
          alignItems={{ base: "start", sm: "center" }}
        >
          <Heading>Your results</Heading>
          <ButtonGroup>
            <Button
              leftIcon={<IconRotateClockwise2 size={18} />}
              onClick={() => reset()}
              variant="outline"
            >
              New test
            </Button>
            <Button
              variant="outline"
              colorScheme="gray"
              as={Link}
              href={rootUrl}
              leftIcon={<IconArrowLeft size={18} />}
            >
              Back
            </Button>
          </ButtonGroup>
        </HStack>
      </Fade>
      <ScaleFade in>
        <ResultsCard />
      </ScaleFade>
      <Stack spacing="0" pb="20">
        {outline.map(({ type, count, startingIndex }, index) => (
          <React.Fragment key={index}>
            <SlideFade
              in
              transition={{
                enter: {
                  delay: 0.2,
                  duration: 0.3,
                },
              }}
            >
              <TestCardGapRaw
                type="question"
                index={index}
                startingIndex={startingIndex}
                numQuestions={questionCount}
                count={count}
                correctness={result.byQuestion[index]!.correct}
              />
            </SlideFade>
            <SlideFade
              in
              initial={{
                transform: "translateY(20px)",
              }}
              animate={{
                transform: "translateY(0px)",
              }}
              transition={{
                enter: {
                  duration: 0.3,
                },
              }}
            >
              <CardWrapper
                type={type}
                i={index}
                correctness={result.byQuestion[index]!.correct}
              />
            </SlideFade>
          </React.Fragment>
        ))}
        <VStack mt="10">
          <Button
            variant="ghost"
            leftIcon={<IconArrowUp size={18} />}
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Back to top
          </Button>
        </VStack>
      </Stack>
    </Stack>
  );
};

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

import {
  Box,
  Button,
  Fade,
  Heading,
  Skeleton,
  SlideFade,
  Stack,
  VStack,
} from "@chakra-ui/react";

import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { TestContext, useTestContext } from "../../stores/use-test-store";
import { TestCardGap } from "./card-gap";
import { CardWrapper } from "./card-wrapper";
import { TestSettingsModal } from "./test-settings-modal";
import { pushQueryParams } from "./utils/url-params";

interface TestViewProps {
  onSubmit: () => void;
}

export const TestView: React.FC<TestViewProps> = ({ onSubmit }) => {
  const { id, title } = useSetFolderUnison();
  const router = useRouter();
  const searchParams = useSearchParams();

  const store = React.useContext(TestContext)!;
  const outline = useTestContext((s) => s.outline);
  const questionCount = useTestContext((s) => s.questionCount);
  const reset = useTestContext((s) => s.reset);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [enter, setEnter] = React.useState(true);

  const manualReset = () => {
    pushQueryParams(id, store.getState().settings, router);

    setEnter(false);
    setTimeout(() => {
      reset();
      setEnter(true);
    }, 500);
  };

  React.useEffect(() => {
    if (!searchParams.get("count"))
      setTimeout(() => {
        setSettingsOpen(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <TestSettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onReset={manualReset}
      />
      <Stack spacing="0" pb="20" w="full">
        <Fade
          in
          transition={{
            enter: {
              delay: 0.1,
            },
          }}
        >
          <TestCardGap
            type="start"
            title={title}
            onSettingsClick={() => setSettingsOpen(true)}
            onResetClick={manualReset}
          />
        </Fade>{" "}
        <Fade in={!enter} unmountOnExit>
          <Stack spacing="0">
            {Array.from({ length: 5 }).map((_, i) => (
              <React.Fragment key={i}>
                <TestCardGap
                  type="question"
                  index={i}
                  startingIndex={i}
                  numQuestions={500}
                  count={1}
                  skeleton
                />
                <Skeleton
                  key={i}
                  rounded="2xl"
                  w="full"
                  h={{ base: "376px", sm: "245px", md: "340px" }}
                />
              </React.Fragment>
            ))}
          </Stack>
        </Fade>
        {outline.map(({ type, count, startingIndex }, index) => (
          <React.Fragment key={index}>
            <SlideFade
              initial={{
                opacity: 0,
                transform: "translateY(-20px)",
              }}
              animate={
                enter
                  ? {
                      opacity: 1,
                      transform: "translateY(0px)",
                      transition: {
                        delay: 0.2 + Math.min(index, 9) * 0.05,
                      },
                    }
                  : index == 0
                  ? {
                      opacity: 0,
                      transform: "translateY(0px)",
                      transition: {
                        duration: 0.1,
                      },
                    }
                  : {}
              }
              style={{
                zIndex: -1,
              }}
            >
              <TestCardGap
                type="question"
                index={index}
                startingIndex={startingIndex}
                numQuestions={questionCount}
                count={count}
              />
            </SlideFade>
            <SlideFade
              initial={{
                opacity: 0,
                transform: "translateY(-20px)",
              }}
              animate={
                enter
                  ? {
                      opacity: 1,
                      transform: "translateY(0px)",
                      transition: {
                        delay: 0.2 + Math.min(index, 9) * 0.025,
                      },
                    }
                  : {}
              }
            >
              <CardWrapper type={type} i={index} />
            </SlideFade>
          </React.Fragment>
        ))}
        <Fade
          initial={{
            opacity: 0,
            transform: "translateY(-20px)",
          }}
          animate={
            enter
              ? {
                  opacity: 1,
                  transform: "translateY(0px)",
                  transition: {
                    delay: 0.4,
                  },
                }
              : {}
          }
        >
          <Box position="relative">
            <TestCardGap type="finish" />
            <VStack mt="10" spacing="6" h="24" w="full" position="relative">
              <Heading size="md" m="0">
                Ready to submit your test?
              </Heading>
              <Button size="lg" fontSize="md" onClick={onSubmit}>
                Check answers
              </Button>
            </VStack>
          </Box>
        </Fade>
      </Stack>
    </>
  );
};

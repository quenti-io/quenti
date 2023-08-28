import React from "react";

import {
  Box,
  Button,
  Fade,
  Heading,
  SlideFade,
  Stack,
  VStack,
} from "@chakra-ui/react";

import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useTestContext } from "../../stores/use-test-store";
import { TestCardGap } from "./card-gap";
import { CardWrapper } from "./card-wrapper";
import { TestSettingsModal } from "./test-settings-modal";

interface TestViewProps {
  onSubmit: () => void;
}

export const TestView: React.FC<TestViewProps> = ({ onSubmit }) => {
  const { title } = useSetFolderUnison();
  const outline = useTestContext((s) => s.outline);
  const questionCount = useTestContext((s) => s.questionCount);
  const reset = useTestContext((s) => s.reset);

  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [enter, setEnter] = React.useState(true);

  const manualReset = () => {
    setEnter(false);
    setTimeout(() => {
      reset();
      setEnter(true);
    }, 300);
  };

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
          />
        </Fade>
        {outline.map(({ type, count, index }) => (
          <>
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
                        delay: 0.2 + index * 0.05,
                      },
                    }
                  : {}
              }
            >
              <TestCardGap
                type="question"
                index={index}
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
                        delay: 0.2 + index * 0.025,
                      },
                    }
                  : {}
              }
            >
              <CardWrapper type={type} i={index} />
            </SlideFade>
          </>
        ))}
        <Box position="relative">
          <TestCardGap type="finish" />
          <VStack mt="10" spacing="6" h="24" w="full">
            <Heading size="md" m="0">
              Ready to submit your test?
            </Heading>
            <Button size="lg" fontSize="md" onClick={onSubmit}>
              Check answers
            </Button>
          </VStack>
        </Box>
      </Stack>
    </>
  );
};

import React from "react";

import {
  getQuestionTypeIcon,
  getQuestionTypeName,
} from "@quenti/components/utils";
import { outfit } from "@quenti/lib/chakra-theme";

import {
  Box,
  Card,
  Center,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconCircleCheck,
  IconCircleX,
  IconHourglassLow,
} from "@tabler/icons-react";

import { effectChannel } from "../../events/effects";
import {
  type TestStoreProps,
  useTestContext,
} from "../../stores/use-test-store";
import { formatElapsedTime } from "../../utils/time";

export const ResultsCard = () => {
  const result = useTestContext((s) => s.result!);
  const questionCount = useTestContext((s) => s.questionCount);
  const [startedAt, endedAt] = useTestContext((s) => [s.startedAt, s.endedAt]);

  const [perc, setPerc] = React.useState(0);
  React.useEffect(() => {
    requestAnimationFrame(() => {
      setPerc((result.score / questionCount) * 100);
      if ((result.score * 1.0) / questionCount >= 0.93) {
        effectChannel.emit("prepareConfetti");
        requestAnimationFrame(() => {
          effectChannel.emit("confetti");
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const divider = (
    <Box
      w="2px"
      rounded="full"
      mx="2"
      bg="gray.100"
      _dark={{
        bg: "gray.700",
      }}
    />
  );
  const horizontalDivider = (
    <Box
      h="2px"
      w="full"
      rounded="full"
      my="2"
      bg="gray.100"
      _dark={{
        bg: "gray.700",
      }}
    />
  );

  const trackColor = useColorModeValue("gray.100", "gray.700");

  return (
    <Card
      bg="white"
      borderColor="gray.100"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.750",
      }}
      rounded="3xl"
      py="6"
      px="8"
      shadow="xl"
      borderWidth="2px"
    >
      <HStack
        spacing="4"
        alignItems="stretch"
        flexDir={{ base: "column", md: "row" }}
      >
        <HStack spacing="4" alignItems="stretch">
          <CircularProgress
            value={perc}
            color="blue.300"
            trackColor={trackColor}
            // @ts-expect-error type '{ base: string; sm: string; }' is not assignable...
            size={{ base: "100px", sm: "140px" }}
            w="max"
            h="max"
            thickness="4px"
            style={{
              strokeLinecap: "round",
            }}
            justifySelf={{ base: "end", md: undefined }}
          >
            <CircularProgressLabel
              fontFamily={outfit.style.fontFamily}
              fontSize="xl"
              fontWeight={700}
            >
              {`${Math.round((result.score / questionCount) * 100)}%`}
            </CircularProgressLabel>
          </CircularProgress>
          <Center justifySelf={{ base: "start", md: undefined }}>
            <Stack>
              <HStack>
                <Box color="blue.300">
                  <IconCircleCheck />
                </Box>
                <Heading size="md">
                  {result.score}{" "}
                  <Text
                    as="span"
                    fontFamily="body"
                    fontWeight={500}
                    fontSize="md"
                  >
                    correct
                  </Text>
                </Heading>
              </HStack>
              <HStack>
                <Box
                  color="gray.400"
                  _dark={{
                    color: "gray.500",
                  }}
                >
                  <IconCircleX />
                </Box>
                <Heading size="md">
                  {questionCount - result.score}{" "}
                  <Text
                    as="span"
                    fontFamily="body"
                    fontWeight={500}
                    fontSize="md"
                  >
                    incorrect
                  </Text>
                </Heading>
              </HStack>
            </Stack>
          </Center>
        </HStack>
        <Box display={{ base: "none", md: "inherit" }}>{divider}</Box>
        <Box display={{ base: "inherit", md: "none" }}>{horizontalDivider}</Box>
        <HStack
          w={{ base: "full", md: "auto" }}
          alignItems="stretch"
          spacing="4"
          flexDir={{ base: "column", sm: "row" }}
        >
          <Stack spacing="4" flex={{ base: "1", md: undefined }}>
            <Heading size="md" w="40">
              By question type
            </Heading>
            <Stack w={{ base: "full", sm: "max-content" }}>
              {result.byType.map((props) => (
                <ByTypeComponent key={props.type} {...props} />
              ))}
            </Stack>
          </Stack>
          <Box display={{ base: "none", sm: "inherit" }}>{divider}</Box>
          <Box display={{ base: "block", sm: "none" }}>{horizontalDivider}</Box>
          <Stack spacing="4" flex={{ base: "1", md: undefined }}>
            <Heading size="md">Time</Heading>
            <HStack>
              <IconHourglassLow size={18} />
              <Text fontWeight={600}>
                {formatElapsedTime(
                  (endedAt || new Date()).getTime() -
                    (startedAt || new Date()).getTime(),
                )}
              </Text>
            </HStack>
          </Stack>
        </HStack>
      </HStack>
    </Card>
  );
};

const ByTypeComponent: React.FC<
  NonNullable<TestStoreProps["result"]>["byType"][number]
> = ({ type, score, total }) => {
  const Icon = getQuestionTypeIcon(type);

  return (
    <HStack key={type} justifyContent="space-between" spacing="6">
      <HStack>
        <Box
          color="gray.400"
          _dark={{
            color: "gray.500",
          }}
        >
          <Icon size={20} />
        </Box>
        <Text fontSize="sm" fontWeight={600}>
          {getQuestionTypeName(type)}
        </Text>
      </HStack>
      <Text fontFamily="heading" fontWeight={700}>
        {score} / {total}
      </Text>
    </HStack>
  );
};

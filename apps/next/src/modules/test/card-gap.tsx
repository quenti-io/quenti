import React from "react";

import {
  Box,
  Flex,
  HStack,
  Heading,
  Skeleton,
  type SkeletonProps,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconPoint,
  IconPointFilled,
  IconReport,
} from "@tabler/icons-react";

import { useTestContext } from "../../stores/use-test-store";
import { TestOptions } from "./test-options";

export interface TestCardGapProps {
  type: "start" | "question" | "finish";
  title?: string;
  index?: number;
  startingIndex?: number;
  count?: number;
  numQuestions?: number;
  correctness?: boolean;
  skeleton?: boolean;
  onSettingsClick?: () => void;
  onResetClick?: () => void;
}

export const TestCardGapRaw: React.FC<TestCardGapProps> = ({
  type,
  title,
  index,
  startingIndex,
  count = 1,
  numQuestions,
  correctness,
  skeleton,
  onSettingsClick,
  onResetClick,
}) => {
  const defaultQuestionIconColor = useColorModeValue("gray.200", "gray.700");
  const correctQuestionIconColor = useColorModeValue("green.500", "green.300");
  const incorrectQuestionIconColor = useColorModeValue("red.500", "red.300");
  const questionIconColor =
    correctness !== undefined
      ? correctness
        ? correctQuestionIconColor
        : incorrectQuestionIconColor
      : defaultQuestionIconColor;

  const TextWrapper: React.FC<
    React.PropsWithChildren<{
      rounded?: SkeletonProps["rounded"];
      skeletonHeight?: SkeletonProps["height"];
    }>
  > = ({ children, rounded = "full", skeletonHeight = "18px" }) => {
    if (!skeleton) return <>{children}</>;

    return (
      <Flex h="21px" alignItems="center">
        <Skeleton height={skeletonHeight} rounded={rounded}>
          {children}
        </Skeleton>
      </Flex>
    );
  };
  const HeadingWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
    if (!skeleton) return <>{children}</>;

    return (
      <Flex h={{ base: "39.9px", md: "43.2px" }} alignItems="center">
        <Skeleton height={{ base: "32px", md: "36px" }} rounded="lg">
          {children}
        </Skeleton>
      </Flex>
    );
  };

  return (
    <HStack
      px={{ base: "5px", sm: "26px", md: "34px" }}
      spacing="4"
      alignItems={type == "question" ? "center" : "stretch"}
      w="full"
    >
      <Stack w={{ base: "2px", sm: "3px" }} position="relative" minH="12">
        <Box
          w={{ base: "2px", sm: "3px" }}
          minH="12"
          h="full"
          bg="gray.200"
          _dark={{ bg: "gray.750" }}
          roundedTop={type == "start" ? "full" : undefined}
          roundedBottom={type == "finish" ? "full" : undefined}
        />
        {(type == "question" || type == "finish") && (
          <Box
            display={{ base: "block", sm: "none" }}
            position="absolute"
            top="-4"
            left="0"
            w={{ base: "2px", sm: "3px" }}
            h="20"
            bg="gray.200"
            _dark={{ bg: "gray.750" }}
            zIndex={-1}
          />
        )}
        {type !== "start" && (
          <Box
            w="6"
            h="6"
            position="absolute"
            top={type == "finish" ? "100%" : "50%"}
            left="50%"
            transform={
              type == "question" ? "translate(-50%, -50%)" : "translate(-50%)"
            }
            bg="gray.50"
            color={type == "question" ? questionIconColor : "gray.400"}
            _dark={{
              bg: "gray.900",
              color: type == "question" ? questionIconColor : "gray.500",
            }}
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {!skeleton ? (
              <GapIcon type={type} correctness={correctness} index={index} />
            ) : (
              <IconPoint size={24} />
            )}
          </Box>
        )}
      </Stack>
      {index !== undefined &&
        startingIndex !== undefined &&
        numQuestions !== undefined && (
          <TextWrapper>
            <Text
              fontSize="sm"
              fontWeight={600}
              fontFamily="heading"
              color="gray.500"
              _dark={{
                color: "gray.400",
              }}
            >
              {`${
                count <= 1
                  ? startingIndex + 1
                  : `${startingIndex + 1}-${startingIndex + count}`
              } / ${numQuestions}`}
            </Text>
          </TextWrapper>
        )}
      {title && (
        <HStack
          justifyContent={{ base: "start", md: "space-between" }}
          alignItems="start"
          w="full"
          pr={{ base: "5px", sm: "26px", md: "34px" }}
          flexDir={{ base: "column-reverse", md: "row" }}
        >
          <Stack spacing="0">
            <SlideFade
              in
              initial={{
                opacity: skeleton ? 1 : 0,
                transform: skeleton ? "none" : "translateY(-10px)",
              }}
              animate={{
                opacity: 1,
                transform: "translateY(0px)",
                transition: {
                  delay: 0.32,
                },
              }}
            >
              <TextWrapper rounded="md" skeletonHeight="14px">
                <Text fontSize="sm" fontWeight={600}>
                  Test
                </Text>
              </TextWrapper>
            </SlideFade>
            <SlideFade
              in
              initial={{
                opacity: skeleton ? 1 : 0,
                transform: skeleton ? "none" : "translateY(-10px)",
              }}
              animate={{
                opacity: 1,
                transform: "translateY(0px)",
                transition: {
                  delay: 0.3,
                },
              }}
            >
              <HeadingWrapper>
                <Heading size="xl" m="0" overflowWrap="anywhere">
                  {title}
                </Heading>
              </HeadingWrapper>
            </SlideFade>
          </Stack>
          <TestOptions
            onResetClick={() => onResetClick?.()}
            onSettingsClick={() => onSettingsClick?.()}
            skeleton={skeleton}
          />
        </HStack>
      )}
    </HStack>
  );
};

const GapIcon: React.FC<
  Pick<TestCardGapProps, "type" | "correctness" | "index">
> = ({ type, correctness, index }) => {
  const answered = useTestContext((s) => s.timeline[index || 0]?.answered);

  const Icon =
    correctness !== undefined
      ? correctness
        ? IconCircleCheckFilled
        : IconCircleXFilled
      : type == "start"
        ? IconReport
        : type == "finish"
          ? IconCircleCheckFilled
          : answered
            ? IconPointFilled
            : IconPoint;

  return <Icon size={24} />;
};

export const TestCardGap = React.memo(TestCardGapRaw);

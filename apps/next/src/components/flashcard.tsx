import type { JSONContent } from "@tiptap/react";
import React from "react";
import useFitText from "use-fit-text";

import { Display } from "@quenti/components/display";
import type { FacingTerm } from "@quenti/interfaces";
import { outfit } from "@quenti/lib/chakra-theme";

import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  HStack,
  IconButton,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconArrowBackUp,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconEditCircle,
  IconStar,
  IconStarFilled,
  IconX,
} from "@tabler/icons-react";

import { resize } from "../common/cdn-loaders";
import { PhotoView } from "./photo-view/photo-view";
import { SetCreatorOnly } from "./set-creator-only";
import { TermAuthorAvatar } from "./term-author-avatar";

export interface FlashcardProps {
  term: FacingTerm;
  isFlipped: boolean;
  index: number;
  numTerms: number;
  starred: boolean;
  h?: string;
  variant?: "default" | "sortable";
  onLeftAction: () => void;
  onRightAction: () => void;
  onBackAction?: () => void;
  onRequestEdit: () => void;
  onRequestStar: () => void;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  term,
  isFlipped,
  index,
  numTerms,
  starred,
  h = "500px",
  variant = "default",
  onLeftAction,
  onRightAction,
  onBackAction,
  onRequestEdit,
  onRequestStar,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const Star = starred ? IconStarFilled : IconStar;
  const LeftIcon = variant == "sortable" ? IconX : IconChevronLeft;
  const RightIcon = variant == "sortable" ? IconCheck : IconChevronRight;

  const genericColor = useColorModeValue("gray.900", "whiteAlpha.900");
  const leftColor = useColorModeValue("red.500", "red.200");
  const rightColor = useColorModeValue("green.500", "green.200");
  const buttonBorder = useColorModeValue("gray.300", "gray.500");

  const containerHeight = term.assetUrl ? "50%" : undefined;

  return (
    <Card w="full" h={h} rounded="xl" shadow="xl" overflow="hidden">
      <Box
        bg="orange.300"
        height="1"
        minH="1"
        style={{
          visibility: !isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
      <Flex flexDir="column" h="calc(100% - 8px)" p="8">
        <Grid templateColumns="1fr 1fr 1fr">
          <HStack h="max" alignItems="start">
            {variant == "sortable" && (
              <IconButton
                transform="translateY(-4px)"
                ml="-2"
                icon={<IconArrowBackUp size={24} />}
                aria-label="Back"
                size="sm"
                variant="ghost"
                rounded="full"
                onClick={(e) => {
                  e.stopPropagation();
                  onBackAction?.();
                }}
                isDisabled={index == 0}
              />
            )}
            <HStack spacing="3">
              {term.author && (
                <Box
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <TermAuthorAvatar user={term.author} computePosition />
                </Box>
              )}
              <Text fontWeight={700} color="gray.500">
                {isFlipped ? "Definition" : "Term"}
              </Text>
            </HStack>
          </HStack>
          <Flex justifyContent="center">
            <Text fontWeight={700} fontSize="lg">
              {index + 1} / {numTerms}
            </Text>
          </Flex>
          <Flex justifyContent="end">
            <HStack spacing={2}>
              <SetCreatorOnly studySetId={term.studySetId}>
                <IconButton
                  icon={<IconEditCircle />}
                  aria-label="Edit"
                  rounded="full"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRequestEdit();
                  }}
                />
              </SetCreatorOnly>
              <IconButton
                icon={<Star />}
                aria-label="Star"
                rounded="full"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onRequestStar();
                }}
              />
            </HStack>
          </Flex>
        </Grid>
        <Center flex={1} my="4" overflowY="auto">
          <Flex
            w="full"
            h="full"
            flexDir={{
              base: "column-reverse",
              md: "row",
            }}
          >
            <Center
              flex="1"
              height={{
                base: containerHeight,
                md: "100%",
              }}
              ref={containerRef}
              p="3"
            >
              <PureShrinkableText
                text={isFlipped ? term.definition : term.word}
                richText={
                  (isFlipped
                    ? term.definitionRichText
                    : term.wordRichText) as JSONContent
                }
                container={containerRef}
              />
            </Center>
            {term.assetUrl && isFlipped && (
              <Center
                flex="1"
                p="3"
                height={{
                  base: containerHeight,
                  md: "100%",
                }}
              >
                <PhotoView
                  src={resize({ src: term.assetUrl, width: 500 })}
                  borderRadius={8}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resize({ src: term.assetUrl, width: 500 })}
                    alt="Term asset"
                    style={{
                      cursor: "zoom-in",
                      borderRadius: "8px",
                      maxWidth: "100%",
                      maxHeight: "100%",
                    }}
                  />
                </PhotoView>
              </Center>
            )}
          </Flex>
        </Center>
        <HStack spacing={4}>
          <Button
            w="full"
            size="lg"
            variant="outline"
            colorScheme={variant == "sortable" ? "red" : "gray"}
            borderColor={buttonBorder}
            isDisabled={variant == "default" && index === 0}
            onClick={(e) => {
              e.stopPropagation();
              onLeftAction();
            }}
          >
            <Box color={variant == "sortable" ? leftColor : genericColor}>
              <LeftIcon size="24" />
            </Box>
          </Button>
          <Button
            w="full"
            size="lg"
            variant="outline"
            colorScheme={variant == "sortable" ? "green" : "gray"}
            borderColor={buttonBorder}
            isDisabled={variant == "default" && index === numTerms - 1}
            onClick={(e) => {
              e.stopPropagation();
              onRightAction();
            }}
          >
            <Box color={variant == "sortable" ? rightColor : genericColor}>
              <RightIcon size="24" />
            </Box>
          </Button>
        </HStack>
      </Flex>
      <Box
        bg="orange.300"
        height="1"
        style={{
          visibility: isFlipped ? "visible" : "hidden",
          transition: "width 0.1s ease-in-out",
          width: `calc(100% * ${index + 1} / ${numTerms})`,
        }}
      />
    </Card>
  );
};

const ShrinkableText: React.FC<{
  text: string;
  richText?: JSONContent;
  container: React.RefObject<HTMLDivElement>;
}> = ({ text, richText, container }) => {
  const { fontSize, ref } = useFitText({
    minFontSize: 50,
  });

  return (
    <span
      ref={ref}
      style={{
        maxHeight: container.current
          ? `calc(${container.current.clientHeight}px)`
          : undefined,
        fontSize: (36 * parseFloat(fontSize.replace("%", ""))) / 100,
        fontWeight: 400,
        fontFamily: outfit.style.fontFamily,
        whiteSpace: "pre-wrap",
        display: "table-cell",
        verticalAlign: "middle",
        textAlign: "center",
        overflowWrap: "anywhere",
      }}
    >
      <Display text={text} richText={richText} />
    </span>
  );
};

const PureShrinkableText = React.memo(ShrinkableText);

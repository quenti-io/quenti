import { animate, motion, useMotionValue } from "framer-motion";
import React from "react";

import { Display } from "@quenti/components/display";

import { Card, Stack, Text, useColorModeValue } from "@chakra-ui/react";

import { MATCH_SHUFFLE_TIME } from "../../../../packages/lib/constants/match";
import { type MatchItem, useMatchContext } from "../stores/use-match-store";
import { SquareAssetPreview } from "./terms/square-asset-preview";

export interface MatchCardProps {
  term: MatchItem;
  index: number;
  onDragStart: (term: MatchItem, index: number) => void;
  onDrag: (term: MatchItem, index: number, x: number, y: number) => void;
  onDragEnd: (term: MatchItem, index: number, x: number, y: number) => void;
}

export const RawMatchCard: React.FC<MatchCardProps> = ({
  term,
  index,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const setCard = useMatchContext((state) => state.setCard);
  const isHighlighted = useMatchContext((state) =>
    state.highlightedIndices.includes(index),
  );

  const [isInMotion, setIsInMotion] = React.useState(false);

  const linkBg = useColorModeValue("white", "gray.800");
  const gray = useColorModeValue("gray.200", "gray.700");
  const highlighted = useColorModeValue("gray.300", "gray.600");

  const stateBorder = term.state
    ? term.state == "correct"
      ? "green.400"
      : "red.400"
    : undefined;
  const linkBorder = term.state
    ? stateBorder
    : isHighlighted
      ? highlighted
      : gray;

  const card = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCard(index, {
      ...term,
      width: card.current ? card.current.offsetWidth : 200,
      height: card.current ? card.current.offsetHeight : 60,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [card]);

  const x = useMotionValue(term.x);
  const y = useMotionValue(term.y);

  React.useEffect(() => {
    setIsInMotion(true);
    void (async () => {
      await animate(x, term.targetX, { duration: MATCH_SHUFFLE_TIME });
    })();
    void (async () => {
      await animate(y, term.targetY, { duration: MATCH_SHUFFLE_TIME });
    })();

    setTimeout(() => {
      setIsInMotion(false);
    }, MATCH_SHUFFLE_TIME * 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term.targetX, term.targetY]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{
        opacity: 0,
      }}
      animate={{
        position: "absolute",
        opacity: 1,
        pointerEvents:
          term.state == "correct" || isInMotion ? "none" : "initial",
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5 },
      }}
      onDragStart={() => {
        onDragStart(term, index);
      }}
      onDrag={(_, info) => onDrag(term, index, info.offset.x, info.offset.y)}
      onDragEnd={(_, info) => {
        onDragEnd(term, index, info.offset.x, info.offset.y);
      }}
      style={{ x, y, zIndex: term.zIndex }}
    >
      <Card
        rounded="lg"
        py="4"
        px="5"
        ref={card}
        bg={linkBg}
        borderColor={linkBorder}
        borderWidth="2px"
        shadow="md"
        transition="border-color ease-in-out 150ms"
        maxW="200px"
        w="max-content"
        position="absolute"
        cursor="move"
        _hover={{
          borderBottomColor: stateBorder ?? "blue.300",
        }}
      >
        <Stack spacing="4">
          {term.type == "definition" && term.assetUrl && (
            <SquareAssetPreview
              src={term.assetUrl}
              size={80}
              rounded={8}
              disablePointerEvents
            />
          )}
          <Text fontSize="sm">
            <Display text={term.word} richText={term.richWord} />
          </Text>
        </Stack>
      </Card>
    </motion.div>
  );
};

export const MatchCard = React.memo(RawMatchCard);

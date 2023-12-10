import type { DraggableAttributes } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { motion, useInView } from "framer-motion";
import React from "react";

import { Box, Card } from "@chakra-ui/react";

import { useSetEditorContext } from "../../../stores/use-set-editor-store";
import { DeloadedCard } from "./deloaded-card";
import { InnerTermCard } from "./inner-term-card";
import type { SortableTermCardProps } from "./sortable-term-card";

export interface TermCardProps extends SortableTermCardProps {
  style: React.CSSProperties;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

export type TermCardRef = HTMLDivElement;

const padNextFour = (ranks: number[]) => {
  const last = ranks[ranks.length - 1]!;
  return [...ranks, last + 1, last + 2, last + 3, last + 4];
};

const MotionCard = motion(Card);

export const TermCard = React.forwardRef<TermCardRef, TermCardProps>(
  function TermCardInner(props, ref) {
    const innerRef = React.useRef<HTMLDivElement>(null);
    const inView = useInView(innerRef);
    const visible = useSetEditorContext(
      (s) =>
        padNextFour(s.visibleTerms).includes(props.term.rank) ||
        // Pad two terms above and below for the current rank, in case the user tabs up or down
        Math.abs(props.term.rank - (s.currentActiveRank || 0)) <= 2,
    );
    const hideTimeout = React.useRef<NodeJS.Timeout | null>(null);

    const setTermVisible = useSetEditorContext((s) => s.setTermVisible);
    const saveError = useSetEditorContext((s) => s.saveError);

    const termError = saveError == "At least two terms are required.";

    React.useEffect(() => {
      if (inView) {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        setTermVisible(props.term.rank, inView);
      } else {
        hideTimeout.current = setTimeout(() => {
          setTermVisible(props.term.rank, false);
        }, 300);
      }

      return () => {
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inView]);

    return (
      <Box ref={ref} style={props.style}>
        <Box ref={innerRef} position="relative">
          {props.term.rank < 2 && (
            <Box
              position="absolute"
              top="50%"
              transform="translateY(-50%)"
              opacity={termError ? 1 : 0}
              transition="opacity 0.2s ease-in-out"
              left="-6"
              w="10px"
              h="10px"
              rounded="full"
              bg="red.500"
              _dark={{
                bg: "red.300",
              }}
            />
          )}
          {visible || props.justCreated ? (
            <MotionCard
              rounded="xl"
              borderWidth="2px"
              bg="white"
              borderColor="gray.50"
              _dark={{
                bg: "gray.750",
                borderColor: "gray.700",
              }}
              initial={{
                scale: props.justCreated ? 0.9 : 1,
                opacity: props.justCreated ? 0.5 : 1,
              }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <InnerTermCard {...props} />
            </MotionCard>
          ) : (
            <DeloadedCard
              word={props.term.word}
              definition={props.term.definition}
            />
          )}
        </Box>
      </Box>
    );
  },
);

export const TermCardPure = React.memo(TermCard);

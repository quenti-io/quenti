import { Card, Text, useColorModeValue } from "@chakra-ui/react";
import { animate, motion, useMotionValue } from "framer-motion";
import React from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { shallow } from "zustand/shallow";
import type { MatchStore } from "../pages/sets/[id]/match";
import { useMatchContext } from "../stores/use-match-store";

export interface MatchCardProps {
  index: number;
  subscribe: UseBoundStore<StoreApi<MatchStore>>;
}

export const MatchCard: React.FC<MatchCardProps> = ({ index, subscribe }) => {
  const linkBg = useColorModeValue("white", "gray.800");

  const [isAnimating, setIsAnimating] = React.useState(true);
  const [self, setCard, getBelow] = subscribe(
    (e) => [e.terms[index]!, e.setCard, e.validateUnderIndices],
    shallow
  );

  const gray = useColorModeValue("gray.200", "gray.700");
  const linkBorder = self.color ?? gray;

  const requestZIndex = useMatchContext((e) => e.requestZIndex);

  const [zIndex, setZIndex] = React.useState(requestZIndex());

  const cur = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCard(index, {
      ...self,
      height: cur.current ? cur.current.offsetHeight : 69,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  const x = useMotionValue(self.x);
  const y = useMotionValue(self.y);

  React.useEffect(() => {
    if (!isAnimating) return;

    void (async () => {
      await animate(x, self.x, { duration: 0.5 });
    })();
    void (async () => {
      await animate(y, self.y, { duration: 0.5 });
    })();
  }, [isAnimating, self, x, y]);

  React.useEffect(() => {
    setIsAnimating(false);
  }, [isAnimating, setIsAnimating]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={{
        position: "absolute",
        zIndex: zIndex,
        opacity: self.completed ? 0 : 1,
        pointerEvents:
          self.completed || self.color == "green.400" ? "none" : "initial",
      }}
      onDragStart={() => setZIndex(requestZIndex())}
      onDragEnd={(_, info) => {
        setCard(index, {
          ...self,
          x: self.x + info.offset.x,
          y: self.y + info.offset.y,
        });
        getBelow(index);
      }}
      style={{ x, y }}
    >
      <Card
        rounded="md"
        py="4"
        px="5"
        ref={cur}
        bg={linkBg}
        borderColor={linkBorder}
        borderWidth="2px"
        shadow="lg"
        transition="all ease-in-out 150ms"
        w="200px"
        position="absolute"
        _hover={{
          transform: "translateY(-2px)",
          borderBottomColor: self.color || "blue.300",
        }}
      >
        <Text fontSize="sm">{self.word}</Text>
      </Card>
    </motion.div>
  );
};

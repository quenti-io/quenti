import { Card, Heading, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { animate, motion, useMotionValue } from "framer-motion";
import { StoreApi, UseBoundStore } from "zustand";
import { MatchStore } from "../pages/sets/[id]/match";
import { useMatchContext } from "../stores/use-match-store";
import { shallow } from "zustand/shallow";

export interface MatchCardProps {
  index: number;
  subscribe: UseBoundStore<StoreApi<MatchStore>>;
}

export const MatchCard: React.FC<MatchCardProps> = ({ index, subscribe }) => {
  const linkBg = useColorModeValue("white", "gray.800");

  const [self, setCard, getBelow] = subscribe(
    (e) => [e.terms[index]!, e.setCard, e.validateUnderIndexes],
    shallow
  );

  let linkBorder = self.color
    ? self.color + "!important"
    : false || useColorModeValue("gray.200", "gray.700");
  let zic = useMatchContext((e) => e.requestZIndex);

  let [zI, setZi] = React.useState(zic());

  const cur = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCard(index, {
      ...self,
      height: cur.current ? cur.current.offsetHeight : 69,
    });
  }, [cur.current]);

  const x = useMotionValue(self.x);
  const y = useMotionValue(self.y);

  React.useEffect(() => {
    animate(x, self.x, { duration: 0.5 });
    animate(y, self.y, { duration: 0.5 });
  }, [self]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={{
        position: "absolute",
        zIndex: zI,
        opacity: self.completed ? 0 : 1,
        pointerEvents:
          self.completed || self.color == "green.400" ? "none" : "initial",
      }}
      onDragStart={() => setZi(zic())}
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
        p="5"
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
          borderBottomColor: "blue.300",
        }}
      >
        <Heading size="sm">{self.word}</Heading>
      </Card>
    </motion.div>
  );
};

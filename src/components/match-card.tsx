import { Card, Text, useColorModeValue } from "@chakra-ui/react";
import { animate, motion, useMotionValue } from "framer-motion";
import React from "react";
import { MATCH_SHUFFLE_TIME } from "../server/api/common/constants";
import { useMatchContext, type MatchItem } from "../stores/use-match-store";
import { ScriptFormatter } from "./script-formatter";

export interface MatchCardProps {
  term: MatchItem;
  index: number;
  onDragEnd: (term: MatchItem, x: number, y: number) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  term,
  index,
  onDragEnd,
}) => {
  const setCard = useMatchContext((state) => state.setCard);

  const [isInMotion,setIsInMotion] = React.useState(false)

  const linkBg = useColorModeValue("white", "gray.800");
  const gray = useColorModeValue("gray.200", "gray.700");

  const stateBorder = term.state
    ? term.state == "correct"
      ? "green.400"
      : "red.400"
    : undefined;

  const linkBorder = term.state ? stateBorder : gray;

  const requestZIndex = useMatchContext((e) => e.requestZIndex);
  const [zIndex, setZIndex] = React.useState(requestZIndex());

  const cur = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setCard(index, {
      ...term,
      height: cur.current ? cur.current.offsetHeight : 69,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur]);

  const x = useMotionValue(term.x);
  const y = useMotionValue(term.y);

  React.useEffect(() => {
    setIsInMotion(true)
    void (async () => {
      await animate(x, term.targetX, { duration: MATCH_SHUFFLE_TIME });
    })();
    void (async () => {
      await animate(y, term.targetY, { duration: MATCH_SHUFFLE_TIME });
    })();
    setTimeout(() => {
      setIsInMotion(false)
    }, MATCH_SHUFFLE_TIME * 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term.targetX, term.targetY]);

  return (
    <motion.div
      drag
      dragMomentum={false}
      animate={{
        position: "absolute",
        zIndex: zIndex,
        pointerEvents: (term.state == "correct" || isInMotion) ? "none" : "initial",
      }}
      exit={{
        opacity: 0,
        transition: { duration: 0.5 },
      }}
      onDragStart={() => setZIndex(requestZIndex())}
      onDragEnd={(_, info) => {
        onDragEnd(term, info.offset.x, info.offset.y);
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
          borderBottomColor: stateBorder ?? "blue.300",
        }}
      >
        <Text fontSize="sm">
          <ScriptFormatter>{term.word}</ScriptFormatter>
        </Text>
      </Card>
    </motion.div>
  );
};

import {
  Card,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { motion } from "framer-motion";
import { StoreApi, UseBoundStore } from "zustand";
import { MatchStore } from "../pages/sets/[id]/match";
import { useMatchContext } from "../stores/use-match-store";

export interface MatchCardProps {
  index: number,
  subscribe: UseBoundStore<StoreApi<MatchStore>>
}

export const MatchCard: React.FC<MatchCardProps> = ({
  index,
  subscribe
}) => {
  const linkBg = useColorModeValue("white", "gray.800");
  let self = subscribe(e => e.terms[index]!)
  let linkBorder = self.color || useColorModeValue("gray.200", "gray.700");
  const setCard = subscribe(e => e.setCard)
  const getBelow = subscribe(e => e.validateUnderIndexes)
  let zic = useMatchContext(e => e.requestZIndex)
  let [zI,setZi] = React.useState(zic())


  return (
    <motion.div drag dragMomentum={false} animate={{
      position: "absolute",
      zIndex: zI
    }} onDragStart={() => setZi(zic())} onDragEnd={(_,info) => {
      setCard(index, {
        ...self,
        x: self.x+info.offset.x,
        y: self.y+info.offset.y
      })
      console.log(getBelow(index))
    }}>
      <Card
        rounded="md"
        p="5"
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
        <Heading
          size="sm"
        >
          {self.word}
        </Heading>
      </Card>
    </motion.div>
  );
};

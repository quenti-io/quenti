import {
  Card,
  Heading,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { motion } from "framer-motion";

export interface MatchCardProps {
  title: string;
  zIndex: number;
  x: number;
  y: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  title,
  zIndex,
  x,
  y
}) => {
  const linkBg = useColorModeValue("white", "gray.800");
  const linkBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <motion.div drag dragMomentum={false} animate={{
      position: "absolute",
      top: y,
      left: x,
      zIndex: zIndex
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
          {title}
        </Heading>
      </Card>
    </motion.div>
  );
};

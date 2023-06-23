/**
 * Eventually this should become a generic user card for classrooms also but
 */

import React from "react";
import type { ColorProps } from "@chakra-ui/react";
import { Avatar, Wrap, WrapItem } from "@chakra-ui/react";
import { Card, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

export interface GenericUserCardProps {
  variantBg?: boolean;
  n: number;
}

export const GenericUserCard: React.FC<GenericUserCardProps> = ({
  variantBg,
  n,
}) => {
  const setBg = useColorModeValue("gray.100", "gray.750");

  const color: ColorProps["color"] =
    n == 1
      ? "yellow.300"
      : n == 2
      ? "gray.300"
      : n == 3
      ? "orange.300"
      : "gray.600";

  return (
    <Card px="5" py="4" bg={variantBg ? setBg : undefined}>
      <Flex justifyContent={"space-between"} alignItems="center">
        <Flex gap={"4"}>
          <Heading size={"md"} color={color}>
            {n}
          </Heading>
          <Text fontWeight={"bold"}>10.1 seconds</Text>
        </Flex>
        <Wrap spacing={"3"} align="center">
          <WrapItem>
            <Avatar src={undefined} size="sm" className="highlight-block" />
          </WrapItem>
          <WrapItem>
            <Text fontWeight={700} className="highlight-block">
              test
            </Text>
          </WrapItem>
        </Wrap>
      </Flex>
    </Card>
  );
};

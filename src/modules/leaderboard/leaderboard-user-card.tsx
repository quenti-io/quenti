/**
 * Eventually this should become a generic user card for classrooms also but
 */

import React from "react";
import type { ColorProps} from "@chakra-ui/react";
import { Card, Circle, Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

export interface GenericUserCardProps {
    variantBg?: boolean;
    n: number
}

export const GenericUserCard: React.FC<GenericUserCardProps> = ({
    variantBg,
    n
}) => {
    const setBg = useColorModeValue("gray.100", "gray.750");

    const color: ColorProps["color"] = n == 1 ? "yellow.300" : n == 2 ? "gray.400" : n == 3 ? "orange.300" : "gray.700"

    return (
        <Card px="4" py="2" bg={variantBg ? setBg : undefined}>
            <Flex justifyContent={"space-between"} alignItems="center">
                <Flex gap={"4"} alignItems="center">
                    <Circle size={"40px"} bg={color}>
                        <Heading size={"md"}>{n}</Heading>
                    </Circle>
                    <Text w="full" whiteSpace="pre-wrap">
                        test
                    </Text>
                </Flex>
                <Flex>
                    <Text fontWeight={"bold"}>10.1</Text>
                </Flex>
            </Flex>
        </Card>
    );
};

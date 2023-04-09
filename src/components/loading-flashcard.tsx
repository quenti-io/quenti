import { Card, Center, Spinner, useColorModeValue } from "@chakra-ui/react";
import React from "react";

export const LoadingFlashcard: React.FC<{ h?: string }> = ({ h }) => {
  const borderColor = useColorModeValue("gray.200", "gray.750");

  return (
    <Card
      w="full"
      minH={h}
      rounded="xl"
      shadow="none"
      border="2px"
      bg="transparent"
      borderColor={borderColor}
      overflow="hidden"
    >
      <Center flex="1">
        <Spinner color="blue.200" />
      </Center>
    </Card>
  );
};

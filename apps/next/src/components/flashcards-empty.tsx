import { Card, VStack } from "@chakra-ui/react";

import { GhostMessage } from "./ghost-message";

export interface FlashcardsEmptyProps {
  h?: string;
}

export const FlashcardsEmpty: React.FC<FlashcardsEmptyProps> = ({
  h = "500px",
}) => {
  return (
    <Card
      w="full"
      h={h}
      rounded="xl"
      shadow="xl"
      overflow="hidden"
      p="8"
      alignItems="center"
      justifyContent="center"
      display="flex"
    >
      <VStack w="full">
        <GhostMessage message="No terms yet" />
      </VStack>
    </Card>
  );
};

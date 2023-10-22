import { VStack } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";

export const ClassEmpty = () => {
  return (
    <VStack mt="10" px="-4">
      <GhostMessage
        message="There's nothing here yet"
        subheading="Check back here once your teacher adds some content to the class."
      />
    </VStack>
  );
};

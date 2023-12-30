import { Box, VStack } from "@chakra-ui/react";

import { GhostMessage } from "../../components/ghost-message";

export const ClassEmpty = () => {
  return (
    <Box
      w="full"
      rounded="xl"
      borderWidth="2px"
      borderColor="gray.200"
      _dark={{
        borderColor: "gray.750",
      }}
      pb="10"
      px="4"
    >
      <VStack mt="10" px="-4">
        <GhostMessage
          message="There's nothing here yet"
          subheading="Check back once your teacher adds some content to the class."
        />
      </VStack>
    </Box>
  );
};

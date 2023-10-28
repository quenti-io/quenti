import { Box, HStack, Stack, Text } from "@chakra-ui/react";

interface DeloadedCardProps {
  word: string;
  definition: string;
}

export const DeloadedCard: React.FC<DeloadedCardProps> = ({
  word,
  definition,
}) => {
  return (
    <>
      <Box h="54px" />
      <HStack
        pt="2"
        pb="4"
        px="5"
        w="full"
        spacing={6}
        alignItems="start"
        flexDir={{
          base: "column",
          sm: "row",
        }}
        color="transparent"
      >
        <Stack w="full">
          <DeloadedDisplayable>{word}</DeloadedDisplayable>
          <Box h="6" />
        </Stack>
        <Stack w="full">
          <DeloadedDisplayable>{definition}</DeloadedDisplayable>
          <Box h="6" />
        </Stack>
      </HStack>
    </>
  );
};

export const DeloadedDisplayable: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Box borderBottomWidth="1px" borderColor="transparent" py="7px">
      <Text>{children}</Text>
    </Box>
  );
};

import {
  Box,
  Center,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Logo } from "../../icons/logo";

export const EmptyDashboard = () => {
  const borderColor = useColorModeValue("gray.300", "gray.750");

  return (
    <Center
      w="full"
      h="lg"
      rounded="lg"
      borderWidth="2px"
      borderColor={borderColor}
      px="12"
    >
      <VStack spacing={6} textAlign="center">
        <Box color="blue.300">
          <Logo boxSize="16" />
        </Box>
        <Heading>This is your dashboard</Heading>
        <Text fontSize="lg">
          Sets you&apos;ve viewed recently will show up here.
        </Text>
      </VStack>
    </Center>
  );
};

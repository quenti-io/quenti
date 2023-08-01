import {
  Center,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";

interface CircularTermMasteryProps {
  known: number;
  stillLearning: number;
}

export const CircularTermMastery: React.FC<CircularTermMasteryProps> = ({
  known,
  stillLearning,
}) => {
  const [perc, setPerc] = React.useState(0);
  React.useEffect(() => {
    setTimeout(() => {
      setPerc((known / (known + stillLearning)) * 100);
    }, 300);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <HStack spacing={6}>
      <CircularProgress
        value={perc}
        color="blue.300"
        trackColor="orange.300"
        // @ts-expect-error type '{ base: string; sm: string; }' is not assignable...
        size={{ base: "100px", sm: "140px" }}
        w="max"
        thickness="4px"
      >
        <CircularProgressLabel
          fontFamily="Outfit"
          fontSize="xl"
          fontWeight={700}
        >
          {`${Math.round((known / (known + stillLearning)) * 100)}%`}
        </CircularProgressLabel>
      </CircularProgress>
      <HStack spacing={4}>
        <Stack>
          <Heading size="md" color="blue.300">
            Know
          </Heading>
          <Heading size="md" color="orange.300">
            Still Learning
          </Heading>
        </Stack>
        <Stack>
          <Center
            color="blue.300"
            borderWidth="1.5px"
            rounded="full"
            borderColor="blue.300"
            px="2"
            w="max"
            shadow="sm"
          >
            <Text fontFamily="Outfit" fontSize="sm" fontWeight={700}>
              {known}
            </Text>
          </Center>
          <Center
            color="orange.300"
            borderWidth="1.5px"
            rounded="full"
            borderColor="orange.300"
            px="2"
            w="max"
            shadow="sm"
          >
            <Text fontFamily="Outfit" fontSize="sm" fontWeight={700}>
              {stillLearning}
            </Text>
          </Center>
        </Stack>
      </HStack>
    </HStack>
  );
};

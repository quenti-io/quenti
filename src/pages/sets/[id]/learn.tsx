import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { useLearnContext } from "../../../stores/use-learn-store";
import { motion } from "framer-motion";

export default function Learn() {
  return (
    <HydrateSetData>
      <CreateLearnData>
        <Container maxW="4xl">
          <Stack spacing={8}>
            <Titlebar />
            <InteractionCard />
          </Stack>
        </Container>
      </CreateLearnData>
    </HydrateSetData>
  );
}

const Titlebar = () => {
  const currentRound = useLearnContext((s) => s.currentRound);

  return (
    <Heading size="lg" textAlign="center">
      Round {currentRound + 1}
    </Heading>
  );
};

const InteractionCard = () => {
  const activeTerm = useLearnContext((s) => s.activeTerm);
  const choices = useLearnContext((s) => s.choices);

  if (!activeTerm) return null;

  return (
    <motion.div
      initial={{ translateY: -10, opacity: 0.5 }}
      animate={{ translateY: 0, opacity: 1 }}
    >
      <Card px="8" py="6" shadow="2xl">
        <Stack spacing={6}>
          <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
            Term
          </Text>
          <Box h={140}>
            <Text fontSize="xl">{activeTerm.word}</Text>
          </Box>
          <Stack spacing={4}>
            <Text fontWeight={600}>Choose matching definition</Text>
          </Stack>
          <Grid gridTemplateColumns="1fr 1fr" gap="6">
            {choices.map((choice, i) => (
              <GridItem>
                <Button w="full" variant="outline" border="2px" p="8">
                  <Flex alignItems="center" w="full" gap={4}>
                    <Flex
                      outline="solid 2px"
                      outlineColor={useColorModeValue("blue.600", "blue.200")}
                      rounded="full"
                      w="6"
                      h="6"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Text
                        fontSize="sm"
                        color={useColorModeValue("gray.800", "gray.200")}
                      >
                        {i + 1}
                      </Text>
                    </Flex>
                    <Text size="lg" color={useColorModeValue("black", "white")}>
                      {choice.definition}
                    </Text>
                  </Flex>
                </Button>
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Card>
    </motion.div>
  );
};

export { getServerSideProps } from "../../../components/chakra";

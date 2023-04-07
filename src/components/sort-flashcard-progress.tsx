import {
  Box,
  Button,
  Card,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCards,
  IconChevronRight,
  IconRotateClockwise,
  type TablerIconsProps,
} from "@tabler/icons-react";
import { useSortFlashcardsContext } from "../stores/use-sort-flashcards-store";
import { plural } from "../utils/string";
import { CircularTermMastery } from "./circular-term-mastery";

export interface SortFlashcardProgressProps {
  h?: string;
  onNextRound: () => void;
  onResetProgress: () => void;
}

export const SortFlashcardProgress: React.FC<SortFlashcardProgressProps> = ({
  h = "500px",
  onNextRound,
  onResetProgress,
}) => {
  const cardBg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.750");

  const studiableTerms = useSortFlashcardsContext((s) => s.studiableTerms);
  const known = studiableTerms.filter((t) => t.correctness === 1).length;
  const stillLearning = studiableTerms.length - known;

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
      p="8"
    >
      <Flex flexDir="column" justifyContent="space-between" flex="1">
        <Grid gridTemplateColumns={{ base: "1fr", xl: "1fr 1fr" }} gap="8">
          <GridItem>
            <Stack spacing={6} h="full">
              <Heading size="md">Your Results</Heading>
              <Card bg={cardBg} rounded="xl" shadow="lg" h="full">
                <Center w="full" h="full" p="4">
                  <CircularTermMastery
                    known={known}
                    stillLearning={stillLearning}
                  />
                </Center>
              </Card>
            </Stack>
          </GridItem>
          <GridItem>
            <Stack spacing={6}>
              <Heading size="md">Next Steps</Heading>
              <Stack spacing={4}>
                <Actionable
                  name="Keep Reviewing"
                  description={`Continue reviewing flashcards with the ${plural(
                    stillLearning,
                    "term"
                  )} you're still learning.`}
                  icon={IconCards}
                  onClick={onNextRound}
                />
                <Actionable
                  name="Restart Flashcards"
                  description={`Reset your progress and study all ${plural(
                    studiableTerms.length,
                    "term"
                  )} from the beginning.`}
                  icon={IconRotateClockwise}
                  onClick={onResetProgress}
                />
              </Stack>
            </Stack>
          </GridItem>
        </Grid>
      </Flex>
      <Flex
        justifyContent="space-between"
        pt="6"
        flexDir={{ base: "column", sm: "row" }}
      >
        <Button
          size={{ base: "md", sm: "sm" }}
          leftIcon={<IconArrowLeft size={18} />}
          variant="ghost"
        >
          Back to last card
        </Button>
        <Button
          display={{ base: "none", sm: "inherit" }}
          size="sm"
          rightIcon={<IconArrowRight size={18} />}
          variant="ghost"
        >
          Press any key to continue
        </Button>
      </Flex>
    </Card>
  );
};

interface ActionableProps {
  name: string;
  description: string;
  icon: React.FC<TablerIconsProps>;
  onClick: () => void;
}

const Actionable: React.FC<ActionableProps> = ({
  name,
  description,
  icon: Icon,
  onClick,
}) => {
  const bg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <Box
      bg={bg}
      rounded="lg"
      py="4"
      px={{ base: "3", sm: "6" }}
      borderBottomWidth="3px"
      h="full"
      borderColor={borderColor}
      shadow="md"
      transition="all ease-in-out 150ms"
      _hover={{
        transform: "translateY(-2px)",
        borderBottomColor: "blue.300",
      }}
      cursor="pointer"
      onClick={onClick}
    >
      <Flex justifyContent="space-between" alignItems="center" gap={4}>
        <HStack>
          <Box
            display={{ base: "none", sm: "inherit" }}
            color="blue.300"
            mr={4}
          >
            <Icon size={40} />
          </Box>
          <Stack>
            <Flex alignItems="center" gap={3}>
              <Box display={{ base: "inherit", sm: "none" }} color="blue.300">
                <Icon />
              </Box>
              <Heading size="md">{name}</Heading>
            </Flex>
            <Text fontSize="sm" color={grayText}>
              {description}
            </Text>
          </Stack>
        </HStack>
        <Box display={{ base: "none", sm: "inherit" }}>
          <IconChevronRight />
        </Box>
      </Flex>
    </Box>
  );
};

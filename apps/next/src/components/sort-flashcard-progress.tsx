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
  LinkBox,
  LinkOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconBrain,
  IconCards,
  IconChevronRight,
  IconFolder,
  IconRotateClockwise,
  type TablerIconsProps,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { AnyKeyPressLayer } from "../modules/learn/any-key-press-layer";
import { useSortFlashcardsContext } from "../stores/use-sort-flashcards-store";
import { api } from "../utils/api";
import { plural } from "../utils/string";
import { CircularTermMastery } from "./circular-term-mastery";
import { Link } from "./link";

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
  const { id, container, type } = useSetFolderUnison();
  const router = useRouter();
  const cardBg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.750");

  const apiDelete = api.studiableTerms.delete.useMutation();

  const [termsThisRound, index, studiableTerms] = useSortFlashcardsContext(
    (s) => [s.termsThisRound, s.index, s.studiableTerms]
  );
  const stateGoBack = useSortFlashcardsContext((s) => s.goBack);
  const known = studiableTerms.filter((t) => t.correctness === 1).length;
  const stillLearning = studiableTerms.length - known;

  const goBack = () => {
    stateGoBack(true);

    void (async () => {
      const current = termsThisRound[index];
      if (!current) return;

      await apiDelete.mutateAsync({
        id: current.id,
        containerId: container.id,
        mode: "Flashcards",
      });
    })();
  };

  return (
    <Card
      w="full"
      h={h}
      rounded="xl"
      shadow="none"
      border="2px"
      bg="transparent"
      borderColor={borderColor}
      overflowY="auto"
      p="8"
    >
      {!!stillLearning && <AnyKeyPressLayer onSubmit={onNextRound} />}
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
              {!stillLearning ? (
                <Heading>You&apos;ve reviewed all cards!</Heading>
              ) : (
                <Heading size="md">Next Steps</Heading>
              )}
              <Stack spacing={4}>
                {!!stillLearning ? (
                  <Actionable
                    name="Keep reviewing"
                    description={`Continue reviewing flashcards with the ${plural(
                      stillLearning,
                      "term"
                    )} you're still learning.`}
                    icon={IconCards}
                    onClick={onNextRound}
                  />
                ) : type == "set" ? (
                  <Actionable
                    name="Continue to Learn"
                    description="Keep studying with multiple choice and written questions."
                    icon={IconBrain}
                    href={`/${id}/learn`}
                  />
                ) : undefined}
                <Actionable
                  name="Restart flashcards"
                  description={`Reset your progress and study all ${plural(
                    studiableTerms.length,
                    "term"
                  )} from the beginning.`}
                  icon={IconRotateClockwise}
                  onClick={onResetProgress}
                />
                {!stillLearning && type == "folder" && (
                  <Actionable
                    name="Back to folder overview"
                    description=""
                    icon={IconFolder}
                    href={`${router.asPath}/../`}
                  />
                )}
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
          onClick={goBack}
        >
          Back to last card
        </Button>
        {!!stillLearning && (
          <Button
            display={{ base: "none", sm: "inherit" }}
            size="sm"
            rightIcon={<IconArrowRight size={18} />}
            variant="ghost"
            onClick={onNextRound}
          >
            Press any key to continue
          </Button>
        )}
      </Flex>
    </Card>
  );
};

interface ActionableProps {
  name: string;
  description?: string;
  icon: React.FC<TablerIconsProps>;
  onClick?: () => void;
  href?: string;
}

const Actionable: React.FC<ActionableProps> = ({
  name,
  description,
  icon: Icon,
  onClick,
  href,
}) => {
  const bg = useColorModeValue("white", "gray.750");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <LinkBox
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
              <Heading size="md">
                {href ? (
                  <LinkOverlay as={Link} href={href}>
                    {name}
                  </LinkOverlay>
                ) : (
                  name
                )}
              </Heading>
            </Flex>
            {description && (
              <Text fontSize="sm" color={grayText}>
                {description}
              </Text>
            )}
          </Stack>
        </HStack>
        <Box display={{ base: "none", sm: "inherit" }}>
          <IconChevronRight />
        </Box>
      </Flex>
    </LinkBox>
  );
};

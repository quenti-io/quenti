import {
  Text,
  Container,
  Heading,
  Stack,
  Button,
  Link,
  HStack,
  Card,
  Flex,
  IconButton,
  Divider,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";
import { Term } from "@prisma/client";
import {
  IconArrowLeft,
  IconArrowsMaximize,
  IconArrowsShuffle,
  IconBooks,
  IconCards,
  IconEdit,
  IconPlayerPlay,
  IconSettings,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import React from "react";
import { FlashcardWrapper } from "../../components/flashcard-wrapper";
import { useSet } from "../../hooks/use-set";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";
import { shuffleArray } from "../../utils/array";

export default function Set() {
  return (
    <HydrateSetData>
      <Container maxW="7xl" marginBottom="20">
        <Stack spacing={10}>
          <HeadingArea />
          <LinkArea />
          <Divider />
          <FlashcardPreview />
          <Description />
          <TermsOverview />
        </Stack>
      </Container>
    </HydrateSetData>
  );
}

const HeadingArea = () => {
  const data = useSet();

  return (
    <Stack spacing={4}>
      <HStack>
        <Button
          leftIcon={<IconArrowLeft />}
          as={Link}
          href="/sets"
          variant="ghost"
        >
          All sets
        </Button>
      </HStack>
      <Heading size="2xl">{data.title}</Heading>
      <Text color="gray.400">{data.terms.length} terms</Text>
    </Stack>
  );
};

const LinkArea = () => {
  const { id } = useSet();

  return (
    <HStack spacing={4}>
      <Button leftIcon={<IconBooks />} fontWeight={700}>
        Learn
      </Button>
      <Button
        leftIcon={<IconCards />}
        fontWeight={700}
        variant="outline"
        as={Link}
        href={`/sets/${id}/flashcards`}
      >
        Flashcards
      </Button>
      <Button leftIcon={<IconEdit />} variant="ghost" colorScheme="orange">
        Edit
      </Button>
    </HStack>
  );
};

const FlashcardPreview = () => {
  const data = useSet();

  const setShuffle = api.experience.setShuffle.useMutation();

  const [shuffle, toggle] = useExperienceContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(data.termOrder)) : data.termOrder
  );

  React.useEffect(() => {
    setTermOrder(
      shuffle ? shuffleArray(Array.from(data.termOrder)) : data.termOrder
    );
  }, [shuffle]);

  return (
    <Flex
      gap={8}
      flexDir={["column", "column", "column", "row"]}
      alignItems="stretch"
      w="full"
    >
      <Flex maxW="1000px" flex="1">
        <FlashcardWrapper terms={data.terms} termOrder={termOrder} />
      </Flex>
      <Flex
        flexDir={["row", "row", "row", "column"]}
        justifyContent="space-between"
      >
        <Stack spacing={4} pr="4" direction={["row", "row", "row", "column"]}>
          <Button
            leftIcon={<IconArrowsShuffle />}
            variant={shuffle ? "solid" : "outline"}
            onClick={() => {
              toggle();
              setShuffle.mutate({ studySetId: data.id, shuffle: !shuffle });
            }}
          >
            Shuffle
          </Button>
          <Button leftIcon={<IconPlayerPlay />} variant="outline">
            Autoplay
          </Button>
          <Button
            leftIcon={<IconSettings />}
            variant="ghost"
            display={{ base: "none", md: "flex" }}
          >
            Settings
          </Button>
          <IconButton
            icon={<IconSettings />}
            rounded="full"
            variant="ghost"
            display={{ base: "flex", md: "none" }}
            aria-label="Settings"
          />
        </Stack>
        <IconButton
          w="max"
          rounded="full"
          variant="ghost"
          as={Link}
          href={`/sets/${data.id}/flashcards`}
          icon={<IconArrowsMaximize />}
          aria-label="Full screen"
          colorScheme="gray"
        />
      </Flex>
    </Flex>
  );
};

const Description = () => {
  const { description } = useSet();

  return <Text>{description}</Text>;
};

const TermsOverview = () => {
  const data = useSet();

  return (
    <Stack spacing={4}>
      {data.terms
        .sort(
          (a, b) => data.termOrder.indexOf(a.id) - data.termOrder.indexOf(b.id)
        )
        .map((term, i) => (
          <DisplayableTerm term={term} key={term.id} />
        ))}
    </Stack>
  );
};

interface DisplayableTermProps {
  term: Term;
}

const DisplayableTerm: React.FC<DisplayableTermProps> = ({ term }) => {
  const starMutation = api.experience.starTerm.useMutation();
  const unstarMutation = api.experience.unstarTerm.useMutation();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starTerm = useExperienceContext((s) => s.starTerm);
  const unstarTerm = useExperienceContext((s) => s.unstarTerm);

  const starred = starredTerms.includes(term.id);
  const Star = starred ? IconStarFilled : IconStar;

  return (
    <Card px="4" py="5">
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex w="full" flexDir={["column", "row", "row"]} gap={[2, 6, 6]}>
          <Text w="full">{term.word}</Text>
          <Box bg={useColorModeValue("black", "white")} h="full" w="3px" />
          <Text w="full">{term.definition}</Text>
        </Flex>
        <Box h="full">
          <Flex w="full" justifyContent="end">
            <HStack spacing={1} height="24px">
              <IconButton
                icon={<IconEdit />}
                variant="ghost"
                aria-label="Edit"
                rounded="full"
              />
              <IconButton
                icon={<Star />}
                variant="ghost"
                aria-label="Edit"
                rounded="full"
                onClick={() => {
                  if (!starred) {
                    starTerm(term.id);
                    starMutation.mutate({
                      termId: term.id,
                      studySetId: term.studySetId,
                    });
                  } else {
                    unstarTerm(term.id);
                    unstarMutation.mutate({
                      termId: term.id,
                      studySetId: term.studySetId,
                    });
                  }
                }}
              />
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};

export { getServerSideProps } from "../../components/chakra";

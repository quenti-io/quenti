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
  Input,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
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
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useSet } from "../../hooks/use-set";
import { HydrateSetData } from "../../modules/hydrate-set-data";
import { useExperienceContext } from "../../stores/use-experience-store";
import { api } from "../../utils/api";
import { shuffleArray } from "../../utils/array";

export default function Set() {
  return (
    <HydrateSetData>
      <Container maxW="7xl">
        <Stack spacing={10}>
          <HeadingArea />
          <LinkArea />
          <Divider />
        </Stack>
      </Container>
      <Container maxW="full" overflow="hidden" p="0" py="8">
        <Container maxW="7xl">
          <FlashcardPreview />
        </Container>
      </Container>
      <Container maxW="7xl" marginBottom="20">
        <Stack spacing={10}>
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
      <Button
        leftIcon={<IconBooks />}
        fontWeight={700}
        as={Link}
        href={`/sets/${id}/learn`}
      >
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
  }, [shuffle, data.termOrder]);

  return (
    <Flex
      gap={8}
      flexDir={{ base: "column", md: "row" }}
      alignItems="stretch"
      w="full"
    >
      <Flex maxW="1000px" flex="1">
        <FlashcardWrapper terms={data.terms} termOrder={termOrder} />
      </Flex>
      <Flex flexDir="column" justifyContent="space-between">
        <Stack spacing={4}>
          <Stack direction={{ base: "row", md: "column" }} w="full" spacing={4}>
            <Button
              w="full"
              leftIcon={<IconArrowsShuffle />}
              variant={shuffle ? "solid" : "outline"}
              onClick={() => {
                toggle();
                setShuffle.mutate({ studySetId: data.id, shuffle: !shuffle });
              }}
            >
              Shuffle
            </Button>
            <Button leftIcon={<IconPlayerPlay />} variant="outline" w="full">
              Autoplay
            </Button>
          </Stack>
          <Button
            leftIcon={<IconSettings />}
            variant="ghost"
            display={{ base: "none", md: "flex" }}
          >
            Settings
          </Button>
        </Stack>
        <Flex justifyContent={{ base: "end", md: "start" }} marginTop="4">
          <IconButton
            w="max"
            icon={<IconSettings />}
            rounded="full"
            variant="ghost"
            display={{ base: "flex", md: "none" }}
            aria-label="Settings"
            colorScheme="gray"
          />
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
        .map((term) => (
          <DisplayableTerm term={term} key={term.id} />
        ))}
    </Stack>
  );
};

interface DisplayableTermProps {
  term: Term;
}

const DisplayableTerm: React.FC<DisplayableTermProps> = ({ term }) => {
  const utils = api.useContext();

  const starMutation = api.experience.starTerm.useMutation();
  const unstarMutation = api.experience.unstarTerm.useMutation();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starTerm = useExperienceContext((s) => s.starTerm);
  const unstarTerm = useExperienceContext((s) => s.unstarTerm);

  const starred = starredTerms.includes(term.id);
  const Star = starred ? IconStarFilled : IconStar;

  const [isEditing, setIsEditing] = React.useState(false);

  const [editWord, setEditWord] = React.useState(term.word);
  const wordRef = React.useRef(editWord);
  wordRef.current = editWord;

  const [editDefinition, setEditDefinition] = React.useState(term.definition);
  const definitionRef = React.useRef(editDefinition);
  definitionRef.current = editDefinition;

  React.useEffect(() => {
    setEditWord(term.word);
    setEditDefinition(term.definition);
  }, [term.word, term.definition]);

  const edit = api.terms.edit.useMutation({
    async onSuccess() {
      await utils.studySets.invalidate();
    },
  });

  const doEdit = () => {
    setIsEditing((e) => {
      if (e) {
        void (async () =>
          await edit.mutateAsync({
            id: term.id,
            studySetId: term.studySetId,
            word: wordRef.current,
            definition: definitionRef.current,
          }))();
      }

      return false;
    });
  };

  const ref = useOutsideClick(doEdit);

  return (
    <Card px="4" py="5" ref={ref}>
      <Flex
        flexDir={["column-reverse", "row", "row"]}
        alignItems="stretch"
        gap={[0, 6, 6]}
      >
        <Flex w="full" flexDir={["column", "row", "row"]} gap={[2, 6, 6]}>
          {isEditing ? (
            <Input
              value={editWord}
              onChange={(e) => setEditWord(e.target.value)}
              w="full"
              variant="flushed"
              onKeyDown={(e) => {
                if (e.key === "Enter") doEdit();
              }}
            />
          ) : (
            <Text w="full">{editWord}</Text>
          )}
          <Box bg={useColorModeValue("black", "white")} h="full" w="3px" />
          {isEditing ? (
            <Input
              value={editDefinition}
              onChange={(e) => setEditDefinition(e.target.value)}
              w="full"
              variant="flushed"
              onKeyDown={(e) => {
                if (e.key === "Enter") doEdit();
              }}
            />
          ) : (
            <Text w="full">{editDefinition}</Text>
          )}
        </Flex>
        <Box h="full">
          <Flex w="full" justifyContent="end">
            <HStack spacing={1} height="24px">
              <IconButton
                icon={<IconEdit />}
                variant={isEditing ? "solid" : "ghost"}
                aria-label="Edit"
                rounded="full"
                onClick={() => {
                  if (isEditing) {
                    edit.mutate({
                      id: term.id,
                      studySetId: term.studySetId,
                      word: editWord,
                      definition: editDefinition,
                    });
                  }
                  setIsEditing(!isEditing);
                }}
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

import {
  Center,
  Text,
  Container,
  Heading,
  Spinner,
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
import {
  StarredTerm,
  StudySet,
  StudySetExperience,
  Term,
} from "@prisma/client";
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
import { useRouter } from "next/router";
import React from "react";
import { FlashcardWrapper } from "../../components/flashcard-wrapper";
import {
  createExperienceStore,
  ExperienceContext,
  ExperienceStore,
  useExperienceContext,
} from "../../stores/use-experience-store";
import { api } from "../../utils/api";
import { shuffleArray } from "../../utils/array";

type DataType = StudySet & {
  terms: Term[];
  studySetExperiences: (StudySetExperience & {
    starredTerms: StarredTerm[];
  })[];
};

export default function Set() {
  const id = useRouter().query.id as string;
  const { data } = api.studySets.byId.useQuery(id);

  if (!data)
    return (
      <Center height="calc(100vh - 120px)">
        <Spinner color="blue.200" />
      </Center>
    );

  return <LoadedSet data={data} />;
}

const LoadedSet: React.FC<{ data: DataType }> = ({ data }) => {
  const storeRef = React.useRef<ExperienceStore>();
  if (!storeRef.current) {
    storeRef.current = createExperienceStore({
      starredTerms: data.studySetExperiences[0]?.starredTerms.map(
        (x) => x.termId
      ),
    });
  }

  React.useEffect(() => {
    storeRef.current?.setState({
      starredTerms: data.studySetExperiences[0]?.starredTerms.map(
        (x) => x.termId
      ),
    });
  }, [data]);

  return (
    <ExperienceContext.Provider value={storeRef.current}>
      <HydratedSet data={data} />
    </ExperienceContext.Provider>
  );
};

const HydratedSet: React.FC<{ data: DataType }> = ({ data }) => {
  const id = useRouter().query.id as string;

  const [shuffle, setShuffle] = React.useState(false);

  return (
    <Container maxW="7xl" marginBottom="20">
      <Stack spacing={10}>
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
        <HStack spacing={4}>
          <Button leftIcon={<IconBooks />} fontWeight={700}>
            Learn
          </Button>
          <Button leftIcon={<IconCards />} fontWeight={700} variant="outline">
            Flashcards
          </Button>
          <Button leftIcon={<IconEdit />} variant="ghost" colorScheme="orange">
            Edit
          </Button>
        </HStack>
        <Divider />
        <Flex
          gap={8}
          flexDir={["column", "column", "column", "row"]}
          alignItems="stretch"
          w="full"
        >
          <Flex maxW="1000px" flex="1">
            <FlashcardWrapper
              terms={data.terms}
              termOrder={
                !shuffle
                  ? data.termOrder
                  : shuffleArray(Array.from(data.termOrder))
              }
            />
          </Flex>
          <Flex
            flexDir={["row", "row", "row", "column"]}
            justifyContent="space-between"
          >
            <Stack
              spacing={4}
              pr="4"
              direction={["row", "row", "row", "column"]}
            >
              <Button
                leftIcon={<IconArrowsShuffle />}
                variant={shuffle ? "solid" : "outline"}
                onClick={() => {
                  setShuffle((s) => !s);
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
              href={`/sets/${id}/flashcards`}
              icon={<IconArrowsMaximize />}
              aria-label="Full screen"
              colorScheme="gray"
            />
          </Flex>
        </Flex>
        <Text>{data.description}</Text>
        <Stack spacing={4}>
          {data.terms
            .sort(
              (a, b) =>
                data.termOrder.indexOf(a.id) - data.termOrder.indexOf(b.id)
            )
            .map((term, i) => (
              <DisplayableTerm term={term} key={term.id} />
            ))}
        </Stack>
      </Stack>
    </Container>
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

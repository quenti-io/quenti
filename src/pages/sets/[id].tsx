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
} from "@tabler/icons";
import { useRouter } from "next/router";
import React from "react";
import { FlashcardWrapper } from "../../components/flashcard-wrapper";
import { api } from "../../utils/api";
import { shuffleArray } from "../../utils/array";

export default function Set() {
  const utils = api.useContext();

  const id = useRouter().query.id as string;
  const { data } = api.studySets.byId.useQuery(id);

  const [shuffle, setShuffle] = React.useState(false);

  if (!data)
    return (
      <Center height="calc(100vh - 120px)">
        <Spinner color="blue.200" />
      </Center>
    );

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
              <DisplayableTerm term={term} key={term.id} index={i} />
            ))}
        </Stack>
      </Stack>
    </Container>
  );
}

interface DisplayableTermProps {
  term: Term;
  index: number;
}

const DisplayableTerm: React.FC<DisplayableTermProps> = ({ term, index }) => {
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
                icon={<IconStar />}
                variant="ghost"
                aria-label="Edit"
                rounded="full"
              />
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Card>
  );
};

export { getServerSideProps } from "../../components/chakra";

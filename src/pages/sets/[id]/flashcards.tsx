import React from "react";
import {
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
} from "@chakra-ui/react";
import { FlashcardWrapper } from "../../../components/flashcard-wrapper";
import {
  IconArrowsShuffle,
  IconChevronDown,
  IconPlayerPlay,
  IconX,
} from "@tabler/icons-react";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { useSet } from "../../../hooks/use-set";
import { useExperienceContext } from "../../../stores/use-experience-store";
import { shuffleArray } from "../../../utils/array";
import { api } from "../../../utils/api";

export default function Flashcards() {
  return (
    <HydrateSetData>
      <Container maxW="full" h="calc(100vh - 80px)" overflow="hidden" px="0">
        <Container maxW="7xl" h="calc(100vh - 180px)">
          <Stack spacing={6}>
            <TitleBar />
            <Flashcard />
            <ControlsBar />
          </Stack>
        </Container>
      </Container>
    </HydrateSetData>
  );
}

const TitleBar = () => {
  const { id, title } = useSet();

  return (
    <Flex w="full" alignItems="center" mt="2" justifyContent="space-between">
      <Button
        variant="ghost"
        rightIcon={<IconChevronDown />}
        fontWeight={700}
        w="150px"
      >
        Flashcards
      </Button>
      <Heading
        size="md"
        flex="1"
        textAlign="center"
        display={{ base: "none", md: "block" }}
      >
        {title}
      </Heading>
      <Flex w="150px" justifyContent="end">
        <IconButton
          icon={<IconX />}
          as={Link}
          href={`/sets/${id}`}
          aria-label="Close"
          rounded="full"
          variant="ghost"
          colorScheme="gray"
        />
      </Flex>
    </Flex>
  );
};

const Flashcard = () => {
  const { terms, termOrder: _termOrder } = useSet();

  const shuffle = useExperienceContext((s) => s.shuffleFlashcards);
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder
  );

  React.useEffect(() => {
    setTermOrder(shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder);
  }, [shuffle]);

  return (
    <FlashcardWrapper
      h="calc(100vh - 240px)"
      terms={terms}
      termOrder={termOrder}
    />
  );
};

const ControlsBar = () => {
  const { id } = useSet();
  const setShuffle = api.experience.setShuffle.useMutation();

  const [shuffle, toggle] = useExperienceContext((s) => [
    s.shuffleFlashcards,
    s.toggleShuffleFlashcards,
  ]);

  return (
    <Flex justifyContent="space-between">
      <IconButton
        icon={<IconArrowsShuffle />}
        aria-label="Shuffle"
        rounded="full"
        variant={shuffle ? "solid" : "ghost"}
        colorScheme="gray"
        onClick={() => {
          toggle();
          setShuffle.mutate({ studySetId: id, shuffle: !shuffle });
        }}
      />
      <IconButton
        icon={<IconPlayerPlay />}
        aria-label="Shuffle"
        rounded="full"
        variant="ghost"
        colorScheme="gray"
      />
    </Flex>
  );
};

export { getServerSideProps } from "../../../components/chakra";

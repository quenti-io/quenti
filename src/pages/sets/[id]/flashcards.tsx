import {
  Button, Container,
  Flex,
  Heading,
  IconButton,
  Link, Stack
} from "@chakra-ui/react";
import { FlashcardWrapper } from "../../../components/flashcard-wrapper";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { useSet } from "../../../hooks/use-set";

export default function Flashcards() {
  return (
    <HydrateSetData>
      <Container maxW="full" h="calc(100vh - 80px)" overflow="hidden" px="0">
        <Container maxW="7xl" h="calc(100vh - 180px)">
          <Stack spacing={6}>
            <TitleBar />
            <Flashcard />
          </Stack>
        </Container>
      </Container>
    </HydrateSetData>
  );
}

const TitleBar = () => {
  const { id, title } = useSet();

  return (
    <Flex w="full" alignItems="center" mt="2">
      <Button
        variant="ghost"
        rightIcon={<IconChevronDown />}
        fontWeight={700}
        w="150px"
      >
        Flashcards
      </Button>
      <Heading size="md" flex="1" textAlign="center">
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
  const { terms, termOrder } = useSet();

  return (
    <FlashcardWrapper
      h="calc(100vh - 180px)"
      terms={terms}
      termOrder={termOrder}
    />
  );
};

export { getServerSideProps } from "../../../components/chakra";

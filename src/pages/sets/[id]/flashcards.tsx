import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import {
  Button,
  Center,
  Container,
  Flex, Heading, IconButton,
  Link,
  Spinner,
  Stack
} from "@chakra-ui/react";
import { FlashcardWrapper } from "../../../components/flashcard-wrapper";
import { IconChevronDown, IconX } from "@tabler/icons";

export default function Flashcards() {
  const id = useRouter().query.id as string;
  const { data } = api.studySets.byId.useQuery(id);

  if (!data)
    return (
      <Center height="calc(100vh - 120px)">
        <Spinner color="blue.200" />
      </Center>
    );

  return (
    <Container maxW="full" h="calc(100vh - 80px)" overflow="hidden" px="0">
      <Container maxW="7xl" h="calc(100vh - 180px)">
        <Stack spacing={6}>
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
              {data.title}
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
          <FlashcardWrapper
            h="calc(100vh - 180px)"
            terms={data.terms}
            termOrder={data.termOrder}
          />
        </Stack>
      </Container>
    </Container>
  );
}

export { getServerSideProps } from "../../../components/chakra";

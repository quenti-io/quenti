import { Button, Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const TitleBar = () => {
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
          href={`/${id}`}
          aria-label="Close"
          rounded="full"
          variant="ghost"
          colorScheme="gray"
        />
      </Flex>
    </Flex>
  );
};

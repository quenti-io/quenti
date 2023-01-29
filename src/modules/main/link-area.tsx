import { Button, HStack, Link } from "@chakra-ui/react";
import { IconBooks, IconCards, IconEdit } from "@tabler/icons-react";
import { useSet } from "../../hooks/use-set";

export const LinkArea = () => {
  const { id } = useSet();

  return (
    <HStack spacing={4}>
      <Button
        leftIcon={<IconBooks />}
        fontWeight={700}
        as={Link}
        href={`/${id}/learn`}
      >
        Learn
      </Button>
      <Button
        leftIcon={<IconCards />}
        fontWeight={700}
        variant="outline"
        as={Link}
        href={`/${id}/flashcards`}
      >
        Flashcards
      </Button>
      <Button leftIcon={<IconEdit />} variant="ghost" colorScheme="orange">
        Edit
      </Button>
    </HStack>
  );
};

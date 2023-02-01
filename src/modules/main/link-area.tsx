import { Button, ButtonGroup, Link } from "@chakra-ui/react";
import { IconBrain, IconCards, IconEdit } from "@tabler/icons-react";
import { SetCreatorOnly } from "../../components/set-creator-only";
import { useSet } from "../../hooks/use-set";

export const LinkArea = () => {
  const { id } = useSet();

  return (
    <ButtonGroup
      spacing={0}
      flexDir={{ base: "column", sm: "row" }}
      w="full"
      gap={4}
      size="lg"
    >
      <Button
        leftIcon={<IconBrain />}
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
      <SetCreatorOnly>
        <Button
          leftIcon={<IconEdit />}
          variant="ghost"
          colorScheme="orange"
          as={Link}
          href={`/${id}/edit`}
        >
          Edit
        </Button>
      </SetCreatorOnly>
    </ButtonGroup>
  );
};

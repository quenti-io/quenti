import { Button, Flex, Heading, IconButton, Link } from "@chakra-ui/react";
import { IconChevronDown, IconX } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";

export const TitleBar = () => {
  const router = useRouter();
  const { id, title, type } = useSetFolderUnison();

  const backHref =
    type == "set"
      ? `/${id}`
      : `/${router.query.username as string}/folders/${
          router.query.slug as string
        }`;

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
          href={backHref}
          aria-label="Close"
          rounded="full"
          variant="ghost"
          colorScheme="gray"
        />
      </Flex>
    </Flex>
  );
};

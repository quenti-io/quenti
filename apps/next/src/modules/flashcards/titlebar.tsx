import { Link } from "@quenti/components";

import { Flex, Heading, IconButton, Tag } from "@chakra-ui/react";

import { IconX } from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";

export const TitleBar = () => {
  const { title } = useSetFolderUnison();
  const rootUrl = useEntityRootUrl();

  return (
    <Flex
      w="full"
      gap={4}
      alignItems="center"
      mt="2"
      justifyContent="space-between"
    >
      <Tag size="lg" fontWeight={700} colorScheme="blue" w="110px">
        Flashcards
      </Tag>
      <Heading
        size="md"
        flex="1"
        textAlign="center"
        display={{ base: "none", md: "block" }}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {title}
      </Heading>
      <Flex w="110px" justifyContent="end">
        <IconButton
          icon={<IconX />}
          as={Link}
          href={rootUrl}
          aria-label="Close"
          rounded="full"
          variant="ghost"
          colorScheme="gray"
        />
      </Flex>
    </Flex>
  );
};

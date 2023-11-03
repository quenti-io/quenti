import { Link } from "@quenti/components";
import { HeadSeo } from "@quenti/components/head-seo";

import { Flex, Heading, IconButton, Skeleton, Tag } from "@chakra-ui/react";

import { IconX } from "@tabler/icons-react";

import { useEntityRootUrl } from "../../hooks/use-entity-root-url";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";

export const TitleBar = () => {
  const { title } = useSetFolderUnison();
  const rootUrl = useEntityRootUrl();

  return (
    <>
      <HeadSeo title={`Flashcards: ${title}`} />
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
    </>
  );
};

interface TitleBarSkeletonProps {
  titlePlaceholder?: string;
}

TitleBar.Skeleton = function TitleBarSkeleton({
  titlePlaceholder,
}: TitleBarSkeletonProps) {
  return (
    <Flex
      w="full"
      gap={4}
      alignItems="center"
      mt="2"
      justifyContent="space-between"
    >
      <Skeleton fitContent rounded="lg">
        <Tag size="lg" fontWeight={700} colorScheme="blue" w="110px">
          Flashcards
        </Tag>
      </Skeleton>
      <Skeleton fitContent rounded="lg">
        <Heading
          size="md"
          flex="1"
          textAlign="center"
          display={{ base: "none", md: "block" }}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {titlePlaceholder ?? "Flashcards Placeholder"}
        </Heading>
      </Skeleton>
      <Flex w="110px" justifyContent="end">
        <Skeleton rounded="full" fitContent>
          <IconButton icon={<IconX />} aria-label="Close" rounded="full" />
        </Skeleton>
      </Flex>
    </Flex>
  );
};

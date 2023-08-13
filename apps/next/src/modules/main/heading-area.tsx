import {
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Stack,
  Tag,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconDotsVertical, IconEdit, IconTrash } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React from "react";
import { visibilityIcon } from "../../common/visibility-icon";
import { ConfirmModal } from "../../components/confirm-modal";
import { Link } from "@quenti/components";
import { MenuOption } from "../../components/menu-option";
import { SetCreatorOnly } from "../../components/set-creator-only";
import { useSet } from "../../hooks/use-set";
import { api } from "@quenti/trpc";

export const HeadingArea = () => {
  const { id, title, tags, terms, visibility } = useSet();
  const router = useRouter();
  const text = useColorModeValue("gray.600", "gray.400");
  const tagBg = useColorModeValue("gray.200", "gray.750");
  const menuBg = useColorModeValue("white", "gray.800");

  const deleteSet = api.studySets.delete.useMutation({
    onSuccess: async () => {
      await router.push("/home");
    },
  });
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);

  return (
    <>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        heading="Delete this set?"
        body={
          <Text>
            Are you absolutely sure you want to delete this set and all
            associated data? This action cannot be undone.
          </Text>
        }
        actionText="Delete"
        isLoading={deleteSet.isLoading}
        onConfirm={() => {
          deleteSet.mutate({ studySetId: id });
        }}
      />
      <Stack spacing={4} maxW="1000px">
        {tags.length && (
          <HStack spacing={3}>
            {tags.map((t, i) => (
              <Tag bg={tagBg} key={i}>
                {t}
              </Tag>
            ))}
          </HStack>
        )}
        <Heading size="2xl">{title}</Heading>
        <Flex justifyContent="space-between" maxW="1000px" h="32px">
          <HStack color={text} fontWeight={600} spacing={2}>
            <HStack>
              {visibilityIcon(visibility, 18)}
              <Text>{visibility}</Text>
            </HStack>
            <Text>•</Text>
            <Text>
              {terms?.length || 5} term{terms?.length != 1 ? "s" : ""}
            </Text>
          </HStack>
          <SetCreatorOnly>
            <HStack>
              <Button
                leftIcon={<IconEdit />}
                size="sm"
                variant="ghost"
                as={Link}
                href={`/${id}/edit`}
              >
                Edit
              </Button>
              <Menu placement="bottom-end">
                <MenuButton>
                  <IconButton
                    icon={<IconDotsVertical />}
                    aria-label="Options"
                    size="xs"
                    variant="ghost"
                    as="div"
                  />
                </MenuButton>
                <MenuList bg={menuBg} py={0} overflow="hidden">
                  <MenuOption
                    icon={<IconTrash size={20} />}
                    label="Delete"
                    onClick={() => setDeleteModalOpen(true)}
                  />
                </MenuList>
              </Menu>
            </HStack>
          </SetCreatorOnly>
        </Flex>
      </Stack>
    </>
  );
};

HeadingArea.Skeleton = function HeadingAreaSkeleton() {
  return (
    <Stack spacing={4} maxW="1000px">
      <Skeleton>
        <Heading size="2xl">Loading...</Heading>
      </Skeleton>
      <Flex justifyContent="space-between" maxW="1000px" h="32px">
        <HStack fontWeight={600} spacing={2}>
          <Skeleton w="18px" h="18px" rounded="full" />
          <Skeleton fitContent h="18px">
            <HStack>
              <Text>Public</Text>
              <Text>•</Text>
              <Text>10 terms</Text>
            </HStack>
          </Skeleton>
        </HStack>
      </Flex>
    </Stack>
  );
};

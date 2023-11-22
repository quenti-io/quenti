import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconDotsVertical,
  IconEditCircle,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { ConfirmModal } from "../../components/confirm-modal";
import { MenuOption } from "../../components/menu-option";
import { editorEventChannel } from "../../events/editor";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";
import { getRelativeTime } from "../../utils/time";

export const TopBar = () => {
  const router = useRouter();
  const id = useSetEditorContext((s) => s.id);
  const mode = useSetEditorContext((s) => s.mode);
  const isLoading = useSetEditorContext((s) => s.isLoading);
  const setIsLoading = useSetEditorContext((s) => s.setIsLoading);
  const saveError = useSetEditorContext((s) => s.saveError);
  const savedAt = useSetEditorContext((s) => s.savedAt);
  const numTerms = useSetEditorContext((s) => s.serverTerms.length);
  const onComplete = useSetEditorContext((s) => s.onComplete);

  const isSaving = useSetEditorContext((s) => s.isSaving);
  const isSavingRef = React.useRef(isSaving);
  isSavingRef.current = isSaving;

  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const bg = useColorModeValue("white", "gray.800");

  const text = isSaving
    ? "Saving..."
    : saveError ??
      `${plural(numTerms, "term")} saved ${
        getRelativeTime(savedAt) || "just now"
      }`;

  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const errorColor = useColorModeValue("red.500", "red.300");
  const errorState = saveError && !isSaving;

  const deleteSet = api.studySets.delete.useMutation({
    onSuccess: async () => {
      if (mode == "edit") await router.push("/home");
      else {
        editorEventChannel.emit("refresh");
      }
    },
  });
  const createAutosave = api.studySets.createAutosave.useMutation({
    onSuccess: async () => {
      if (router.pathname == "/create") editorEventChannel.emit("refresh");
      else await router.push("/create");
    },
  });

  return (
    <HStack
      py="4"
      px="5"
      bg={bg}
      rounded="xl"
      position="sticky"
      top="2"
      w={{ base: "calc(100% + 16px)", sm: "calc(100% + 40px)" }}
      ml={{ base: "-8px", sm: "-20px" }}
      zIndex="50"
      borderWidth="2px"
      transition="border-color 0.2s ease-in-out"
      borderColor={errorState ? errorColor : "gray.100"}
      _dark={{
        borderColor: errorState ? errorColor : "gray.750",
      }}
      shadow="xl"
    >
      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        heading={mode == "edit" ? "Delete this set?" : "Discard this draft?"}
        body={
          mode == "edit" ? (
            <Text>
              Are you absolutely sure you want to delete this set and all
              associated data? This action cannot be undone.
            </Text>
          ) : (
            "Are you sure you want to discard this draft? This action cannot be undone."
          )
        }
        actionText={mode == "edit" ? "Delete" : "Discard"}
        onConfirm={() => {
          deleteSet.mutate({
            studySetId: id,
          });
        }}
        isLoading={deleteSet.isLoading}
        destructive
      />
      <Flex align="center" justify="space-between" w="full">
        <Stack>
          <HStack spacing="10px">
            <IconEditCircle size={18} />
            <Heading fontSize="lg">
              {mode == "create" ? "Create a new set" : "Edit set"}
            </Heading>
          </HStack>
          <HStack color={subTextColor} spacing={4}>
            {isSaving && <Spinner size="sm" />}
            <Text
              fontSize="sm"
              color={errorState ? errorColor : undefined}
              fontWeight={errorState ? 600 : undefined}
            >
              {text}
            </Text>
          </HStack>
        </Stack>
        <HStack spacing="1">
          <Button
            fontWeight={700}
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true);

              const complete = () => {
                setTimeout(() => {
                  if (!isSavingRef.current) onComplete();
                  else complete();
                }, 100);
              };
              complete();
            }}
          >
            {mode == "edit" ? "Done" : "Create"}
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              size="sm"
              variant="ghost"
              colorScheme="gray"
            >
              <Box w="8" display="flex" justifyContent="center">
                <IconDotsVertical size="18" />
              </Box>
            </MenuButton>
            <MenuList
              py={0}
              overflow="hidden"
              minW="auto"
              w="40"
              shadow="lg"
              mt="2"
            >
              {mode == "create" && (
                <MenuOption
                  icon={<IconPlus size={18} />}
                  label="New draft"
                  onClick={() => {
                    createAutosave.mutate();
                  }}
                />
              )}
              <MenuOption
                icon={<IconTrash size={18} />}
                label={mode == "create" ? "Discard draft" : "Delete set"}
                onClick={() => setDeleteOpen(true)}
              />
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </HStack>
  );
};

TopBar.Skeleton = function TopBarSkeleton() {
  return (
    <Skeleton
      rounded="xl"
      position="sticky"
      top="2"
      zIndex="50"
      shadow="xl"
      w={{ base: "calc(100% + 16px)", sm: "calc(100% + 40px)" }}
      ml={{ base: "-8px", sm: "-20px" }}
      borderWidth="2px"
    >
      <HStack py="4" px="5" rounded="xl">
        <Stack>
          <HStack>
            <Heading fontSize="lg">Create new set</Heading>
          </HStack>
          <Text fontSize="sm">5 terms saved just now</Text>
        </Stack>
        <Button>Done</Button>
      </HStack>
    </Skeleton>
  );
};

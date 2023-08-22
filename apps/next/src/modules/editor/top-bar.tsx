import React from "react";

import {
  Button,
  Flex,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconPencil } from "@tabler/icons-react";

import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";
import { getRelativeTime } from "../../utils/time";

export const TopBar = () => {
  const mode = useSetEditorContext((s) => s.mode);
  const isLoading = useSetEditorContext((s) => s.isLoading);
  const setIsLoading = useSetEditorContext((s) => s.setIsLoading);
  const saveError = useSetEditorContext((s) => s.saveError);
  const setSaveError = useSetEditorContext((s) => s.setSaveError);
  const savedAt = useSetEditorContext((s) => s.savedAt);
  const numTerms = useSetEditorContext((s) => s.terms.length);
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

  React.useEffect(() => {
    setSaveError(undefined);
  }, [setSaveError, isSaving]);

  const errorColor = useColorModeValue("red.500", "red.300");
  const errorState = saveError && !isSaving;

  return (
    <HStack
      py="3"
      px="5"
      bg={bg}
      rounded="lg"
      position="sticky"
      top="2"
      zIndex="50"
      borderWidth="2px"
      borderColor="gray.100"
      _dark={{
        borderColor: "gray.750",
      }}
      shadow="xl"
    >
      <Flex align="center" justify="space-between" w="full">
        <Stack>
          <HStack>
            <IconPencil size={18} />
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
        <Button
          fontWeight={700}
          isLoading={isLoading}
          onClick={() => {
            if (mode == "edit") setIsLoading(true);

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
      </Flex>
    </HStack>
  );
};

import {
  Button,
  Flex,
  HStack,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconPencil } from "@tabler/icons-react";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";

export const TopBar = () => {
  const mode = useSetEditorContext((s) => s.mode);
  const isSaving = useSetEditorContext((s) => s.isSaving);
  const isLoading = useSetEditorContext((s) => s.isLoading);
  const numTerms = useSetEditorContext((s) => s.terms.length);
  const onComplete = useSetEditorContext((s) => s.onComplete);

  const subTextColor = useColorModeValue("gray.600", "gray.400");
  const bg = useColorModeValue("gray.200", "gray.800");

  return (
    <HStack
      py="3"
      px="5"
      bg={bg}
      rounded="lg"
      position="sticky"
      top="2"
      zIndex="10"
      shadow="xl"
    >
      <Flex align="center" justify="space-between" w="full">
        <Stack>
          <HStack>
            <IconPencil />
            <Text fontSize="lg" fontWeight={600}>
              {mode == "create" ? "Create a new set" : "Edit set"}
            </Text>
          </HStack>
          <HStack color={subTextColor} spacing={4}>
            {isSaving && <Spinner size="sm" />}
            <Text fontSize="sm">
              {isSaving
                ? "Saving..."
                : `${plural(numTerms, "term")} saved just now`}
            </Text>
          </HStack>
        </Stack>
        <Button
          fontWeight={700}
          isLoading={isLoading}
          isDisabled={isSaving}
          onClick={onComplete}
        >
          {mode == "edit" ? "Done" : "Create"}
        </Button>
      </Flex>
    </HStack>
  );
};

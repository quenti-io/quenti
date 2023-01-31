import {
  Flex,
  HStack,
  Stack,
  useColorModeValue,
  Text,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { IconPencil } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { plural } from "../../utils/string";

export interface TopBarProps {
  savedAt?: Date;
  isSaving: boolean;
  numTerms: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  savedAt,
  isSaving,
  numTerms,
}) => {
  const router = useRouter();

  const create = api.studySets.createFromAutosave.useMutation({
    onSuccess: async (data) => {
      await router.push(`/${data.id}`);
    },
  });

  return (
    <HStack
      py="3"
      px="5"
      bg={useColorModeValue("gray.100", "gray.800")}
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
              Create a new set
            </Text>
          </HStack>
          <HStack color="gray.400" spacing={4}>
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
          isLoading={create.isLoading}
          isDisabled={isSaving}
          onClick={() => {
            create.mutate();
          }}
        >
          Create
        </Button>
      </Flex>
    </HStack>
  );
};

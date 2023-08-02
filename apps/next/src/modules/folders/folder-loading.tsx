import {
  Container,
  Text,
  Divider,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { WithFooter } from "../../components/with-footer";
import { ActionArea } from "./action-area";
import { FolderHeading } from "./folder-heading";
import { FolderSets } from "./folder-sets";

export const FolderLoading = () => {
  const dividerColor = useColorModeValue("gray.400", "gray.600");

  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing={12}>
          <Stack spacing={8}>
            <FolderHeading.Skeleton />
            <ActionArea.Skeleton />
          </Stack>
          <Stack spacing={6}>
            <Text whiteSpace="pre-wrap"></Text>
            <Divider borderColor={dividerColor} />
            <FolderSets.Skeleton />
          </Stack>
        </Stack>
      </Container>
    </WithFooter>
  );
};

import { Container, Stack, Text } from "@chakra-ui/react";
import { WithFooter } from "../../components/with-footer";
import { ActionArea } from "./action-area";
import { FolderHeading } from "./folder-heading";
import { FolderSets } from "./folder-sets";

export const FolderLoading = () => {
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
            <FolderSets.Skeleton />
          </Stack>
        </Stack>
      </Container>
    </WithFooter>
  );
};

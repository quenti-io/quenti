import { Container, Flex, Stack } from "@chakra-ui/react";

import { WithFooter } from "../../components/with-footer";
import { FolderHeading } from "./folder-heading";
import { FolderSets } from "./folder-sets";
import { LinkArea } from "./link-area";

export const FolderLoading = () => {
  return (
    <WithFooter>
      <Container maxW="7xl">
        <Stack spacing={12}>
          <FolderHeading.Skeleton />
          <Flex
            gap={8}
            flexDir={{ base: "column", lg: "row" }}
            alignItems="stretch"
            w="full"
          >
            <LinkArea.Skeleton />
            <Flex flex="1">
              <FolderSets.Skeleton />
            </Flex>
          </Flex>
        </Stack>
      </Container>
    </WithFooter>
  );
};

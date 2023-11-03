import { Container, Flex, Stack } from "@chakra-ui/react";

import { FolderDescription } from "../modules/folders/folder-description";
import { FolderHeading } from "../modules/folders/folder-heading";
import { FolderLoading } from "../modules/folders/folder-loading";
import { FolderSets } from "../modules/folders/folder-sets";
import { LinkArea } from "../modules/folders/link-area";
import { HydrateFolderData } from "../modules/hydrate-folder-data";
import { WithFooter } from "./with-footer";

const InternalFolder = () => {
  return (
    <HydrateFolderData fallback={<FolderLoading />}>
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={12}>
            <Stack spacing="0">
              <FolderHeading />
              <FolderDescription />
            </Stack>
            <Flex
              gap={8}
              flexDir={{ base: "column", lg: "row" }}
              alignItems="stretch"
              w="full"
            >
              <LinkArea />
              <Flex flex="1">
                <FolderSets />
              </Flex>
            </Flex>
          </Stack>
        </Container>
      </WithFooter>
    </HydrateFolderData>
  );
};

export default InternalFolder;

import { Container, Stack } from "@chakra-ui/react";

import type { ComponentWithAuth } from "../../../../components/auth-component";
import { WithFooter } from "../../../../components/with-footer";
import { ActionArea } from "../../../../modules/folders/action-area";
import { FolderDescription } from "../../../../modules/folders/folder-description";
import { FolderHeading } from "../../../../modules/folders/folder-heading";
import { FolderLoading } from "../../../../modules/folders/folder-loading";
import { FolderSets } from "../../../../modules/folders/folder-sets";
import { HydrateFolderData } from "../../../../modules/hydrate-folder-data";

const FolderPage: ComponentWithAuth = () => {
  return (
    <HydrateFolderData fallback={<FolderLoading />}>
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={12}>
            <Stack spacing={8}>
              <FolderHeading />
              <ActionArea />
            </Stack>
            <Stack spacing={6}>
              <FolderDescription />
              <FolderSets />
            </Stack>
          </Stack>
        </Container>
      </WithFooter>
    </HydrateFolderData>
  );
};

FolderPage.authenticationEnabled = true;

export default FolderPage;

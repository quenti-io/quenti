import { Container, Stack } from "@chakra-ui/react";

import { PageWrapper } from "../../../../common/page-wrapper";
import { WithFooter } from "../../../../components/with-footer";
import { getLayout } from "../../../../layouts/main-layout";
import { ActionArea } from "../../../../modules/folders/action-area";
import { FolderDescription } from "../../../../modules/folders/folder-description";
import { FolderHeading } from "../../../../modules/folders/folder-heading";
import { FolderLoading } from "../../../../modules/folders/folder-loading";
import { FolderSets } from "../../../../modules/folders/folder-sets";
import { HydrateFolderData } from "../../../../modules/hydrate-folder-data";

const FolderPage = () => {
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

FolderPage.PageWrapper = PageWrapper;
FolderPage.getLayout = getLayout;

export default FolderPage;

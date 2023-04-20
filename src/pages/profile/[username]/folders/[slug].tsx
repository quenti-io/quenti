import { Container, Divider, Stack, useColorModeValue } from "@chakra-ui/react";
import { folderServerSideProps as getServerSideProps } from "../../../../common/server-side-props";
import type { ComponentWithAuth } from "../../../../components/auth-component";
import { WithFooter } from "../../../../components/with-footer";
import { ActionArea } from "../../../../modules/folders/action-area";
import { FolderDescription } from "../../../../modules/folders/folder-description";
import { FolderHeading } from "../../../../modules/folders/folder-heading";
import { FolderSets } from "../../../../modules/folders/folder-sets";
import { HydrateFolderData } from "../../../../modules/hydrate-folder-data";

const FolderPage: ComponentWithAuth = () => {
  const dividerColor = useColorModeValue("gray.400", "gray.600");

  return (
    <HydrateFolderData>
      <WithFooter>
        <Container maxW="7xl">
          <Stack spacing={12}>
            <Stack spacing={8}>
              <FolderHeading />
              <ActionArea />
            </Stack>
            <Stack spacing={6}>
              <FolderDescription />
              <Divider borderColor={dividerColor} />
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
export { getServerSideProps };

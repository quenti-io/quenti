import { Container } from "@chakra-ui/react";
import { ComponentWithAuth } from "../../../../components/auth-component";
import { FolderHeading } from "../../../../modules/folders/folder-heading";
import { HydrateFolderData } from "../../../../modules/hydrate-folder-data";

const FolderPage: ComponentWithAuth = () => {
  return (
    <HydrateFolderData>
      <Container maxW="7xl" marginTop="10">
        <FolderHeading />
      </Container>
    </HydrateFolderData>
  );
};

FolderPage.authenticationEnabled = true;

export default FolderPage;

export { getServerSideProps } from "../../../../components/chakra";

import { Container, Stack } from "@chakra-ui/react";

import { EditorGlobalStyles } from "../common/editor-global-styles";
import HydrateSetData from "../modules/hydrate-set-data";
import { CollabDetails } from "../modules/main/collab-details";
import { DescriptionArea } from "../modules/main/description-area";
import { FlashcardPreview } from "../modules/main/flashcard-preview";
import { HeadingArea } from "../modules/main/heading-area";
import { SetLoading } from "../modules/main/set-loading";
import { TermsOverview } from "../modules/main/terms-overview";
import { TermImageLayer } from "../modules/term-image-layer";
import { PhotoViewProvider } from "./photo-view/provider";
import { WithFooter } from "./with-footer";

interface InternalSetProps {
  collab?: boolean;
}

const InternalSet: React.FC<InternalSetProps> = ({ collab }) => {
  return (
    <PhotoViewProvider>
      <HydrateSetData
        placeholder={<SetLoading collab={collab} />}
        isPublic
        withCollab={collab}
      >
        <EditorGlobalStyles />
        <TermImageLayer />
        <WithFooter>
          <Container maxW="7xl">
            <Stack spacing={10}>
              <HeadingArea />
            </Stack>
          </Container>
          <Container maxW="full" overflow="hidden" px="0" py="6">
            <Container maxW="7xl" p="4">
              <Stack spacing={10} w="full">
                <FlashcardPreview />
                {collab ? <CollabDetails /> : <DescriptionArea />}
              </Stack>
            </Container>
          </Container>
          <Container maxW="7xl">
            <Stack spacing={10}>
              <TermsOverview />
            </Stack>
          </Container>
        </WithFooter>
      </HydrateSetData>
    </PhotoViewProvider>
  );
};

export default InternalSet;

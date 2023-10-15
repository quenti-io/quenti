import React from "react";
import { shallow } from "zustand/shallow";

import { HeadSeo } from "@quenti/components";

import { Container } from "@chakra-ui/react";

import { LazyWrapper } from "../../../common/lazy-wrapper";
import { PageWrapper } from "../../../common/page-wrapper";
import { AuthedPage } from "../../../components/authed-page";
import { WithFooter } from "../../../components/with-footer";
import { useNonSetOwnerRedirect } from "../../../hooks/use-non-set-owner-redirect";
import { getLayout } from "../../../layouts/main-layout";
import { HydrateEditSetData } from "../../../modules/hydrate-edit-set-data";
import { SetEditorPure } from "../../../modules/set-editor";
import {
  SetEditorStoreContext,
  useSetEditorContext,
} from "../../../stores/use-set-editor-store";

const Edit = () => {
  useNonSetOwnerRedirect();

  return (
    <AuthedPage>
      <HeadSeo
        title="Edit Set"
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <LazyWrapper>
        <WithFooter>
          <Container maxW="7xl">
            <HydrateEditSetData>
              <EditorWrapper />
            </HydrateEditSetData>
          </Container>
        </WithFooter>
      </LazyWrapper>
    </AuthedPage>
  );
};

const EditorWrapper = () => {
  const title = useSetEditorContext((s) => s.title);

  return (
    <>
      <HeadSeo
        title={`Edit ${title}`}
        nextSeoProps={{
          noindex: true,
          nofollow: true,
        }}
      />
      <PropertiesListener />
      <SetEditorPure />
    </>
  );
};

const PropertiesListener = () => {
  const store = React.useContext(SetEditorStoreContext)!;

  const propertiesSaveHandler = React.useCallback(() => {
    store.getState().onSubscribeDelegate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    store.subscribe(
      (s) => [
        s.title,
        s.description,
        s.tags,
        s.wordLanguage,
        s.definitionLanguage,
        s.visibility,
      ],
      propertiesSaveHandler,
      {
        equalityFn: shallow,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

Edit.PageWrapper = PageWrapper;
Edit.getLayout = getLayout;

export default Edit;

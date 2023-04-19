import { Container } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import { shallow } from "zustand/shallow";
import { singleIdServerSideProps as getServerSideProps } from "../../../common/server-side-props";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { WithFooter } from "../../../components/with-footer";
import { HydrateEditSetData } from "../../../modules/hydrate-edit-set-data";
import { SetEditorPure } from "../../../modules/set-editor";
import {
  SetEditorStoreContext,
  useSetEditorContext,
} from "../../../stores/use-set-editor-store";

const Edit: ComponentWithAuth = () => {
  return (
    <HydrateEditSetData>
      <WithFooter>
        <Container maxW="7xl">
          <EditorWrapper />
        </Container>
      </WithFooter>
    </HydrateEditSetData>
  );
};

const EditorWrapper = () => {
  return (
    <>
      <HeadComponent />
      <PropertiesListener />
      <SetEditorPure />
    </>
  );
};

const HeadComponent = () => {
  const title = useSetEditorContext((s) => s.title);

  return (
    <Head>
      <title>Edit {title} | Quizlet.cc</title>
    </Head>
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
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
};

Edit.authenticationEnabled = true;

export default Edit;
export { getServerSideProps };

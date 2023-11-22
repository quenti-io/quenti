import React from "react";
import { shallow } from "zustand/shallow";

import { SetEditorStoreContext } from "../stores/use-set-editor-store";

export const EditorListener = () => {
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

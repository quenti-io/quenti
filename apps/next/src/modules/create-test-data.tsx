import React from "react";

import { TestQuestionType } from "@quenti/interfaces";

import { useAuthedSet } from "../hooks/use-set";
import {
  TestContext,
  type TestStore,
  createTestStore,
} from "../stores/use-test-store";

export const CreateTestData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms } = useAuthedSet();

  const storeRef = React.useRef<TestStore>();
  if (!storeRef.current) {
    storeRef.current = createTestStore();

    storeRef.current
      .getState()
      .initialize(
        terms,
        20,
        [
          TestQuestionType.TrueFalse,
          TestQuestionType.MultipleChoice,
          TestQuestionType.Match,
        ],
        "Definition",
      );
  }

  return (
    <TestContext.Provider value={storeRef.current}>
      {children}
    </TestContext.Provider>
  );
};

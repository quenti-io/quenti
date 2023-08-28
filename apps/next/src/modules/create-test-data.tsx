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
    storeRef.current = createTestStore(undefined, {
      onAnswerDelegate: (index) => {
        const next = document.getElementById(`test-card-${index + 1}`);
        if (!next) return;

        const position = next.getBoundingClientRect();
        window.scrollTo({
          left: position.left,
          top: position.top + window.scrollY - 48,
          behavior: "smooth",
        });
      },
    });

    // SUPER IMPORTANT: **clone the terms when initializing** so we aren't modifying the original
    // objects when we transition back to the main set page (test store uses a lot of .pop() calls on the array)
    const cloned = Array.from(terms);

    storeRef.current
      .getState()
      .initialize(
        cloned,
        Math.min(20, cloned.length),
        [
          TestQuestionType.TrueFalse,
          TestQuestionType.MultipleChoice,
          TestQuestionType.Match,
        ],
        "Word",
      );
  }

  return (
    <TestContext.Provider value={storeRef.current}>
      {children}
    </TestContext.Provider>
  );
};

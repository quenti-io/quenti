import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React from "react";

import type { TermWithDistractors } from "@quenti/interfaces";

import { useAuthedSet } from "../hooks/use-set";
import {
  DEFAULT_PROPS,
  TestContext,
  type TestStore,
  createTestStore,
} from "../stores/use-test-store";
import { getQueryParams } from "./test/utils/url-params";

export const CreateTestData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id, terms } = useAuthedSet();

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

    const { settings, valid } = searchParams.get("count")
      ? getQueryParams()
      : { settings: DEFAULT_PROPS.settings, valid: true };

    // SUPER IMPORTANT: **clone the terms when initializing** so we aren't modifying the original
    // objects when we transition back to the main set page (test store uses a lot of .pop() calls on the array)
    const cloned = Array.from(terms);

    if (!valid) {
      void router.replace({
        pathname: `/${id}/test`,
        query: null,
      });
    }

    storeRef.current
      .getState()
      .initialize(
        cloned as TermWithDistractors[],
        Math.min(settings.questionCount, cloned.length),
        settings.questionTypes,
        settings.answerMode,
      );
  }

  return (
    <TestContext.Provider value={storeRef.current}>
      {children}
    </TestContext.Provider>
  );
};

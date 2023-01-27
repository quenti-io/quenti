import React from "react";
import { useSet } from "../hooks/use-set";
import {
  createLearnStore,
  LearnContext,
  LearnStore,
} from "../stores/use-learn-store";

export const CreateLearnData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, termOrder } = useSet();

  const storeRef = React.useRef<LearnStore>();
  if (!storeRef.current) {
    storeRef.current = createLearnStore();
    storeRef.current
      .getState()
      .loadTerms(
        terms.sort((a, b) => termOrder.indexOf(a.id) - termOrder.indexOf(b.id))
      );
  }

  return (
    <LearnContext.Provider value={storeRef.current}>
      {children}
    </LearnContext.Provider>
  );
};

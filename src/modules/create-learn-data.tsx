import React from "react";
import { useSet } from "../hooks/use-set";
import {
  createLearnStore,
  LearnContext,
  LearnStore,
} from "../stores/use-learn-store";
import { chunkArray, takeNRandom } from "../utils/array";

export const CreateLearnData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const { terms, termOrder } = useSet();

  const storeRef = React.useRef<LearnStore>();
  if (!storeRef.current) {
    storeRef.current = createLearnStore({
      chunks: chunkArray(terms, 7),
      activeTerm: terms[0],
      activeQuestionType: "choice",
      choices: takeNRandom(terms, 4),
    });
  }

  return (
    <LearnContext.Provider value={storeRef.current}>
      {children}
    </LearnContext.Provider>
  );
};

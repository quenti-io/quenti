import React from "react";
import { FlashcardWrapper } from "../../components/flashcard-wrapper";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useExperienceContext } from "../../stores/use-experience-store";
import { shuffleArray } from "../../utils/array";

export const FlashcardArea = () => {
  const { terms } = useSetFolderUnison();
  if (!terms) throw new Error("Terms data is missing in unison!");

  const _termOrder = terms.sort((a, b) => a.rank - b.rank).map((t) => t.id);

  const shuffle = useExperienceContext((s) => s.shuffleFlashcards);
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder
  );

  React.useEffect(() => {
    setTermOrder(shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder);
    // eslint-disable-next-line react-hooks/exhaustive-depsj
  }, [shuffle]);

  return (
    <FlashcardWrapper
      h="calc(100vh - 240px)"
      terms={terms}
      termOrder={termOrder}
    />
  );
};

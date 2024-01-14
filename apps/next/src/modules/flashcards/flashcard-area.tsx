import React from "react";

import { shuffleArray } from "@quenti/lib/array";

import { RootFlashcardWrapper } from "../../components/root-flashcard-wrapper";
import { useSetFolderUnison } from "../../hooks/use-set-folder-unison";
import { useContainerContext } from "../../stores/use-container-store";

export const FlashcardArea = () => {
  const { terms } = useSetFolderUnison();
  if (!terms) throw new Error("Terms data is missing in unison!");

  const _termOrder = terms.sort((a, b) => a.rank - b.rank).map((t) => t.id);

  const shuffle = useContainerContext((s) => s.shuffleFlashcards);
  const [termOrder, setTermOrder] = React.useState<string[]>(
    shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder,
  );

  React.useEffect(() => {
    setTermOrder(shuffle ? shuffleArray(Array.from(_termOrder)) : _termOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shuffle, JSON.stringify(_termOrder)]);

  return (
    <RootFlashcardWrapper
      h="max(calc(100vh - 240px), 560px)"
      terms={terms}
      termOrder={termOrder}
    />
  );
};

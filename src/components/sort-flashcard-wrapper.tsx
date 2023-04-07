import { motion, useAnimationControls } from "framer-motion";
import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { useExperienceContext } from "../stores/use-experience-store";
import { useSetPropertiesStore } from "../stores/use-set-properties-store";
import { useSortFlashcardsContext } from "../stores/use-sort-flashcards-store";
import { api } from "../utils/api";
import { Flashcard } from "./flashcard";
import { FlashcardShorcutLayer } from "./flashcard-shortcut-layer";
import { RootFlashcardContext } from "./root-flashcard-wrapper";
import { SortFlashcardProgress } from "./sort-flashcard-progress";

export const SortFlashcardWrapper = () => {
  const { id, experience, type } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const { h, editTerm, starTerm } = React.useContext(RootFlashcardContext);
  const controls = useAnimationControls();

  const [isFlipped, setIsFlipped] = React.useState(false);
  const flippedRef = React.useRef(isFlipped);
  flippedRef.current = isFlipped;

  const starredTerms = useExperienceContext((s) => s.starredTerms);

  const termsThisRound = useSortFlashcardsContext((s) => s.termsThisRound);
  const index = useSortFlashcardsContext((s) => s.index);
  const currentRound = useSortFlashcardsContext((s) => s.currentRound);
  const progressView = useSortFlashcardsContext((s) => s.progressView);
  const stateMarkStillLearning = useSortFlashcardsContext(
    (s) => s.markStillLearning
  );
  const stateMarkKnown = useSortFlashcardsContext((s) => s.markKnown);
  const stateNextRound = useSortFlashcardsContext((s) => s.nextRound);

  const term = termsThisRound[index];
  const starred = term ? starredTerms.includes(term.id) : false;

  const genericExperienceKey =
    type == "folder" ? "folderExperienceId" : "experienceId";
  const put = api.studiableTerms.put.useMutation();

  const setDirtyProps = {
    onSuccess: () => {
      setIsDirty(true);
    },
  };

  const apiCompleteCardsRound =
    type == "set"
      ? api.experience.completeCardsRound.useMutation()
      : api.folders.completeCardsRound.useMutation();
  const apiResetCardsProgress =
    type == "set"
      ? api.experience.resetCardsProgress.useMutation(setDirtyProps)
      : api.folders.resetCardsProgress.useMutation(setDirtyProps);

  const flipCard = async () => {
    await controls.start({
      rotateX: 90,
      transition: {
        duration: 0.15,
      },
    });

    controls.set({
      rotateX: -90,
    });
    setIsFlipped((f) => !f);

    await controls.start({
      rotateX: 0,
      transition: {
        duration: 0.15,
      },
    });
  };

  const markStillLearning = () => {
    stateMarkStillLearning(term!.id);

    void (async () => {
      await put.mutateAsync({
        id: term!.id,
        [genericExperienceKey]: experience.id,
        mode: "Flashcards",
        correctness: -1,
        appearedInRound: currentRound,
        incorrectCount: term!.incorrectCount + 1,
      });
    })();
  };

  const markKnown = () => {
    stateMarkKnown(term!.id);

    void (async () => {
      await put.mutateAsync({
        id: term!.id,
        [genericExperienceKey]: experience.id,
        mode: "Flashcards",
        correctness: 1,
        appearedInRound: currentRound,
        incorrectCount: term?.incorrectCount || 0,
      });
    })();
  };

  const onNextRound = () => {
    stateNextRound();

    void (async () => {
      await apiCompleteCardsRound.mutateAsync({
        genericId: id,
      });
    })();
  };

  const onResetProgress = () => {
    void (async () => {
      await apiResetCardsProgress.mutateAsync({
        genericId: id,
      });
    })();
  };

  if (progressView)
    return (
      <SortFlashcardProgress
        h={h}
        onNextRound={onNextRound}
        onResetProgress={onResetProgress}
      />
    );

  return (
    <motion.div
      animate={controls}
      style={{
        width: "100%",
        transformPerspective: 1500,
        zIndex: 100,
      }}
      onClick={flipCard}
    >
      <FlashcardShorcutLayer
        triggerFlip={flipCard}
        triggerPrev={() => undefined}
        triggerNext={() => undefined}
      />
      {term && (
        <Flashcard
          h={h}
          term={term}
          index={index}
          isFlipped={isFlipped}
          numTerms={termsThisRound.length}
          onLeftAction={markStillLearning}
          onRightAction={markKnown}
          starred={starred}
          onRequestEdit={() => editTerm(term, isFlipped)}
          onRequestStar={() => starTerm(term)}
          variant="sortable"
        />
      )}
    </motion.div>
  );
};

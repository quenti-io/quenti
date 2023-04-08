import { Box } from "@chakra-ui/react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import type { StudiableTerm } from "../interfaces/studiable-term";
import { useExperienceContext } from "../stores/use-experience-store";
import { useSetPropertiesStore } from "../stores/use-set-properties-store";
import { useSortFlashcardsContext } from "../stores/use-sort-flashcards-store";
import { api } from "../utils/api";
import { Flashcard } from "./flashcard";
import { RootFlashcardContext } from "./root-flashcard-wrapper";
import { SortFlashcardProgress } from "./sort-flashcard-progress";
import { SortableShortcutLayer } from "./sortable-shortcut-layer";

export const SortFlashcardWrapper = () => {
  const { id, experience, type } = useSetFolderUnison();
  const setIsDirty = useSetPropertiesStore((s) => s.setIsDirty);
  const { h, editTerm, starTerm } = React.useContext(RootFlashcardContext);
  const controls = useAnimationControls();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const cardsAnswerWith = useExperienceContext((s) => s.cardsAnswerWith);
  const shouldFlip = cardsAnswerWith == "Definition";

  const termsThisRound = useSortFlashcardsContext((s) => s.termsThisRound);
  const index = useSortFlashcardsContext((s) => s.index);
  const currentRound = useSortFlashcardsContext((s) => s.currentRound);
  const progressView = useSortFlashcardsContext((s) => s.progressView);
  const stateMarkStillLearning = useSortFlashcardsContext(
    (s) => s.markStillLearning
  );
  const stateMarkKnown = useSortFlashcardsContext((s) => s.markKnown);
  const stateNextRound = useSortFlashcardsContext((s) => s.nextRound);
  const stateGoBack = useSortFlashcardsContext((s) => s.goBack);

  const term = !progressView ? termsThisRound[index] : undefined;

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

  type Flashcard = StudiableTerm & { isFlipped: boolean };
  const [visibleFlashcards, setVisibleFlashcards] = React.useState<Flashcard[]>(
    !progressView ? [{ ...term!, isFlipped: shouldFlip }] : []
  );

  const [hasUserEngaged, setHasUserEngaged] = React.useState(false);
  const [state, setState] = React.useState<"stillLearning" | "known">();

  const allowAnimation = () => {
    setHasUserEngaged(true);
    requestAnimationFrame(() => {
      setHasUserEngaged(false);
    });
  };

  const flipCard = async (id: string) => {
    if (!visibleFlashcards.find((f) => f.id == id)) return;

    await controls.start({
      rotateX: 90,
      transition: {
        duration: 0.15,
      },
    });

    controls.set({
      rotateX: -90,
    });
    visibleFlashcards[0]!.isFlipped = !visibleFlashcards[0]!.isFlipped;
    setVisibleFlashcards(Array.from(visibleFlashcards));

    await controls.start({
      rotateX: 0,
      transition: {
        duration: 0.15,
      },
    });
  };

  const markStillLearning = () => {
    allowAnimation();
    setState("stillLearning");
    controls.set({ zIndex: 105 });
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
    allowAnimation();
    setState("known");
    controls.set({ zIndex: 105 });
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

  const goBack = () => {
    const newIndex = index - 1;
    const studiableTerm = termsThisRound[newIndex];
    if (!studiableTerm) return;
    setState(studiableTerm.correctness == 1 ? "known" : "stillLearning");

    allowAnimation();
    stateGoBack();
  };

  React.useEffect(() => {
    if (!progressView)
      setVisibleFlashcards([{ ...term!, isFlipped: shouldFlip }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  React.useEffect(() => {
    if (progressView) {
      setHasUserEngaged(false);
      setVisibleFlashcards([]);
    }
  }, [progressView]);

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

  return (
    <>
      <Box width="100%" height={h} position="relative">
        {progressView ? (
          <SortFlashcardProgress
            h={h}
            onNextRound={onNextRound}
            onResetProgress={onResetProgress}
          />
        ) : (
          <SortableShortcutLayer
            triggerFlip={async () => {
              if (visibleFlashcards.length)
                await flipCard(visibleFlashcards[0]!.id);
            }}
            triggerStillLearning={markStillLearning}
            triggerKnow={markKnown}
          />
        )}
        <AnimatePresence>
          {visibleFlashcards.map((t, i) => (
            <motion.div
              id="sortable-flashcard"
              key={`flashcard-${t.id}-${i}`}
              animate={controls}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transformPerspective: 1500,
                zIndex: 100,
                borderRadius: "12px",
                outlineWidth: "3px",
                outlineStyle: "solid",
                outlineColor:
                  state == "known"
                    ? "rgba(104, 211, 145, 0)"
                    : "rgba(252, 129, 129, 0)",
                transformOrigin: "center",
                scale: 1,
              }}
              onClick={() => flipCard(t.id)}
              exit={
                hasUserEngaged
                  ? {
                      pointerEvents: "none",
                      outlineColor:
                        state == "known"
                          ? [null, "rgba(104, 211, 145, 1)"]
                          : [null, "rgba(252, 129, 129, 1)"],
                      opacity: [1, 1, 0],
                      scale: [1, 1.05, 0.8],
                      rotateZ: [0, state == "known" ? -5 : 5, 0],
                      translateX:
                        state == "known" ? [0, -50, 200] : [0, 50, -200],
                      transition: {
                        ease: "easeIn",
                        times: [0, 0.3, 1],
                      },
                    }
                  : undefined
              }
            >
              <Flashcard
                h={h}
                term={t}
                index={termsThisRound.findIndex((x) => x.id == t.id)}
                isFlipped={t.isFlipped}
                numTerms={termsThisRound.length}
                onLeftAction={markStillLearning}
                onRightAction={markKnown}
                onBackAction={goBack}
                starred={starredTerms.includes(t.id)}
                onRequestEdit={() => editTerm(t, t.isFlipped)}
                onRequestStar={() => starTerm(t)}
                variant="sortable"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>
    </>
  );
};

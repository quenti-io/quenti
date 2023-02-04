import { Box } from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import { motion, useAnimationControls } from "framer-motion";
import React from "react";
import { useSetFolderUnison } from "../hooks/use-set-folder-unison";
import { useExperienceContext } from "../stores/use-experience-store";
import { api } from "../utils/api";
import { EditTermModal } from "./edit-term-modal";
import { Flashcard } from "./flashcard";
import { FlashcardShorcutLayer } from "./flashcard-shortcut-layer";

export interface FlashcardWrapperProps {
  terms: Term[];
  termOrder: string[];
  h?: string;
}

export const FlashcardWrapper: React.FC<FlashcardWrapperProps> = ({
  terms,
  termOrder,
  h = "500px",
}) => {
  const controls = useAnimationControls();

  const sortedTerms = termOrder.map((id) => terms.find((t) => t.id === id));

  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [editTerm, setEditTerm] = React.useState<Term | null>(null);

  const [index, setIndex] = React.useState(0);
  const indexRef = React.useRef(index);
  indexRef.current = index;

  const [isFlipped, setIsFlipped] = React.useState(false);
  const flippedRef = React.useRef(isFlipped);
  flippedRef.current = isFlipped;

  const setStarMutation = api.experience.starTerm.useMutation();
  const folderStarMutation = api.folders.starTerm.useMutation();
  const unstarMutation = api.experience.unstarTerm.useMutation();

  const { type, experience } = useSetFolderUnison();
  const autoplayFlashcards = useExperienceContext((s) => s.autoplayFlashcards);
  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starTerm = useExperienceContext((s) => s.starTerm);
  const unstarTerm = useExperienceContext((s) => s.unstarTerm);

  const term = sortedTerms[index];
  const starred = term ? starredTerms.includes(term.id) : false;

  const onPrev = async () => {
    if (index === 0) return;

    setIndex((i) => (i - 1 + terms.length) % terms.length);
    await animateTransition(false);
  };

  const onNext = async () => {
    if (index === terms.length - 1) return;

    setIndex((i) => (i + 1) % terms.length);
    await animateTransition();
  };

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

  React.useEffect(() => {
    if (!autoplayFlashcards) return;

    const interval = setInterval(() => {
      void (async () => {
        if (flippedRef.current) {
          setIsFlipped(false);

          if (indexRef.current === terms.length - 1) {
            setIndex(0);
            await animateTransition();
          } else {
            await onNext();
          }
        } else {
          await flipCard();
        }
      })();
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoplayFlashcards]);

  const animateTransition = async (next = true) => {
    controls.set({ rotateY: next ? 20 : -20, translateX: next ? -50 : 50 });
    await controls.start({
      rotateY: 0,
      translateX: 0,
      transition: {
        ease: "easeOut",
      },
    });
  };

  // TODO: fix shifting of card when previous is clicked
  return (
    <Box w="full" h={h} zIndex="100">
      <EditTermModal
        term={editTerm}
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
        }}
        onDefinition={isFlipped}
      />
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
          triggerPrev={onPrev}
          triggerNext={onNext}
        />
        {term && (
          <Flashcard
            h={h}
            term={term}
            index={index}
            isFlipped={isFlipped}
            numTerms={terms.length}
            onPrev={onPrev}
            onNext={onNext}
            starred={starred}
            onRequestEdit={() => {
              setEditTerm(term);
              setEditModalOpen(true);
            }}
            onRequestStar={() => {
              if (!starred) {
                if (type === "set") {
                  setStarMutation.mutate({
                    termId: term.id,
                    experienceId: experience.id,
                  });
                } else {
                  folderStarMutation.mutate({
                    termId: term.id,
                    studySetId: term.studySetId,
                  });
                }

                starTerm(sortedTerms[index]!.id);
              } else {
                unstarMutation.mutate({
                  termId: term.id,
                });
                unstarTerm(sortedTerms[index]!.id);
              }
            }}
          />
        )}
      </motion.div>
    </Box>
  );
};

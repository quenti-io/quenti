import React from "react";
import type { Term } from "@prisma/client";
import { motion, useAnimationControls } from "framer-motion";
import { Flashcard } from "./flashcard";
import { FlashcardShorcutLayer } from "./flashcard-shortcut-layer";
import { Box } from "@chakra-ui/react";
import { EditTermModal } from "./edit-term-modal";
import { api } from "../utils/api";
import { useExperienceContext } from "../stores/use-experience-store";

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
  const [isFlipped, setIsFlipped] = React.useState(false);

  const starMutation = api.experience.starTerm.useMutation();
  const unstarMutation = api.experience.unstarTerm.useMutation();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starTerm = useExperienceContext((s) => s.starTerm);
  const unstarTerm = useExperienceContext((s) => s.unstarTerm);

  const term = sortedTerms[index]!;
  const starred = starredTerms.includes(term.id);

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
              starMutation.mutate({
                termId: term.id,
                studySetId: term.studySetId,
              });
              starTerm(sortedTerms[index]!.id);
            } else {
              unstarMutation.mutate({
                termId: term.id,
                studySetId: term.studySetId,
              });
              unstarTerm(sortedTerms[index]!.id);
            }
          }}
        />
      </motion.div>
    </Box>
  );
};

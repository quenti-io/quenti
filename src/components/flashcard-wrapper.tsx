import React from "react";
import { Term } from "@prisma/client";
import { motion, MotionConfig, useAnimationControls } from "framer-motion";
import { Flashcard } from "./flashcard";
import { FlashcardShorcutLayer } from "./flashcard-shortcut-layer";
import { Box } from "@chakra-ui/react";

export interface FlashcardWrapperProps {
  terms: Term[];
  termOrder: string[];
}

export const FlashcardWrapper: React.FC<FlashcardWrapperProps> = ({
  terms,
  termOrder,
}) => {
  const controls = useAnimationControls();

  const sortedTerms = termOrder.map((id) => terms.find((t) => t.id === id)!);

  const [index, setIndex] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const onPrev = () => {
    if (index === 0) return;

    animateTransition(false);
    setIndex((i) => (i - 1 + terms.length) % terms.length);
    setIsFlipped(false);
  };

  const onNext = () => {
    if (index === terms.length - 1) return;

    animateTransition();
    setIndex((i) => (i + 1) % terms.length);
    setIsFlipped(false);
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

  const animateTransition = (next = true) => {
    controls.set({ rotateY: next ? 20 : -20, translateX: next ? -50 : 50 });
    controls.start({
      rotateY: 0,
      translateX: 0,
      transition: {
        ease: "easeOut",
      },
    });
  };

  // TODO: fix shifting of card when previous is clicked
  return (
    <Box w="full" h="500px">
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
          term={sortedTerms[index]!}
          index={index}
          isFlipped={isFlipped}
          numTerms={terms.length}
          onPrev={onPrev}
          onNext={onNext}
        />
      </motion.div>
    </Box>
  );
};

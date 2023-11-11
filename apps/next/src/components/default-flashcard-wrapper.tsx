import { motion, useAnimationControls } from "framer-motion";
import React from "react";

import { useContainerContext } from "../stores/use-container-store";
import { Flashcard } from "./flashcard";
import { FlashcardShorcutLayer } from "./flashcard-shortcut-layer";
import { RootFlashcardContext } from "./root-flashcard-wrapper";

export const DefaultFlashcardWrapper = () => {
  const { terms, termOrder, h, editTerm, starTerm } =
    React.useContext(RootFlashcardContext);

  const controls = useAnimationControls();

  const cardsAnswerWith = useContainerContext((s) => s.cardsAnswerWith);
  const autoplayFlashcards = useContainerContext((s) => s.autoplayFlashcards);
  const cardsStudyStarred = useContainerContext((s) => s.cardsStudyStarred);
  const shouldFlip = cardsAnswerWith == "Word";

  const starredTerms = useContainerContext((s) => s.starredTerms);

  let sortedTerms = termOrder.map((id) => terms.find((t) => t.id === id));
  sortedTerms = cardsStudyStarred
    ? sortedTerms.filter((t) => t && starredTerms.includes(t.id))
    : sortedTerms;

  const [index, setIndex] = React.useState(0);
  const indexRef = React.useRef(index);
  indexRef.current = index;

  const [isFlipped, setIsFlipped] = React.useState(shouldFlip);
  const flippedRef = React.useRef(isFlipped);
  flippedRef.current = isFlipped;

  const term = sortedTerms[index];
  const starred = term ? starredTerms.includes(term.id) : false;

  const onPrev = async () => {
    if (index === 0) return;

    setIsFlipped(shouldFlip);
    setIndex((i) => (i - 1 + sortedTerms.length) % sortedTerms.length);
    await animateTransition(false);
  };

  const onNext = async () => {
    if (index === sortedTerms.length - 1) return;

    setIsFlipped(shouldFlip);
    setIndex((i) => (i + 1) % sortedTerms.length);
    await animateTransition();
  };

  const flipCard = async () => {
    await controls.start({
      rotateX: 90,
      transition: {
        duration: 0.125,
      },
    });

    controls.set({
      rotateX: -90,
    });
    setIsFlipped((f) => !f);

    await controls.start({
      rotateX: 0,
      transition: {
        duration: 0.125,
      },
    });
  };

  React.useEffect(() => {
    if (!autoplayFlashcards) return;

    const interval = setInterval(() => {
      void (async () => {
        if (flippedRef.current !== shouldFlip) {
          setIsFlipped(shouldFlip);

          if (indexRef.current === sortedTerms.length - 1) {
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
        triggerPrev={onPrev}
        triggerNext={onNext}
      />
      {term && (
        <Flashcard
          h={h}
          term={term}
          index={index}
          isFlipped={isFlipped}
          numTerms={sortedTerms.length}
          onLeftAction={onPrev}
          onRightAction={onNext}
          starred={starred}
          onRequestEdit={() => editTerm(term, isFlipped)}
          onRequestStar={() => starTerm(term)}
        />
      )}
    </motion.div>
  );
};

import { Box } from "@chakra-ui/react";
import React from "react";
import { create } from "zustand";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { MatchCard } from "../../../components/match-card";
import { CreateMatchData } from "../../../modules/create-match-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { MatchEndModal } from "../../../modules/match/match-end-modal";
import MatchInfo from "../../../modules/match/match-info";
import { useMatchContext } from "../../../stores/use-match-store";
import { areRectanglesOverlapping } from "../../../utils/match";

const Match: ComponentWithAuth = () => {
  return (
    <HydrateSetData>
      <CreateMatchData>
        <MatchContainer />
      </CreateMatchData>
    </HydrateSetData>
  );
};

interface MatchItem {
  id: string;
  completed: boolean;
  width: number;
  height: number;
  type: "word" | "definition";
  word: string;
  y: number;
  x: number;
  color?: "green.400" | "red.400";
}

export interface MatchStore {
  terms: MatchItem[];
  setCard: (index: number, newTerm: MatchItem) => void;
  getIndicesUnder: (index: number) => number[];
  validateUnderIndices: (index: number) => void;
}

const MatchContainer = () => {
  const terms = useMatchContext((state) => state.roundQuestions);
  const answerCorrectly = useMatchContext((s) => s.answerCorrectly);
  const answerIncorrectly = useMatchContext((s) => s.answerIncorrectly);
  const completed = useMatchContext((s) => s.completed);

  const cur = React.useRef<HTMLDivElement>(null);

  const store = create<MatchStore>((set, get) => {
    const ter: MatchItem[] = terms.flatMap((term) => {
      const base = {
        id: term.id,
        completed: false,
        width: 200,
        height: 60,
        x: 0,
        y: 0,
      };
      return [
        {
          ...base,
          type: "word",
          word: term.word,
        },
        {
          ...base,
          type: "definition",
          word: term.definition,
        },
      ];
    });

    return {
      terms: ter,
      setCard(index: number, newTerm: MatchItem) {
        set((state) => {
          const terms = [...state.terms];
          terms[index] = newTerm;
          return { terms };
        });
      },
      // This is it's own thing because eventually there might be indication of the drop target
      getIndicesUnder(index: number) {
        const cur = get().terms[index]!;
        return get().terms.flatMap((term, i) => {
          if (i == index) return [];
          if (areRectanglesOverlapping(cur, term)) {
            return [i];
          }
          return [];
        });
      },
      validateUnderIndices(index: number) {
        const target = get().terms[index]!.id;
        const targetType =
          get().terms[index]!.type == "word" ? "definition" : "word";

        const indexes = get().getIndicesUnder(index);
        let correctIndex: number | undefined;
        const incorrects: number[] = [];
        indexes.forEach((index) => {
          if (
            get().terms[index]!.id == target &&
            get().terms[index]!.type == targetType
          )
            correctIndex = index;
          else incorrects.push(index);
        });

        if (correctIndex) {
          get().setCard(index, {
            ...get().terms[index]!,
            color: "green.400",
          });
          get().setCard(correctIndex, {
            ...get().terms[correctIndex]!,
            color: "green.400",
          });
          answerCorrectly(get().terms[index]!.id);
        } else if (incorrects.length > 0) {
          incorrects.push(index);
          incorrects.forEach((idx) => {
            get().setCard(idx, {
              ...get().terms[idx]!,
              color: "red.400",
              x: Math.random() * (cur.current!.clientWidth - 450) + 225,
              y: Math.random() * (cur.current!.clientHeight - 200) + 100,
            });
          });
          answerIncorrectly(get().terms[index]!.id);
        }

        indexes.push(index);
        setTimeout(() => {
          indexes.forEach((index) => {
            const cur = get().terms[index]!;
            get().setCard(index, {
              ...cur,
              completed: cur.color == "green.400" ? true : cur.completed,
              color: undefined,
            });
          });
        }, 500);
      },
    };
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const setCard = store((e) => e.setCard);

  React.useEffect(() => {
    store.getState().terms.forEach((term, index) => {
      setCard(index, {
        ...term,
        x: Math.random() * (cur.current!.clientWidth - 450) + 225,
        y: Math.random() * (cur.current!.clientHeight - 200) + 100,
      });
    });
  }, [cur, store, setCard]);

  return (
    <Box ref={cur} w="100%" h="calc(100vh - 112px)" position="relative">
      <MatchEndModal isOpen={completed} />
      {Array.from({ length: store.getState().terms.length }, (_, index) => (
        <MatchCard index={index} subscribe={store} key={index} />
      ))}
      <MatchInfo />
    </Box>
  );
};

Match.authenticationEnabled = true;

export default Match;

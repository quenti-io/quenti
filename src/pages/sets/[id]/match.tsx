import { Box } from "@chakra-ui/react";
import React from "react";
import { create, createStore } from "zustand";
import type { ComponentWithAuth } from "../../../components/auth-component";
import { MatchCard } from "../../../components/match-card";
import { CreateMatchData } from "../../../modules/create-match-data";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { useMatchContext } from "../../../stores/use-match-store";

const Match: ComponentWithAuth = () => {

    return (
        <HydrateSetData>
            <CreateMatchData>
                <MatchContainer />
            </CreateMatchData>
        </HydrateSetData>
    )
}

interface MatchItem {
    id: string;
    completed: boolean;
    width: number;
    height: number;
    type: "word" | "definition";
    word: string
    y: number,
    x: number
}

export interface MatchStore {
    terms: MatchItem[],
    setCard(index: number, newt: MatchItem): void
}

const MatchContainer = () => {
    const terms = useMatchContext((state) => state.roundQuestions);

    let r = create<MatchStore>((set) => {
        let ter: MatchItem[] = terms.flatMap(term => {
            let base = { id: term.id, completed: false, width: 200, height: 0 }
            return [
                {
                    ...base,
                    type: "word",
                    word: term.word,
                    x: Math.random() * 1000,
                    y: Math.random() * 500
                },
                {
                    ...base,
                    type: "definition",
                    word: term.definition,
                    x: Math.random() * 1000,
                    y: Math.random() * 500
                }
            ]
        })

        return {
            terms: ter,
            setCard(index: number, newt: MatchItem) {
                set((state) => {
                    return {
                        terms: [...state.terms.slice(0, index), newt, ...state.terms.slice(index + 1)]
                    }
                })
            },
        }
    })

    return (<Box w="100%" h="calc(100vh - 112px)">
        {Array.from({length: r.getState().terms.length}, (_, index) =>
            <MatchCard index={index} subscribe={r} />)
        }
    </Box>)
}

Match.authenticationEnabled = true

export default Match

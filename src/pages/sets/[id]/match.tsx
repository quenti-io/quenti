import { Box } from "@chakra-ui/react";
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

const MatchContainer = () => {
    const terms = useMatchContext((state) => state.roundQuestions);

    let processedTerms = terms.flatMap(term => {
        let base = { id: term.id, completed: false }
        return [
            { ...base, word: term.word, x: Math.random() * 1000, y: Math.random() * 1000 },
            { ...base, word: term.definition, x: Math.random() * 1000, y: Math.random() * 1000 }
        ]
    })

    return (<Box w="100%" h="100%">
        {processedTerms
            .map(card => <MatchCard x={card.x} y={card.y} title={card.word} zIndex={0} />)}
    </Box>)
}

Match.authenticationEnabled = true

export default Match

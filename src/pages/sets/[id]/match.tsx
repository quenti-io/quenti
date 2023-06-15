import type { ComponentWithAuth } from "../../../components/auth-component";
import { useSet } from "../../../hooks/use-set";
import { HydrateSetData } from "../../../modules/hydrate-set-data";

const Match: ComponentWithAuth = () => {

    return (
        <HydrateSetData>
            <MatchContainer/>
        </HydrateSetData>
    )
}

const MatchContainer = () => {
    const { terms } = useSet();

    return <p>{JSON.stringify(terms)}</p>
}

Match.authenticationEnabled = true

export default Match

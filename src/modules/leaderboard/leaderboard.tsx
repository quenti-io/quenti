import { Stack } from "@chakra-ui/react";
import { GenericUserCard } from "./leaderboard-user-card";

export default function Leaderboard() {

    return <Stack>
        {["a", "b", "c", "d", "e"].map((l, n) => <GenericUserCard variantBg={true} n={n + 1} />)}
    </Stack>
}

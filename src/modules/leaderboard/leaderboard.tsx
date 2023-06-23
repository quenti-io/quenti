import { Stack } from "@chakra-ui/react";
import { GenericUserCard } from "./leaderboard-user-card";

export default function Leaderboard() {
  return (
    <Stack maxH={"375px"} overflow="scroll">
      {["a", "b", "c", "d", "e", "f"].map((l, n) => (
        <GenericUserCard variantBg={true} n={n + 1} key={n} />
      ))}
    </Stack>
  );
}

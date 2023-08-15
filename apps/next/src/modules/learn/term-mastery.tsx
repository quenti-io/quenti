import { Grid } from "@chakra-ui/react";

import { GridStat } from "../../components/grid-stat";
import { useTermMastery } from "../../hooks/use-term-mastery";

export const TermMastery = () => {
  const [unstudied, familiar, mastered] = useTermMastery();

  return (
    <Grid gridTemplateColumns="1fr 1fr 1fr" gap={4} w="full">
      <GridStat label="Unstudied" value={unstudied?.length || 0} />
      <GridStat label="Familiar" value={familiar?.length || 0} />
      <GridStat label="Mastered" value={mastered?.length || 0} />
    </Grid>
  );
};

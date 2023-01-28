import { Stack } from "@chakra-ui/react";
import { useSet } from "../../hooks/use-set";
import { DisplayableTerm } from "./displayable-term";

export const TermsOverview = () => {
  const data = useSet();

  return (
    <Stack spacing={4}>
      {data.terms
        .sort(
          (a, b) => data.termOrder.indexOf(a.id) - data.termOrder.indexOf(b.id)
        )
        .map((term) => (
          <DisplayableTerm term={term} key={term.id} />
        ))}
    </Stack>
  );
};

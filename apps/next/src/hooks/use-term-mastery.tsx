import { useLearnContext } from "../stores/use-learn-store";

export const useTermMastery = () => {
  const terms = useLearnContext((s) => s.studiableTerms);
  const unstudied = terms.filter((t) => t.correctness === 0);
  const familiar = terms.filter(
    (t) => t.correctness == 1 || t.correctness == -1,
  );
  const mastered = terms.filter((t) => t.correctness === 2);

  return [unstudied, familiar, mastered];
};

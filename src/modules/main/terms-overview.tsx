import {
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import type { Term } from "@prisma/client";
import React from "react";
import { useSet } from "../../hooks/use-set";
import { useExperienceContext } from "../../stores/use-experience-store";
import { DisplayableTerm } from "./displayable-term";
import { TermsSortSelect } from "./terms-sort-select";

export const TermsOverview = () => {
  const { terms, experience } = useSet();

  const studiable = !!experience.studiableTerms.length;
  const [sortType, setSortType] = React.useState(
    studiable ? "stats" : "original"
  );

  const termsListComponent = () => {
    switch (sortType) {
      case "stats":
        return <TermsByStats />;
      case "original":
        return <TermsByOriginal />;
      case "starred":
        return <TermsByStarred />;
      case "alphabetical":
        return <TermsByAlphabetical />;
    }
  };

  return (
    <Stack spacing={8}>
      <Flex justifyContent="space-between">
        <Heading size="lg">Terms in this set ({terms.length})</Heading>
        <TermsSortSelect
          studiable={!!experience.studiableTerms.length}
          onChange={setSortType}
        />
      </Flex>
      {termsListComponent()}
    </Stack>
  );
};

const TermsByStats = () => {
  const { terms, experience } = useSet();

  const familiarTerms = experience.studiableTerms
    .filter((x) => x.correctness != 0 && x.correctness != 2)
    .map((x) => terms.find((t) => t.id === x.id)!);

  const unstudiedTerms = terms.filter((x) => {
    const studiableTerm = experience.studiableTerms.find((s) => s.id === x.id);
    return !studiableTerm || studiableTerm.correctness === 0;
  });

  const masteredTerms = experience.studiableTerms
    .filter((x) => x.correctness === 2)
    .map((x) => terms.find((t) => t.id === x.id)!);

  return (
    <>
      {!!familiarTerms.length && (
        <TermsCategory
          heading="Still studying"
          subheading="You've started learning these terms. Keep it up!"
          terms={familiarTerms}
          color="orange"
        />
      )}
      {!!unstudiedTerms.length && (
        <TermsCategory
          heading="Not studied"
          subheading="You haven't studied these terms yet."
          terms={unstudiedTerms}
          color="gray"
        />
      )}
      {!!masteredTerms.length && (
        <TermsCategory
          heading="Mastered"
          subheading="You've mastered these terms. Great job!"
          terms={masteredTerms}
          color="blue"
        />
      )}
    </>
  );
};

const TermsByOriginal = () => {
  const { terms } = useSet();
  return <TermsList terms={terms} />;
};

const TermsByStarred = () => {
  const { terms } = useSet();
  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const filteredTerms = terms.filter((x) => starredTerms.includes(x.id));
  return <TermsList terms={filteredTerms} />;
};

const TermsByAlphabetical = () => {
  const { terms } = useSet();
  const sortOrder = terms
    .sort((a, b) => a.word.localeCompare(b.word))
    .map((x) => x.id);
  return <TermsList terms={terms} sortOrder={sortOrder} />;
};

interface TermsCategoryProps {
  heading: string;
  subheading: string;
  terms: Term[];
  color: string;
}

const TermsCategory: React.FC<TermsCategoryProps> = ({
  heading,
  subheading,
  terms,
  color,
}) => {
  const headingColor = useColorModeValue(`${color}.500`, `${color}.300`);

  return (
    <Stack spacing={6}>
      <Stack spacing={2}>
        <Heading color={headingColor} size="md">
          {heading} ({terms.length})
        </Heading>
        <Text fontSize="sm">{subheading}</Text>
      </Stack>
      <TermsList terms={terms} />
    </Stack>
  );
};

interface TermsListProps {
  terms: Term[];
  sortOrder?: string[];
}

const TermsList: React.FC<TermsListProps> = ({ terms, sortOrder }) => {
  const { termOrder } = useSet();
  const internalSort = sortOrder || termOrder;

  return (
    <Stack spacing={4}>
      {terms
        .sort((a, b) => internalSort.indexOf(a.id) - internalSort.indexOf(b.id))
        .map((term) => (
          <DisplayableTerm term={term} key={term.id} />
        ))}
    </Stack>
  );
};

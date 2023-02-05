import {
  Button,
  ButtonGroup,
  Flex,
  Heading,
  HStack,
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

interface TermsOverviewContextProps {
  starredOnly: boolean;
}

const TermsOverviewContext = React.createContext<TermsOverviewContextProps>({
  starredOnly: false,
});

export const TermsOverview = () => {
  const { terms, experience } = useSet();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const studiable = !!experience.studiableTerms.length;
  const [sortType, setSortType] = React.useState(
    studiable ? "stats" : "original"
  );
  const [starredOnly, setStarredOnly] = React.useState(false);

  const termsListComponent = () => {
    switch (sortType) {
      case "stats":
        return <TermsByStats />;
      case "original":
        return <TermsByOriginal />;
      case "alphabetical":
        return <TermsByAlphabetical />;
    }
  };

  React.useEffect(() => {
    if (!starredTerms.length) setStarredOnly(false);
  }, [starredTerms.length]);

  return (
    <TermsOverviewContext.Provider value={{ starredOnly }}>
      <Stack spacing={8}>
        <Flex
          justifyContent="space-between"
          flexDir={{ base: "column", md: "row" }}
          gap="6"
        >
          <Heading size="lg">Terms in this set ({terms.length})</Heading>
          <HStack spacing={4}>
            {!!starredTerms.length && (
              <ButtonGroup
                size="md"
                isAttached
                variant="outline"
                colorScheme="gray"
              >
                <Button
                  variant={!starredOnly ? "solid" : "outline"}
                  onClick={() => setStarredOnly(false)}
                >
                  All
                </Button>
                <Button
                  variant={starredOnly ? "solid" : "outline"}
                  onClick={() => setStarredOnly(true)}
                >
                  Starred ({starredTerms.length})
                </Button>
              </ButtonGroup>
            )}
            <TermsSortSelect
              studiable={!!experience.studiableTerms.length}
              onChange={setSortType}
            />
          </HStack>
        </Flex>
        {termsListComponent()}
      </Stack>
    </TermsOverviewContext.Provider>
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

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const starredOnly = React.useContext(TermsOverviewContext).starredOnly;
  const internalTerms = starredOnly
    ? terms.filter((x) => starredTerms.includes(x.id))
    : terms;

  if (!internalTerms.length) return null;

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
  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const internalSort =
    sortOrder || terms.sort((a, b) => a.rank - b.rank).map((x) => x.id);

  const starredOnly = React.useContext(TermsOverviewContext).starredOnly;
  const internalTerms = starredOnly
    ? terms.filter((x) => starredTerms.includes(x.id))
    : terms;

  return (
    <Stack spacing={4}>
      {internalTerms
        .sort((a, b) => internalSort.indexOf(a.id) - internalSort.indexOf(b.id))
        .map((term) => (
          <DisplayableTerm term={term} key={term.id} />
        ))}
    </Stack>
  );
};

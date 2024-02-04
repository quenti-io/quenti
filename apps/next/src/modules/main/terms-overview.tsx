import { useSession } from "next-auth/react";
import React from "react";

import { ToggleGroup } from "@quenti/components/toggle-group";
import type { FacingTerm } from "@quenti/interfaces";

import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconKeyframes,
  IconProgress,
  IconProgressBolt,
  IconProgressCheck,
  IconStar,
  type TablerIconsProps,
} from "@tabler/icons-react";

import { useAuthedSet, useSet } from "../../hooks/use-set";
import { useContainerContext } from "../../stores/use-container-store";
import { TermWrapper } from "./term-wrapper";
import { TermsSortSelect } from "./terms-sort-select";

interface TermsOverviewContextProps {
  starredOnly: boolean;
}

const TermsOverviewContext = React.createContext<TermsOverviewContextProps>({
  starredOnly: false,
});

export const TermsOverview = () => {
  const { status } = useSession();
  const { terms, injected } = useSet();

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const studiable =
    status == "authenticated" && !!injected!.studiableLearnTerms.length;
  const [sortType, setSortType] = React.useState(
    studiable ? "stats" : "original",
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

  if (!terms.length) return null;

  return (
    <TermsOverviewContext.Provider value={{ starredOnly }}>
      <Stack spacing={8}>
        <Flex
          justifyContent="space-between"
          flexDir={{ base: "column", md: "row" }}
          gap="6"
        >
          <Heading size="md">
            <HStack spacing="3">
              <HStack fontSize="3xl">
                <IconKeyframes size={28} />
                <>{terms.length}</>
              </HStack>
              <>{terms.length != 1 ? "terms" : "term"} in this set</>
            </HStack>
          </Heading>
          <HStack spacing={4}>
            {!!starredTerms.length && (
              <ToggleGroup
                index={starredOnly ? 1 : 0}
                size="sm"
                tabProps={{
                  h: "9",
                  fontWeight: 600,
                  transition: "all 0.2s ease-in-out",
                }}
              >
                <ToggleGroup.Tab onClick={() => setStarredOnly(false)}>
                  <Text color={!starredOnly ? "blue.300" : undefined}>All</Text>
                </ToggleGroup.Tab>
                <ToggleGroup.Tab
                  color={starredOnly ? "blue.300" : undefined}
                  onClick={() => setStarredOnly(true)}
                >
                  <HStack spacing="2">
                    <Text>Starred</Text>
                    <HStack spacing="1">
                      <IconStar
                        size={14}
                        style={{
                          transition: "fill-opacity 0.2s ease-in-out",
                          fill: "#4b83ff",
                          fillOpacity: starredOnly ? 1 : 0,
                        }}
                      />
                      <Text>{starredTerms.length}</Text>
                    </HStack>
                  </HStack>
                </ToggleGroup.Tab>
              </ToggleGroup>
            )}
            <TermsSortSelect studiable={studiable} onChange={setSortType} />
          </HStack>
        </Flex>
        {termsListComponent()}
      </Stack>
    </TermsOverviewContext.Provider>
  );
};

const TermsByStats = () => {
  const { terms, container, injected } = useAuthedSet();

  let familiarTerms = injected.studiableLearnTerms
    .filter((x) => x.correctness != 0 && x.correctness != 2)
    .map((x) => terms.find((t) => t.id === x.id)!)
    .filter((x) => x);

  let unstudiedTerms = terms.filter((x) => {
    const studiableTerm = injected.studiableLearnTerms.find(
      (s) => s.id === x.id,
    );
    return !studiableTerm || studiableTerm.correctness === 0;
  });

  let masteredTerms = injected.studiableLearnTerms
    .filter((x) => x.correctness === 2)
    .map((x) => terms.find((t) => t.id === x.id)!)
    .filter((x) => x);

  familiarTerms = container.learnMode == "Learn" ? familiarTerms : [];
  unstudiedTerms = container.learnMode == "Learn" ? unstudiedTerms : [];
  masteredTerms = container.learnMode == "Learn" ? masteredTerms : terms;

  return (
    <>
      {!!familiarTerms.length && (
        <TermsCategory
          heading="still studying"
          icon={IconProgressBolt}
          subheading="You're still learning these terms. Keep it up!"
          terms={familiarTerms}
          color="orange"
        />
      )}
      {!!unstudiedTerms.length && (
        <TermsCategory
          heading="not studied"
          icon={IconProgress}
          subheading="You haven't studied these terms yet."
          terms={unstudiedTerms}
          color="gray"
        />
      )}
      {!!masteredTerms.length && (
        <TermsCategory
          heading="mastered"
          icon={IconProgressCheck}
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

  return <TermsList terms={terms} slice={100} />;
};

const TermsByAlphabetical = () => {
  const { terms } = useSet();
  const sortOrder = terms
    .sort((a, b) => a.word.localeCompare(b.word))
    .map((x) => x.id);

  return <TermsList terms={terms} sortOrder={sortOrder} slice={100} />;
};

interface TermsCategoryProps {
  heading: string;
  subheading: string;
  terms: FacingTerm[];
  icon: React.FC<TablerIconsProps>;
  color: string;
}

const TermsCategory: React.FC<TermsCategoryProps> = ({
  heading,
  subheading,
  terms,
  icon: Icon,
  color,
}) => {
  const headingColor = useColorModeValue(`${color}.500`, `${color}.300`);

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const starredOnly = React.useContext(TermsOverviewContext).starredOnly;
  const internalTerms = starredOnly
    ? terms.filter((x) => starredTerms.includes(x.id))
    : terms;

  if (!internalTerms.length) return null;

  return (
    <Stack spacing={6}>
      <HStack spacing="4">
        <Box h="64px" w="3px" bg={headingColor} rounded="full" opacity="0.3" />
        <Stack spacing="1">
          <Heading size="md">
            <HStack spacing="2">
              <HStack spacing="1" color={headingColor} fontSize="2xl">
                <Icon size={20} />
                <>{terms.length}</>
              </HStack>
              <>{heading}</>
            </HStack>
          </Heading>
          <Text color="gray.500" fontWeight={500}>
            {subheading}
          </Text>
        </Stack>
      </HStack>
      <TermsList terms={terms} />
    </Stack>
  );
};

interface TermsListProps {
  terms: FacingTerm[];
  sortOrder?: string[];
  slice?: number;
}

const TermsList: React.FC<TermsListProps> = ({ terms, sortOrder, slice }) => {
  const session = useSession();
  const { userId } = useSet();

  const creator = session.data?.user?.id === userId;

  const starredTerms = useContainerContext((s) => s.starredTerms);
  const internalSort =
    sortOrder || terms.sort((a, b) => a.rank - b.rank).map((x) => x.id);

  const starredOnly = React.useContext(TermsOverviewContext).starredOnly;
  const internalTerms = starredOnly
    ? terms.filter((x) => starredTerms.includes(x.id))
    : terms;

  const [showSlice, setShowSlice] = React.useState(slice);

  return (
    <>
      <Stack spacing="14px">
        {internalTerms
          .sort(
            (a, b) => internalSort.indexOf(a.id) - internalSort.indexOf(b.id),
          )
          .slice(0, showSlice || terms.length)
          .map((term) => (
            <TermWrapper term={term} key={term.id} creator={creator} />
          ))}
      </Stack>
      {showSlice !== undefined && showSlice < terms.length && (
        <Button
          onClick={() => {
            setShowSlice((s) => (s || 0) + 100);
          }}
        >
          See more
        </Button>
      )}
    </>
  );
};

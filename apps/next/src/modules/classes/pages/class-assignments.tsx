import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { useDebounce } from "@quenti/lib/hooks/use-debounce";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  HStack,
  Skeleton,
  SlideFade,
  Stack,
} from "@chakra-ui/react";

import { IconPlus } from "@tabler/icons-react";

import { LoadingSearch } from "../../../components/loading-search";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { AssignmentFeed } from "../assignments/assignment-feed";
import { SectionSelect } from "../section-select";

export const ClassAssignments = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: class_ } = useClass();
  const isTeacher = useIsClassTeacher();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const [section, setSection] = React.useState<string | undefined>();

  const { data: feed, isPreviousData } = api.assignments.feed.useQuery(
    {
      classId: id,
      query: debouncedSearch.length ? debouncedSearch : undefined,
      sectionId: section,
    },
    {
      keepPreviousData: true,
      enabled: !!class_,
      cacheTime: !search.length && !section ? undefined : 0,
    },
  );

  const isLoaded = !!feed;

  return (
    <Stack spacing="8" mt="8">
      <Skeleton rounded="md" fitContent w="full" isLoaded={isLoaded}>
        <HStack
          spacing="4"
          w={{ base: "full", md: "auto" }}
          justifyContent={{ base: "space-between", md: "auto" }}
        >
          <LoadingSearch
            value={search}
            onChange={setSearch}
            placeholder="Search assignments"
            debounceInequality={search.trim() != debouncedSearch.trim()}
          />
          {isTeacher && (
            <>
              <Box minW="250px" w="250px">
                <SectionSelect
                  sections={Array.from([
                    {
                      id: "",
                      name: "All sections",
                      students: 0,
                    },
                  ]).concat(class_?.sections || [])}
                  onChange={(s) => {
                    if (s == "") {
                      setSection(undefined);
                    } else {
                      setSection(s);
                    }
                  }}
                  value={section || ""}
                />
              </Box>
              <Button
                leftIcon={<IconPlus size={18} />}
                minW="max"
                as={Link}
                href={`/classes/${id}/assignments/new`}
              >
                New
              </Button>
            </>
          )}
        </HStack>
      </Skeleton>
      {!isLoaded && <AssignmentFeed.Skeleton />}
      <SlideFade
        offsetY="10px"
        in={isLoaded && !isPreviousData}
        unmountOnExit={false}
      >
        <AssignmentFeed
          assignments={feed?.assignments || []}
          classId={id}
          role={feed?.role || "Student"}
        />
      </SlideFade>
    </Stack>
  );
};

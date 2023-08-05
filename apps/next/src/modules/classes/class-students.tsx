import {
  Box,
  ScaleFade,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import React from "react";
import { LoadingSearch } from "../../components/loading-search";
import { useClass } from "../../hooks/use-class";
import { useDebounce } from "../../hooks/use-debounce";
import { plural } from "../../utils/string";
import { ClassStudent } from "./class-student";

export const ClassStudentsRaw = () => {
  const { data: class_ } = useClass();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);

  const { data, isPreviousData, isFetchingNextPage, fetchNextPage } =
    api.classes.getStudents.useInfiniteQuery(
      {
        classId: class_?.id || "",
        query: debouncedSearch.length ? debouncedSearch : undefined,
        limit: 20,
      },
      {
        enabled: !!class_,
        retry: false,
        keepPreviousData: true,
        cacheTime: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]!.isIntersecting) {
          if (data?.pageParams) {
            void (async () => {
              await fetchNextPage();
            })();
          }
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [data?.pageParams, fetchNextPage]);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack spacing="6">
      <LoadingSearch
        value={search}
        onChange={setSearch}
        placeholder={`Search ${plural(class_?.students || 0, "student")}`}
        debounceInequality={search != debouncedSearch}
        isPreviousData={isPreviousData}
        skeleton={!class_}
      />
      {!!debouncedSearch.length &&
        data?.pages &&
        !data.pages[0]!.students.length && (
          <ScaleFade
            in={data?.pages && !data.pages[0]!.students.length}
            style={{
              width: "max-content",
              marginLeft: 16,
            }}
          >
            <Text color="gray.500" fontSize="sm">
              No students found
            </Text>
          </ScaleFade>
        )}
      {data?.pages && !!data.pages[0]!.students.length ? (
        <SlideFade
          offsetY="20px"
          in={!!data.pages.length && !isPreviousData}
          unmountOnExit={false}
        >
          <Box
            border="1px solid"
            rounded="lg"
            borderColor={borderColor}
            overflow="hidden"
            bg={menuBg}
          >
            {data.pages.map((page) => (
              <>
                {page.students.map((student) => (
                  <ClassStudent
                    user={student.user}
                    key={student.id}
                    section={(class_?.sections || []).find(
                      (s) => s.id == student.sectionId
                    )}
                  />
                ))}
              </>
            ))}
            {isFetchingNextPage && (
              <ClassStudent
                user={{
                  id: "",
                  email: "placeholder@example.com",
                  image: null,
                  name: "Placeholder",
                  username: "username",
                }}
                section={{
                  id: "",
                  name: "loading"
                }}
                skeleton
              />
            )}
          </Box>
          <div ref={observerTarget} />
        </SlideFade>
      ) : (
        !debouncedSearch.length && (
          <Box
            border="1px solid"
            rounded="lg"
            borderColor={borderColor}
            overflow="hidden"
            bg={menuBg}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <ClassStudent
                key={i}
                user={{
                  id: "",
                  email: "placeholder@example.com",
                  image: null,
                  name: "Placeholder",
                  username: "username",
                }}
                section={{
                  id: "",
                  name: "loading"
                }}
                skeleton
              />
            ))}
          </Box>
        )
      )}
    </Stack>
  );
};

export const ClassStudents = React.memo(ClassStudentsRaw);

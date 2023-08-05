import {
  Box,
  Button,
  HStack,
  ScaleFade,
  Skeleton,
  SlideFade,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { IconUserPlus } from "@tabler/icons-react";
import React from "react";
import { LoadingSearch } from "../../components/loading-search";
import { useClass } from "../../hooks/use-class";
import { useDebounce } from "../../hooks/use-debounce";
import { plural } from "../../utils/string";
import {
  ChangeSectionModal,
  type ChangeSectionModalProps,
} from "./change-section-modal";
import { ClassStudent } from "./class-student";
import { SectionSelect } from "./section-select";
import { SelectedBar } from "./selected-bar";

export const ClassStudentsRaw = () => {
  const { data: class_ } = useClass();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const [section, setSection] = React.useState<string | undefined>();

  const { data, isPreviousData, isFetchingNextPage, fetchNextPage } =
    api.classes.getStudents.useInfiniteQuery(
      {
        classId: class_?.id || "",
        query: debouncedSearch.length ? debouncedSearch : undefined,
        limit: 20,
        sectionId: section,
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

  const allVisibleIds = data
    ? data.pages.flatMap((p) => p.students).map((s) => s.user.id)
    : [];
  const [selected, setSelected] = React.useState<string[]>([]);

  const [changeSectionUsers, setChangeSectionUsers] = React.useState<
    ChangeSectionModalProps["members"]
  >([]);

  const onSelect = React.useCallback((id: string, selected: boolean) => {
    setSelected((prev) => {
      if (selected) {
        return [...prev, id];
      } else {
        return prev.filter((i) => i != id);
      }
    });
  }, []);

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <>
      {class_ && (
      <ChangeSectionModal
          isOpen={!!changeSectionUsers.length}
          onClose={() => setChangeSectionUsers([])}
          members={changeSectionUsers}
        />
      )}
      <Stack spacing="6">
        <HStack spacing="4">
          <LoadingSearch
            value={search}
            onChange={setSearch}
            placeholder={`Search ${plural(
              section
                ? class_?.sections?.find((s) => s.id == section)?.students || 0
                : class_?.students || 0,
              "student"
            )} ${
              section
                ? `in ${
                    class_?.sections?.find((s) => s.id == section)?.name ||
                    "this section"
                  }`
                : ""
            }`}
            debounceInequality={search.trim() != debouncedSearch.trim()}
            isPreviousData={isPreviousData}
            skeleton={!class_}
          />
          <Skeleton isLoaded={!!class_} rounded="md" fitContent w="250px">
            <SectionSelect
              sections={Array.from([
                {
                  id: "",
                  name: "All sections",
                  classId: class_?.id || "",
                },
              ]).concat(class_?.sections || [])}
              onChange={(s) => {
                if (s == "") {
                  setSection(undefined);
                } else {
                  setSection(s);
                }
                setSelected([]);
              }}
              value={section || ""}
            />
          </Skeleton>
          <Skeleton isLoaded={!!class_} rounded="md">
            <Button leftIcon={<IconUserPlus size={18} />} px="4">
              Add
            </Button>
          </Skeleton>
        </HStack>
        <SelectedBar
          selected={selected}
          isAllSelected={selected.length == allVisibleIds.length}
          onSelectAll={() => setSelected(allVisibleIds)}
          onDeselectAll={() => setSelected([])}
          onChangeSectionSelected={() => {
            setChangeSectionUsers(
              data!.pages
                .flatMap((p) => p.students)
                .filter((s) => selected.includes(s.user.id))
                .map((s) => ({
                  id: s.id,
                  user: s.user,
                  section: class_?.sections?.find((x) => x.id == s.sectionId),
                }))
            );
          }}
        />
        {(!!debouncedSearch.length || !!section) &&
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
                      selected={selected.includes(student.user.id)}
                      onSelect={onSelect}
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
                    name: "loading",
                  }}
                  skeleton
                />
              )}
            </Box>
            <div ref={observerTarget} />
          </SlideFade>
        ) : (
          !debouncedSearch.length &&
          !section && (
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
                    name: "loading",
                  }}
                  skeleton
                />
              ))}
            </Box>
          )
        )}
      </Stack>
    </>
  );
};

export const ClassStudents = React.memo(ClassStudentsRaw);

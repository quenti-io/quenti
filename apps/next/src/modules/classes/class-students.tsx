import React from "react";

import { useDebounce } from "@quenti/lib/hooks/use-debounce";
import { api } from "@quenti/trpc";

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

import { IconUserPlus } from "@tabler/icons-react";

import { LoadingSearch } from "../../components/loading-search";
import { useClass } from "../../hooks/use-class";
import { useEventCallback } from "../../hooks/use-event-callback";
import { plural } from "../../utils/string";
import { AddStudentsModal } from "./add-students-modal";
import {
  ChangeSectionModal,
  type ChangeSectionModalProps,
} from "./change-section-modal";
import { ClassJoinCodeModal } from "./class-join-code-modal";
import { ClassStudent } from "./class-student";
import {
  RemoveStudentsModal,
  type RemoveStudentsModalProps,
} from "./remove-students-modal";
import { SectionSelect } from "./section-select";
import { SelectedBar } from "./selected-bar";
import { useProtectedRedirect } from "./use-protected-redirect";

export const ClassStudentsRaw = () => {
  const { data: class_ } = useClass();
  const isLoaded = useProtectedRedirect();

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
        enabled: isLoaded,
        keepPreviousData: true,
        cacheTime: 0,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
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
      { threshold: 1 },
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

  const [changeSectionMembers, setChangeSectionMembers] = React.useState<
    ChangeSectionModalProps["members"]
  >([]);
  const [joinCodeOpen, setJoinCodeOpen] = React.useState(false);
  const [addStudentsOpen, setAddStudentsOpen] = React.useState(false);
  const [removeStudents, setRemoveStudents] = React.useState<
    RemoveStudentsModalProps["members"]
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

  const getUsers = (ids: string[]) => {
    return (
      data?.pages
        .flatMap((p) => p.students)
        .filter((s) => ids.includes(s.user.id)) || []
    );
  };

  const changeSectionCallback = useEventCallback((userId: string) => {
    setChangeSectionMembers(
      getUsers([userId]).map((s) => ({
        id: s.id,
        user: s.user,
        section: class_?.sections?.find((x) => x.id == s.sectionId),
      })),
    );
  });
  const removeStudentCallback = useEventCallback((userId: string) => {
    setRemoveStudents(
      getUsers([userId]).map((s) => ({ id: s.id, user: s.user })),
    );
  });

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <>
      {isLoaded && (
        <>
          <ClassJoinCodeModal
            isOpen={joinCodeOpen}
            onClose={() => setJoinCodeOpen(false)}
            selectable
          />
          <AddStudentsModal
            isOpen={addStudentsOpen}
            onClose={() => setAddStudentsOpen(false)}
          />
          <ChangeSectionModal
            isOpen={!!changeSectionMembers.length}
            onClose={() => setChangeSectionMembers([])}
            members={changeSectionMembers}
          />
          <RemoveStudentsModal
            isOpen={!!removeStudents.length}
            onClose={() => setRemoveStudents([])}
            onSuccess={() => {
              const removedIds = removeStudents.map((s) => s.id);
              setSelected((s) => s.filter((i) => !removedIds.includes(i)));
              setRemoveStudents([]);
            }}
            members={removeStudents}
          />
        </>
      )}
      <Stack spacing="6">
        <HStack spacing="4" flexDir={{ base: "column", md: "row" }}>
          <LoadingSearch
            value={search}
            onChange={setSearch}
            placeholder={`Search ${plural(
              section
                ? class_?.sections?.find((s) => s.id == section)?.students || 0
                : class_?.students || 0,
              "student",
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
          <HStack
            spacing="4"
            w={{ base: "full", md: "auto" }}
            justifyContent={{ base: "space-between", md: "auto" }}
          >
            <Skeleton isLoaded={isLoaded} rounded="md" fitContent w="250px">
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
                  setSelected([]);
                }}
                value={section || ""}
              />
            </Skeleton>
            <Skeleton isLoaded={isLoaded} rounded="lg">
              <Button
                leftIcon={<IconUserPlus size={18} />}
                px="4"
                colorScheme="gray"
                variant="outline"
                onClick={() => {
                  if (!class_) return;

                  if (class_.organization) {
                    setAddStudentsOpen(true);
                  } else {
                    setJoinCodeOpen(true);
                  }
                }}
              >
                Add
              </Button>
            </Skeleton>
          </HStack>
        </HStack>
        <SelectedBar
          selected={selected}
          isAllSelected={selected.length == allVisibleIds.length}
          onSelectAll={() => setSelected(allVisibleIds)}
          onDeselectAll={() => setSelected([])}
          onChangeSectionSelected={() => {
            setChangeSectionMembers(
              getUsers(selected).map((s) => ({
                id: s.id,
                user: s.user,
                section: class_?.sections?.find((x) => x.id == s.sectionId),
              })),
            );
          }}
          onRemoveSelected={() => {
            setRemoveStudents(
              getUsers(selected).map((s) => ({ id: s.id, user: s.user })),
            );
          }}
        />
        {data?.pages && !data.pages[0]!.students.length && (
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
              bg={menuBg}
            >
              {data.pages.map((page) => (
                <>
                  {page.students.map((student) => (
                    <ClassStudent
                      user={student.user}
                      key={student.id}
                      section={(class_?.sections || []).find(
                        (s) => s.id == student.sectionId,
                      )}
                      selected={selected.includes(student.user.id)}
                      onSelect={onSelect}
                      onRequestChangeSection={changeSectionCallback}
                      onRequestRemove={removeStudentCallback}
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
          !data &&
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

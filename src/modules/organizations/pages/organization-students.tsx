import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Progress,
  ScaleFade,
  Skeleton,
  SlideFade,
  Stack,
  Table,
  TableContainer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { ClientOnly } from "../../../components/client-only";
import { useDebounce } from "../../../hooks/use-debounce";
import { useOrganization } from "../../../hooks/use-organization";
import { api } from "../../../utils/api";
import { plural } from "../../../utils/string";
import { EmptyStudentsCard } from "../empty-students-card";
import { OrganizationStudent } from "../organization-student";
import { RemoveStudentModal } from "../remove-student-modal";

export const OrganizationStudents = () => {
  const org = useOrganization();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);

  const { data, isPreviousData, isFetchingNextPage, fetchNextPage } =
    api.organizations.getStudents.useInfiniteQuery(
      {
        orgId: org?.id || "",
        query: debouncedSearch.length ? debouncedSearch : undefined,
      },
      {
        enabled: !!org,
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
  }, [data?.pageParams, fetchNextPage]);

  const [removeStudent, setRemoveStudent] = React.useState<
    string | undefined
  >();

  const menuBg = useColorModeValue("white", "gray.800");

  if (org && org._count.users == 0) return <EmptyStudentsCard />;
  const isAdmin = org?.me.role == "Admin" || org?.me.role == "Owner";

  return (
    <>
      <RemoveStudentModal
        id={removeStudent || ""}
        isOpen={!!removeStudent}
        onClose={() => setRemoveStudent(undefined)}
      />
      <Stack spacing="6">
        <Skeleton
          rounded="md"
          fitContent
          isLoaded={!!org}
          w="full"
          position="relative"
          overflow="hidden"
        >
          <InputGroup
            bg="transparent"
            shadow="sm"
            rounded="md"
            w="full"
            position="relative"
          >
            <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
              <IconSearch size={18} />
            </InputLeftElement>
            <Input
              zIndex="20"
              placeholder={`Search ${plural(org?._count.users || 0, "student", {
                toLocaleString: true,
              })}...`}
              pl="44px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Box
              position="absolute"
              top="0"
              left="0"
              width="full"
              h="full"
              bg={menuBg}
            />
            <AnimatePresence>
              {(debouncedSearch != search || isPreviousData) && (
                <motion.div
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    width: "100%",
                    height: "100%",
                  }}
                  initial={{ opacity: 0.3 }}
                  animate={{ opacity: 0.3 }}
                  exit={{
                    opacity: 0,
                    transition: { duration: 1, ease: "linear" },
                  }}
                >
                  <Progress
                    position="absolute"
                    height="1px"
                    top="0"
                    left="0"
                    w="full"
                    h="full"
                    isIndeterminate
                    background={menuBg}
                  />
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    w="full"
                    h="full"
                    bg="transparent"
                    backdropFilter="blur(100px)"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </InputGroup>
        </Skeleton>
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
        {data?.pages ? (
          <SlideFade
            offsetY="20px"
            in={!!data.pages.length && !isPreviousData}
            unmountOnExit
          >
            <TableContainer pb="20" px="4">
              <Table size="md">
                {data.pages.map((page) => (
                  <>
                    {page.students.map((student) => (
                      <OrganizationStudent
                        user={student}
                        key={student.id}
                        canManage={isAdmin}
                        onRequestRemove={() => setRemoveStudent(student.id)}
                      />
                    ))}
                  </>
                ))}
                {isFetchingNextPage && (
                  <OrganizationStudent
                    user={{
                      id: "",
                      name: "student name placeholder",
                      username: "",
                      email: "email@example.com",
                      image: "",
                    }}
                    skeleton
                  />
                )}
              </Table>
            </TableContainer>
            <div ref={observerTarget} />
          </SlideFade>
        ) : (
          !debouncedSearch.length && (
            <ClientOnly>
              <TableContainer pb="20" px="4">
                <Table size="md">
                  {Array.from({
                    length: Math.min(org?._count.users || 20, 50),
                  }).map((_, i) => (
                    <OrganizationStudent
                      user={{
                        id: i.toString(),
                        name: "student name placeholder",
                        username: "",
                        email: "email@example.com",
                        image: "",
                      }}
                      key={i}
                      skeleton
                    />
                  ))}
                </Table>
              </TableContainer>
            </ClientOnly>
          )
        )}
      </Stack>
    </>
  );
};

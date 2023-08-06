import {
  Button,
  HStack,
  ScaleFade,
  SlideFade,
  Stack,
  Table,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { api } from "@quenti/trpc";
import { IconPlus } from "@tabler/icons-react";
import React from "react";
import { ClientOnly } from "../../../components/client-only";
import { LoadingSearch } from "../../../components/loading-search";
import { useDebounce } from "../../../hooks/use-debounce";
import { useOrganization } from "../../../hooks/use-organization";
import { plural } from "../../../utils/string";
import { AddStudentModal } from "../add-student-modal";
import { EmptyStudentsCard } from "../empty-students-card";
import { OrganizationAdminOnly } from "../organization-admin-only";
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
        limit: 20,
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
    return () => {
      observer.disconnect();
    };
  }, [data?.pageParams, fetchNextPage]);

  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [removeStudent, setRemoveStudent] = React.useState<
    string | undefined
  >();

  const onRequestRemove = React.useCallback((id: string) => {
    setRemoveStudent(id);
  }, []);

  if (org && org._count.users == 0) return <EmptyStudentsCard />;
  const isAdmin = org?.me.role == "Admin" || org?.me.role == "Owner";

  return (
    <>
      <AddStudentModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      <RemoveStudentModal
        id={removeStudent || ""}
        isOpen={!!removeStudent}
        onClose={() => setRemoveStudent(undefined)}
      />
      <Stack spacing="6">
        <HStack>
          <LoadingSearch
            value={search}
            onChange={setSearch}
            placeholder={`Search ${plural(org?._count.users || 0, "student", {
              toLocaleString: true,
            })}...`}
            debounceInequality={search != debouncedSearch}
            isPreviousData={isPreviousData}
          />
          <OrganizationAdminOnly>
            <Button
              leftIcon={<IconPlus size={18} />}
              onClick={() => setAddModalOpen(true)}
            >
              Add
            </Button>
          </OrganizationAdminOnly>
        </HStack>
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
                        onRequestRemove={onRequestRemove}
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

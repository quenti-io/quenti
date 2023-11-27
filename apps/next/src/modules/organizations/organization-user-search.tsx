import React from "react";

import { useDebounce } from "@quenti/lib/hooks/use-debounce";
import { api } from "@quenti/trpc";

import {
  Button,
  HStack,
  ScaleFade,
  SlideFade,
  Stack,
  Table,
  TableContainer,
  Tag,
  Text,
} from "@chakra-ui/react";

import { IconPlus } from "@tabler/icons-react";

import { ClientOnly } from "../../components/client-only";
import { LoadingSearch } from "../../components/loading-search";
import { useOrganization } from "../../hooks/use-organization";
import { useOrganizationMember } from "../../hooks/use-organization-member";
import { plural } from "../../utils/string";
import { AddStudentModal } from "./add-student-modal";
import { EmptyStudentsCard } from "./empty-students-card";
import { InviteTeachersModal } from "./invite-teachers-modal";
import { OrganizationAdminOnly } from "./organization-admin-only";
import { OrganizationUser } from "./organization-user";
import { RemoveStudentModal } from "./remove-user-modal";
import { getBaseDomain } from "./utils/get-base-domain";
import { useUserStatistics } from "./utils/use-user-statistics";

export interface OrganizationUserSearchProps {
  type: "Student" | "Teacher";
}

export const OrganizationUserSearch: React.FC<OrganizationUserSearchProps> = ({
  type,
}) => {
  const { data: org } = useOrganization();
  const me = useOrganizationMember();
  const baseDomain = getBaseDomain(org)!;

  const members = org?.members || [];
  const memberIds = members.map((m) => m.userId);

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);

  const { students, teachers, isLoaded } = useUserStatistics();
  const users = type == "Student" ? students : teachers;

  const { data, isPreviousData, isFetchingNextPage, fetchNextPage } =
    api.organizations.getUsers.useInfiniteQuery(
      {
        orgId: org?.id || "",
        type,
        query: debouncedSearch.length ? debouncedSearch : undefined,
        limit: 20,
      },
      {
        enabled: !!org,
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

  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [removeStudent, setRemoveStudent] = React.useState<
    string | undefined
  >();

  const onRequestRemove = React.useCallback((id: string) => {
    setRemoveStudent(id);
  }, []);

  if (org && isLoaded && users == 0) return <EmptyStudentsCard />;
  const isAdmin = me?.role == "Admin" || me?.role == "Owner";

  return (
    <>
      {org && (
        <>
          {type == "Student" ? (
            <AddStudentModal
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
            />
          ) : (
            <InviteTeachersModal
              isOpen={addModalOpen}
              onClose={() => setAddModalOpen(false)}
              orgId={org.id}
              domain={baseDomain.domain!}
            />
          )}
          <RemoveStudentModal
            id={removeStudent || ""}
            isOpen={!!removeStudent}
            onClose={() => setRemoveStudent(undefined)}
          />
        </>
      )}
      <Stack spacing="4">
        <HStack pb="2">
          <LoadingSearch
            value={search}
            skeleton={!org || !isLoaded}
            onChange={setSearch}
            placeholder={`Search ${plural(users, type.toLowerCase(), {
              toLocaleString: true,
            })}`}
            debounceInequality={search.trim() != debouncedSearch.trim()}
            isPreviousData={isPreviousData}
          />
          <OrganizationAdminOnly>
            <Button
              leftIcon={<IconPlus size={18} />}
              onClick={() => setAddModalOpen(true)}
            >
              {type == "Student" ? "Add" : "Invite"}
            </Button>
          </OrganizationAdminOnly>
        </HStack>
        {data?.pages && !data.pages[0]!.users.length && (
          <ScaleFade
            in={data?.pages && !data.pages[0]!.users.length}
            style={{
              width: "max-content",
              marginLeft: 16,
            }}
          >
            <Text color="gray.500" fontSize="sm">
              No {type == "Student" ? "students" : "teachers"} found
            </Text>
          </ScaleFade>
        )}
        {data?.pages ? (
          <SlideFade offsetY="20px" in={!!data.pages.length && !isPreviousData}>
            <TableContainer pb="20" px="4">
              <Table size="md">
                {data.pages.map((page) => (
                  <>
                    {page.users.map((user) => (
                      <OrganizationUser
                        user={user}
                        key={user.id}
                        canManage={isAdmin && user.id != me?.userId}
                        onRequestRemove={onRequestRemove}
                        tags={
                          memberIds.includes(user.id) ? (
                            <Tag size="sm" colorScheme="blue">
                              Member
                            </Tag>
                          ) : undefined
                        }
                      />
                    ))}
                  </>
                ))}
                {isFetchingNextPage && (
                  <OrganizationUser
                    user={{
                      id: "",
                      name: "user name placeholder",
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
                    length: Math.min(users || 20, 50),
                  }).map((_, i) => (
                    <OrganizationUser
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

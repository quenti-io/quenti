import {
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { ClientOnly } from "../../../components/client-only";
import { useDebounce } from "../../../hooks/use-debounce";
import { useOrganization } from "../../../hooks/use-organization";
import { api } from "../../../utils/api";
import { plural } from "../../../utils/string";
import { OrganizationStudent } from "../organization-student";

export const OrganizationStudents = () => {
  const org = useOrganization();

  const [search, setSearch] = React.useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);

  const { data, isFetchingNextPage, fetchNextPage } =
    api.organizations.getStudents.useInfiniteQuery(
      {
        orgId: org?.id || "",
        query: debouncedSearch.length ? debouncedSearch : undefined,
      },
      {
        enabled: !!org,
        retry: false,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );

  const observerTarget = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        console.log("DETECTED");
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

  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack spacing="6">
      <Skeleton rounded="md" fitContent isLoaded={!!org} w="full">
        <InputGroup bg={menuBg} shadow="sm" rounded="md">
          <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
            <IconSearch size={18} />
          </InputLeftElement>
          <Input
            placeholder={`Search ${plural(
              org?._count.users || 0,
              "student"
            )}...`}
            pl="44px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Skeleton>
      {data?.pages ? (
        <>
          <TableContainer pb="20" px="4">
            <Table size="md">
              {data.pages.map((page) => (
                <>
                  {page.students.map((student) => (
                    <OrganizationStudent user={student} key={student.id} />
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
        </>
      ) : (
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
      )}
    </Stack>
  );
};

import {
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconSearch } from "@tabler/icons-react";
import React from "react";
import { useOrganization } from "../../../hooks/use-organization";
import { api } from "../../../utils/api";
import { plural } from "../../../utils/string";
import { OrganizationStudent } from "../organization-student";

export const OrganizationStudents = () => {
  const org = useOrganization();
  const { data: students } = api.organizations.getStudents.useQuery(
    { orgId: org?.id || "" },
    {
      enabled: !!org,
      retry: false,
    }
  );

  const [search, setSearch] = React.useState("");

  const menuBg = useColorModeValue("white", "gray.800");

  return (
    <Stack spacing="6">
      <Skeleton rounded="md" fitContent isLoaded={!!students} w="full">
        <InputGroup bg={menuBg} shadow="sm" rounded="md">
          <InputLeftElement pointerEvents="none" pl="2" color="gray.500">
            <IconSearch size={18} />
          </InputLeftElement>
          <Input
            placeholder={`Search ${plural(
              org?.members.length || 0,
              "member"
            )}...`}
            pl="44px"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>
      </Skeleton>
      <Stack pb="20">
        {students?.map((student) => (
          <OrganizationStudent user={student} key={student.id} />
        ))}
      </Stack>
    </Stack>
  );
};

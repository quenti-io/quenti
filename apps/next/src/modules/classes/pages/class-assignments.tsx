import { Box, HStack, Heading, Stack } from "@chakra-ui/react";

import { LoadingSearch } from "../../../components/loading-search";
import { AssignmentCard } from "../assignments/assignment-card";

export const ClassAssignments = () => {
  return (
    <Stack spacing="8" mt="8">
      <LoadingSearch
        value=""
        placeholder="Search assignments"
        onChange={() => {}}
      />
      <Stack spacing="6">
        <HStack spacing="4">
          <Heading fontSize="2xl">Today</Heading>
          <Box flex="1" h="2px" bg="gray.100" _dark={{ bg: "gray.750" }} />
        </HStack>
        <Stack spacing="4">
          <AssignmentCard />
          <AssignmentCard />
        </Stack>
      </Stack>
    </Stack>
  );
};

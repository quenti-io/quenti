import { useRouter } from "next/router";
import React from "react";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  HStack,
  Heading,
  Skeleton,
  Stack,
} from "@chakra-ui/react";

import { IconClipboardText } from "@tabler/icons-react";

import { LoadingSearch } from "../../../components/loading-search";
import { useClass } from "../../../hooks/use-class";
import { useIsClassTeacher } from "../../../hooks/use-is-class-teacher";
import { AssignmentCard } from "../assignments/assignment-card";
import { SectionSelect } from "../section-select";

export const ClassAssignments = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const { data: class_ } = useClass();
  const isTeacher = useIsClassTeacher();

  const { data: feed } = api.assignments.feed.useQuery({
    classId: id,
  });

  const [section, setSection] = React.useState<string | undefined>();

  return (
    <Stack spacing="8" mt="8">
      <Skeleton rounded="md" fitContent w="full" isLoaded={!!feed}>
        <HStack
          spacing="4"
          w={{ base: "full", md: "auto" }}
          justifyContent={{ base: "space-between", md: "auto" }}
        >
          <LoadingSearch
            value=""
            placeholder="Search assignments"
            onChange={() => {}}
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
                leftIcon={<IconClipboardText size={18} />}
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
      <Stack spacing="6">
        <HStack spacing="4">
          <Heading fontSize="2xl">Today</Heading>
          <Box flex="1" h="2px" bg="gray.100" _dark={{ bg: "gray.750" }} />
        </HStack>
        <Stack spacing="4">
          <AssignmentCard
            for="Student"
            id=""
            type="Collab"
            name="Submitted Assignment"
            createdAt={new Date()}
            availableAt={new Date()}
            submission={{
              id: "",
              startedAt: new Date(),
              submittedAt: new Date(),
            }}
          />
          <AssignmentCard
            for="Student"
            id=""
            type="Collab"
            name="Midterm Study Guide Example"
            createdAt={new Date()}
            availableAt={new Date()}
          />
          <AssignmentCard
            for="Teacher"
            id=""
            type="Collab"
            name="1.2b — Your Midterm Study Guide"
            createdAt={new Date()}
            availableAt={new Date()}
            published={false}
            section={{
              id: "",
              name: "Section A",
              students: 22,
            }}
            submissions={18}
          />
        </Stack>
      </Stack>
    </Stack>
  );
};

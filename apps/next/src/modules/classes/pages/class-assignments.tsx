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
          {feed?.assignments.map((a) => (
            <AssignmentCard
              key={a.id}
              classId={id}
              for={feed?.role}
              id={a.id}
              type={a.type}
              name={a.title}
              createdAt={a.createdAt}
              availableAt={a.availableAt}
              submissions={a.submissions}
              section={
                a.section
                  ? {
                      id: a.section.id,
                      name: a.section.name,
                      students: a.section._count.students || 0,
                    }
                  : undefined
              }
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

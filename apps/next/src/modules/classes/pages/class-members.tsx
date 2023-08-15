import { Stack } from "@chakra-ui/react";

import { ClassStudents } from "../class-students";
import { ClassTeachers } from "../class-teachers";

export const ClassMembers = () => {
  return (
    <Stack spacing="16">
      <ClassTeachers />
      <ClassStudents />
    </Stack>
  );
};

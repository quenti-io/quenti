import { chakra } from "@chakra-ui/react";

export const addressStudents = (
  multiple: boolean,
  individual?: string | null,
) => {
  return (
    <>
      {multiple ? (
        "These students"
      ) : individual ? (
        <chakra.strong fontWeight={600}>{individual}</chakra.strong>
      ) : (
        "This student"
      )}
    </>
  );
};

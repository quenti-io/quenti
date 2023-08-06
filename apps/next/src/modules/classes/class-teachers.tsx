import {
  Box,
  Button,
  Flex,
  Skeleton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUserPlus } from "@tabler/icons-react";
import { useClass } from "../../hooks/use-class";
import { ClassTeacher } from "./class-teacher";

export const ClassTeachers = () => {
  const { data: class_ } = useClass();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  const teachers = class_?.teachers || [];
  const invites = class_?.teacherInvites || [];

  return (
    <Stack spacing="6">
      <Flex justifyContent="space-between" alignItems="end">
        <Text fontWeight={600} color="gray.500">
          Teachers
        </Text>
        <Skeleton fitContent rounded="md" isLoaded={!!class_}>
          <Button
            leftIcon={<IconUserPlus size={18} />}
            colorScheme="gray"
            variant="outline"
          >
            Add teachers
          </Button>
        </Skeleton>
      </Flex>
      <Box
        border="1px solid"
        rounded="lg"
        borderColor={borderColor}
        bg={menuBg}
      >
        {teachers.map((teacher) => (
          <ClassTeacher
            key={teacher.id}
            id={teacher.id}
            user={teacher.user}
            email={teacher.user.email}
            isMe={teacher.id == class_?.me.id}
          />
        ))}
        {invites.map((invite) => (
          <ClassTeacher
            key={invite.id}
            id={invite.id}
            user={invite.user}
            email={invite.email}
            pending
          />
        ))}
        {!class_ && (
          <ClassTeacher
            id=""
            email="placeholder@example.com"
            user={{
              image: null,
              name: "Placeholder",
              username: "username",
            }}
            skeleton
          />
        )}
      </Box>
    </Stack>
  );
};

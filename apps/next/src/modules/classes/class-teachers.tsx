import {
  Box,
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUserPlus } from "@tabler/icons-react";
import React from "react";
import { useClass } from "../../hooks/use-class";
import { ClassTeacher } from "./class-teacher";
import {
  RemoveTeacherModal,
  type RemoveTeacherModalProps,
} from "./remove-teacher-modal";
import { InviteTeachersModal } from "./invite-teachers-modal";

export const ClassTeachers = () => {
  const { data: class_ } = useClass();

  const borderColor = useColorModeValue("gray.200", "gray.700");
  const menuBg = useColorModeValue("white", "gray.800");

  const teachers = class_?.teachers || [];
  const invites = class_?.teacherInvites || [];

  const [addTeacherModalOpen, setAddTeacherModalOpen] = React.useState(false);
  const [removeTeacher, setRemoveTeacher] =
    React.useState<RemoveTeacherModalProps["member"]>();

  return (
    <>
      {class_ && (
        <>
          <InviteTeachersModal
            isOpen={addTeacherModalOpen}
            onClose={() => setAddTeacherModalOpen(false)}
          />
          <RemoveTeacherModal
            isOpen={!!removeTeacher}
            onClose={() => setRemoveTeacher(undefined)}
            member={removeTeacher}
          />
        </>
      )}
      <Stack spacing="6">
        <Flex justifyContent="space-between" alignItems="end">
          <Flex h="6" alignItems="center">
            <SkeletonText
              noOfLines={1}
              isLoaded={!!class_}
              skeletonHeight="18px"
            >
              <Text fontWeight={600} color="gray.500">
                Teachers
              </Text>
            </SkeletonText>
          </Flex>
          <Skeleton fitContent rounded="md" isLoaded={!!class_}>
            <Button
              leftIcon={<IconUserPlus size={18} />}
              colorScheme="gray"
              variant="outline"
              onClick={() => setAddTeacherModalOpen(true)}
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
              onRequestRemove={(id) => {
                setRemoveTeacher({
                  id,
                  nameOrEmail: teacher.user.name || teacher.user.email,
                  type: "member",
                });
              }}
            />
          ))}
          {invites.map((invite) => (
            <ClassTeacher
              key={invite.id}
              id={invite.id}
              user={invite.user}
              email={invite.email}
              pending
              onRequestRemove={(id) => {
                setRemoveTeacher({
                  id,
                  nameOrEmail: invite.email,
                  type: "invite",
                });
              }}
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
    </>
  );
};

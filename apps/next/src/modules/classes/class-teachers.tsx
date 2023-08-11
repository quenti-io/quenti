import {
  Box,
  Button,
  Flex,
  HStack,
  Skeleton,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { IconUserPlus, IconUserX, IconUsers } from "@tabler/icons-react";
import React from "react";
import { MemberComponent } from "../../components/member-component";
import { useClass } from "../../hooks/use-class";
import { InviteTeachersModal } from "./invite-teachers-modal";
import {
  RemoveTeacherModal,
  type RemoveTeacherModalProps,
} from "./remove-teacher-modal";

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
              <HStack color="gray.500" spacing="2" fontWeight={600}>
                <IconUsers size={18} />
                <Text>Teachers</Text>
              </HStack>
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
            <MemberComponent
              key={teacher.id}
              id={teacher.id}
              user={teacher.user}
              email={teacher.user.email}
              isMe={teacher.id == class_?.me.id}
              canManage
              actions={[
                {
                  label: "Remove",
                  icon: IconUserX,
                  onClick: (id) =>
                    setRemoveTeacher({
                      id,
                      nameOrEmail: teacher.user.name || teacher.user.email,
                      type: "member",
                    }),
                },
              ]}
            />
          ))}
          {invites.map((invite) => (
            <MemberComponent
              key={invite.id}
              id={invite.id}
              user={invite.user ?? undefined}
              email={invite.email}
              pending
              canManage
              actions={[
                {
                  label: "Remove",
                  icon: IconUserX,
                  onClick: (id) =>
                    setRemoveTeacher({
                      id,
                      nameOrEmail: invite.email,
                      type: "invite",
                    }),
                },
              ]}
            />
          ))}
          {!class_ && (
            <MemberComponent
              id=""
              email="placeholder@example.com"
              user={{
                image: null,
                name: "Placeholder",
                username: "username",
              }}
              canManage
              skeleton
            />
          )}
        </Box>
      </Stack>
    </>
  );
};

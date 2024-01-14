import React from "react";

import { Modal } from "@quenti/components/modal";
import { ToggleGroup } from "@quenti/components/toggle-group";
import type { StudySetVisibility } from "@quenti/prisma/client";
import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Flex,
  GridItem,
  HStack,
  Heading,
  ModalBody,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import {
  IconLink,
  IconLock,
  IconPlus,
  IconSchool,
  IconWorld,
} from "@tabler/icons-react";

import { ClassCard } from "../../components/class-card";
import { GhostGroup } from "../../components/ghost-group";
import { menuEventChannel } from "../../events/menu";
import { useIsTeacher } from "../../hooks/use-is-teacher";

export interface VisibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  visibility: StudySetVisibility;
  currentClass?: string;
  noPrivate?: boolean;
  onChangeVisibility: (visibility: StudySetVisibility) => void;
  classesWithAccess?: string[];
  onChangeClassesWithAccess?: (classes: string[]) => void;
}

export const VisibilityModal: React.FC<VisibilityModalProps> = ({
  isOpen,
  onClose,
  visibility,
  currentClass,
  noPrivate,
  onChangeVisibility,
  classesWithAccess,
  onChangeClassesWithAccess,
}) => {
  const isTeacher = useIsTeacher();

  const tabBorderColor = useColorModeValue("gray.200", "gray.700");
  const tabHoverColor = useColorModeValue("gray.50", "gray.750");

  const expanded = isTeacher && visibility == "Class";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content
        style={{
          minWidth: expanded ? 776 : 480,
          width: expanded ? 776 : 480,
        }}
        overflow="hidden"
        className="transition-[min-width,width] duration-300"
      >
        <ModalBody p="0" maxH="full">
          <Flex>
            <Stack spacing="5" flex="0" py="8" pl="10">
              <Heading size="lg">Set visibility</Heading>
              <ToggleGroup
                minW="400px"
                h="max"
                index={[
                  "Public",
                  "Unlisted",
                  noPrivate ? [] : "Private",
                  isTeacher ? "Class" : [],
                ]
                  .flat()
                  .indexOf(visibility)}
                orientation="vertical"
                rounded="2xl"
                tabBorderColor={tabBorderColor}
                tabHoverColor={tabHoverColor}
                tabProps={{
                  borderBottomWidth: "2px",
                  borderBottomColor: "gray.200",
                  _last: {
                    borderBottomWidth: 0,
                  },
                  _dark: {
                    borderBottomColor: "gray.700",
                  },
                }}
              >
                <ToggleGroup.Tab onClick={() => onChangeVisibility("Public")}>
                  <VisibilityOption
                    name="Public"
                    description="Anyone can view and study this set, and it will be publicly available on your profile."
                    icon={<IconWorld size={20} />}
                    selected={visibility === "Public"}
                  />
                </ToggleGroup.Tab>
                <ToggleGroup.Tab onClick={() => onChangeVisibility("Unlisted")}>
                  <VisibilityOption
                    name="Unlisted"
                    description="Anyone can view and study this set via a direct link. It will be hidden from your profile and not visible in other folders."
                    icon={<IconLink size={20} />}
                    selected={visibility === "Unlisted"}
                  />
                </ToggleGroup.Tab>
                {!noPrivate && (
                  <ToggleGroup.Tab
                    onClick={() => onChangeVisibility("Private")}
                  >
                    <VisibilityOption
                      name="Private"
                      description="Only you can view and study this set. It will not appear on your profile and can't be added to other people's folders."
                      icon={<IconLock size={20} />}
                      selected={visibility === "Private"}
                    />
                  </ToggleGroup.Tab>
                )}
                {isTeacher && (
                  <ToggleGroup.Tab onClick={() => onChangeVisibility("Class")}>
                    <VisibilityOption
                      name="Class"
                      description="Only members of specific classes can view and study this set. It will be available to the classes but hidden from your profile."
                      icon={<IconSchool size={20} />}
                      selected={visibility === "Class"}
                    />
                  </ToggleGroup.Tab>
                )}
              </ToggleGroup>
            </Stack>
            {isTeacher && (
              <ClassSelectGroup
                isOpen={visibility == "Class"}
                currentClass={currentClass}
                classesWithAccess={classesWithAccess}
                onChangeClassesWithAccess={onChangeClassesWithAccess}
              />
            )}
          </Flex>
        </ModalBody>
      </Modal.Content>
    </Modal>
  );
};

interface VisbilityOptionProps {
  selected: boolean;
  name: string;
  icon: React.ReactNode;
  description: string;
}

const VisibilityOption: React.FC<VisbilityOptionProps> = ({
  selected,
  name,
  icon,
  description,
}) => {
  const grayText = useColorModeValue("gray.600", "gray.400");

  return (
    <Stack spacing="2" textAlign="left" w="full" py="3" px="1">
      <HStack spacing="4" transition="color 0.2s ease-in-out">
        {icon}
        <Heading fontSize="xl" fontWeight={600}>
          {name}
        </Heading>
      </HStack>
      <Text
        fontSize="sm"
        pl="9"
        fontWeight={selected ? 500 : 400}
        color={selected ? undefined : grayText}
      >
        {description}
      </Text>
    </Stack>
  );
};

interface ClassSelectGroupProps {
  isOpen: boolean;
  currentClass?: string;
  classesWithAccess?: string[];
  onChangeClassesWithAccess?: (classes: string[]) => void;
}

const ClassSelectGroup: React.FC<ClassSelectGroupProps> = ({
  isOpen,
  currentClass,
  classesWithAccess,
  onChangeClassesWithAccess,
}) => {
  const { data: classes, isLoading } = api.classes.getBelonging.useQuery(
    undefined,
    {
      enabled: isOpen,
    },
  );

  return (
    <Box flex="1" position="relative" minW="336px">
      <Stack
        spacing="5"
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        pr="10"
        pl="12"
        py="8"
        overflow="auto"
      >
        <Heading size="md">Classes with access</Heading>
        <SimpleGrid columns={1} gap="4">
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <GridItem key={i}>
                <Skeleton h="169px" rounded="lg" w="full" />
              </GridItem>
            ))}
          {!isLoading &&
            !(classes || []).filter((c) => c.as == "Teacher").length && (
              <GridItem mt="4">
                <VStack textAlign="center">
                  <GhostGroup />
                  <Text color="gray.500" fontSize="sm" fontWeight={500}>
                    You aren&apos;t a teacher in any class yet. Create or join a
                    class to continue.
                  </Text>
                  <Button
                    leftIcon={<IconPlus size={16} />}
                    variant="outline"
                    size="sm"
                    mt="3"
                    onClick={() => menuEventChannel.emit("createClass")}
                  >
                    New class
                  </Button>
                </VStack>
              </GridItem>
            )}
          {(classes || [])
            .filter((c) => c.as == "Teacher")
            .sort((c) => (c.id == currentClass ? -1 : 1))
            .map((class_) => (
              <GridItem key={class_.id}>
                <ClassCard
                  id={class_.id}
                  name={class_.name}
                  disableLink
                  variant="selectable"
                  bannerColor={
                    class_.preferences?.bannerColor ?? class_.bannerColor
                  }
                  data={{
                    students: class_._count.members || 0,
                    sections: class_._count.sections || 0,
                  }}
                  for={class_.as}
                  logo={class_.logoUrl}
                  hash={class_.logoHash}
                  onClick={() => {
                    if (classesWithAccess?.includes(class_.id)) {
                      if (classesWithAccess?.length == 1) return;
                      const newClasses = classesWithAccess.filter(
                        (id) => id != class_.id,
                      );
                      onChangeClassesWithAccess?.(newClasses);
                    } else {
                      const newClasses = [
                        ...(classesWithAccess || []),
                        class_.id,
                      ];
                      onChangeClassesWithAccess?.(newClasses);
                    }
                  }}
                  selected={classesWithAccess?.includes(class_.id)}
                />
              </GridItem>
            ))}
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

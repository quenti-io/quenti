import {
  Button,
  ButtonGroup,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { StudySetAnswerMode } from "@prisma/client";
import { IconReload } from "@tabler/icons-react";
import { Select } from "chakra-react-select";
import { useRouter } from "next/router";
import React from "react";
import { useSet } from "../hooks/use-set";
import { useExperienceContext } from "../stores/use-experience-store";
import { api } from "../utils/api";

export interface SetSettingsModal {
  isOpen: boolean;
  onClose: (isDirty?: boolean) => void;
  reloadOnReset?: boolean;
}

const options = [
  {
    label: "Term",
    value: StudySetAnswerMode.Word,
  },
  {
    label: "Definition",
    value: StudySetAnswerMode.Definition,
  },
  {
    label: "Both",
    value: StudySetAnswerMode.Both,
  },
];

export const SetSettingsModal: React.FC<SetSettingsModal> = ({
  isOpen,
  onClose,
  reloadOnReset,
}) => {
  const { id, experience } = useSet();
  const utils = api.useContext();
  const router = useRouter();

  const starredTerms = useExperienceContext((s) => s.starredTerms);
  const studyStarred = useExperienceContext((s) => s.studyStarred);
  const setStudyStarred = useExperienceContext((s) => s.setStudyStarred);
  const answerWith = useExperienceContext((s) => s.answerWith);
  const setAnswerWith = useExperienceContext((s) => s.setAnswerWith);

  const apiStudyStarred = api.experience.setStudyStarred.useMutation();
  const apiAnswerWith = api.experience.setAnswerMode.useMutation();
  const apiResetLearnProgress = api.experience.resetLearnProgress.useMutation({
    onSuccess: async () => {
      if (!reloadOnReset) await utils.studySets.invalidate();
      onClose();
      if (reloadOnReset) router.reload();
    },
  });

  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        const isDirty =
          experience.answerWith !== answerWith ||
          experience.studyStarred !== studyStarred;

        onClose(isDirty);
      }}
      isCentered
      size="xl"
    >
      <ModalOverlay backdropFilter="blur(6px)" />
      <ModalContent p="4" pb="8" rounded="xl">
        <ModalBody>
          <Stack spacing={6}>
            <Heading>Settings</Heading>
            <Flex gap={8}>
              <Stack spacing={0} w="full">
                <Text fontWeight={700}>Terms</Text>
                <Text fontSize="sm" color={mutedColor}>
                  Select which terms to study
                </Text>
              </Stack>
              <ButtonGroup isAttached isDisabled={!starredTerms.length}>
                <Button
                  variant={!studyStarred ? "solid" : "outline"}
                  onClick={() => {
                    setStudyStarred(false);
                    apiStudyStarred.mutate({
                      studySetId: id,
                      studyStarred: false,
                    });
                  }}
                >
                  All
                </Button>
                <Button
                  variant={studyStarred ? "solid" : "outline"}
                  onClick={() => {
                    setStudyStarred(true);
                    apiStudyStarred.mutate({
                      studySetId: id,
                      studyStarred: true,
                    });
                  }}
                >
                  Starred
                </Button>
              </ButtonGroup>
            </Flex>
            <Divider />
            <Flex gap={8}>
              <Stack spacing={0} w="full">
                <Text fontWeight={700}>Study mode</Text>
                <Text fontSize="sm" color={mutedColor}>
                  Choose how to answer when studying
                </Text>
              </Stack>
              <Select
                selectedOptionStyle="check"
                value={options.find((o) => o.value === answerWith)}
                onChange={(e) => {
                  setAnswerWith(e!.value);
                  apiAnswerWith.mutate({
                    studySetId: id,
                    answerWith: e!.value,
                  });
                }}
                chakraStyles={{
                  inputContainer: () => ({
                    width: 100,
                  }),
                  valueContainer: (provided) => ({
                    ...provided,
                    backgroundColor: baseBg,
                  }),
                  dropdownIndicator: (provided) => ({
                    ...provided,
                    paddingX: 2,
                    backgroundColor: dropdownBg,
                    color: chevronColor,
                  }),
                }}
                options={options}
              />
            </Flex>
            <Divider />p
            <Flex gap={8}>
              <Stack spacing={0} w="full">
                <Text fontWeight={700}>Start over</Text>
                <Text fontSize="sm" color={mutedColor}>
                  Reset progress for this set
                </Text>
              </Stack>
              <Button
                px="12"
                variant="ghost"
                leftIcon={<IconReload />}
                isLoading={apiResetLearnProgress.isLoading}
                onClick={() => {
                  apiResetLearnProgress.mutate({
                    studySetId: id,
                  });
                }}
              >
                Reset Progress
              </Button>
            </Flex>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

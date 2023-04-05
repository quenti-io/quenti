import { Flex, Stack, Switch, Text, useColorModeValue } from "@chakra-ui/react";
import { useSet } from "../../../hooks/use-set";
import { useExperienceContext } from "../../../stores/use-experience-store";
import { api } from "../../../utils/api";

export const ExtendedFeedbackSection = () => {
  const { id } = useSet();

  const extendedFeedbackBank = useExperienceContext(
    (s) => s.extendedFeedbackBank
  );
  const setExtendedFeedbackBank = useExperienceContext(
    (s) => s.setExtendedFeedbackBank
  );

  const apiExtendedFeedbackBank =
    api.experience.setExtendedFeedbackBank.useMutation();

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Flex gap={8}>
      <Stack spacing={0} w="full">
        <Text fontWeight={700}>Insult mode</Text>
        <Text fontSize="sm" color={mutedColor}>
          Switch all feedback to insults
        </Text>
      </Stack>
      <Switch
        size="lg"
        isChecked={extendedFeedbackBank}
        onChange={(e) => {
          setExtendedFeedbackBank(e.target.checked);
          apiExtendedFeedbackBank.mutate({
            studySetId: id,
            extendedFeedbackBank: e.target.checked,
          });
        }}
      />
    </Flex>
  );
};

import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";

import {
  IconArrowLeft,
  IconCircleCheckFilled,
  IconPoint,
  IconPointFilled,
  IconReport,
  IconRotate,
  IconSettings,
} from "@tabler/icons-react";

import { useTestContext } from "../../stores/use-test-store";

export interface TestCardGapProps {
  type: "start" | "question" | "finish";
  title?: string;
  index?: number;
  numQuestions?: number;
}

export const TestCardGap: React.FC<TestCardGapProps> = ({
  type,
  title,
  index,
  numQuestions,
}) => {
  const answered = useTestContext((s) => s.timeline[index || 0]?.answered);

  const Icon =
    type == "start"
      ? IconReport
      : type == "finish"
      ? IconCircleCheckFilled
      : answered
      ? IconPointFilled
      : IconPoint;

  return (
    <HStack
      ml="34px"
      spacing="4"
      alignItems={type == "question" ? "center" : "stretch"}
    >
      <Stack w="3px" position="relative">
        <Box
          w="3px"
          minH="12"
          h="full"
          bg="gray.200"
          _dark={{ bg: "gray.750" }}
          roundedTop={type == "start" ? "full" : undefined}
          roundedBottom={type == "finish" ? "full" : undefined}
        />
        {type !== "start" && (
          <Box
            w="6"
            h="6"
            position="absolute"
            top={type == "finish" ? "100%" : "50%"}
            left="50%"
            transform={
              type == "question" ? "translate(-50%, -50%)" : "translate(-50%)"
            }
            bg="gray.50"
            color={type == "question" ? "gray.200" : "gray.400"}
            _dark={{
              bg: "gray.900",
              color: type == "question" ? "gray.700" : "gray.500",
            }}
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Icon size={24} />
          </Box>
        )}
      </Stack>
      {index !== undefined && numQuestions !== undefined && (
        <Text
          fontSize="sm"
          fontWeight={600}
          fontFamily="heading"
          color="gray.500"
          _dark={{
            color: "gray.400",
          }}
        >
          {index + 1} / {numQuestions}
        </Text>
      )}
      {title && (
        <HStack justifyContent="space-between" w="full" pr="34px">
          <Stack spacing="0">
            <Text fontSize="sm" fontWeight={600}>
              Test
            </Text>
            <Heading size="xl" m="0">
              {title}
            </Heading>
          </Stack>
          <ButtonGroup colorScheme="gray" spacing="2">
            <IconButton
              icon={<IconRotate />}
              aria-label="Restart"
              rounded="full"
              variant="ghost"
            />
            <IconButton
              icon={<IconSettings />}
              aria-label="Settings"
              rounded="full"
              variant="ghost"
            />
            <IconButton
              icon={<IconArrowLeft />}
              aria-label="Settings"
              rounded="full"
              variant="ghost"
            />
          </ButtonGroup>
        </HStack>
      )}
      {type == "finish" && (
        <Stack ml="8" mt="10" spacing="6" h="32">
          <Heading size="md" m="0">
            Ready to submit your test?
          </Heading>
          <Button variant="outline">Check answers</Button>
        </Stack>
      )}
    </HStack>
  );
};

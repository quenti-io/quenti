import {
  Box,
  Button,
  HStack,
  Heading,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

import {
  IconCircleCheckFilled,
  IconPoint,
  IconPointFilled,
  IconReport,
} from "@tabler/icons-react";

import { useTestContext } from "../../stores/use-test-store";
import { TestOptions } from "./test-options";

export interface TestCardGapProps {
  type: "start" | "question" | "finish";
  title?: string;
  index?: number;
  count?: number;
  numQuestions?: number;
}

export const TestCardGap: React.FC<TestCardGapProps> = ({
  type,
  title,
  index,
  count = 1,
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
      ml={{ base: "5px", sm: "26px", md: "34px" }}
      pr={{ base: "10px", sm: "52px", md: "68px" }}
      spacing="4"
      alignItems={type == "question" ? "center" : "stretch"}
      w="full"
    >
      <Stack w={{ base: "2px", sm: "3px" }} position="relative" minH="12">
        <Box
          w={{ base: "2px", sm: "3px" }}
          minH="12"
          h="full"
          bg="gray.200"
          _dark={{ bg: "gray.750" }}
          roundedTop={type == "start" ? "full" : undefined}
          roundedBottom={type == "finish" ? "full" : undefined}
        />
        {(type == "question" || type == "finish") && (
          <Box
            display={{ base: "block", sm: "none" }}
            position="absolute"
            top="-4"
            left="0"
            w={{ base: "2px", sm: "3px" }}
            h="20"
            bg="gray.200"
            _dark={{ bg: "gray.750" }}
            zIndex={-1}
          />
        )}
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
          {`${
            count <= 1 ? index + 1 : `${index + 1}-${index + count}`
          } / ${numQuestions}`}
        </Text>
      )}
      {title && (
        <HStack
          justifyContent={{ base: "start", md: "space-between" }}
          alignItems="start"
          w="full"
          pr={{ base: "5px", sm: "26px", md: "34px" }}
          flexDir={{ base: "column-reverse", md: "row" }}
        >
          <Stack spacing="0">
            <Text fontSize="sm" fontWeight={600}>
              Test
            </Text>
            <Heading size="xl" m="0">
              {title}
            </Heading>
          </Stack>
          <TestOptions />
        </HStack>
      )}
      {type == "finish" && (
        <VStack mt="10" spacing="6" h="24" w="full" pr="4">
          <Heading size="md" m="0">
            Ready to submit your test?
          </Heading>
          <Button size="lg" fontSize="md">
            Check answers
          </Button>
        </VStack>
      )}
    </HStack>
  );
};

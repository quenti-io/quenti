import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

import {
  Box,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  HStack,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from "@chakra-ui/react";

import { IconHelpCircle } from "@tabler/icons-react";

import { SkeletonLabel } from "../../../../components/skeleton-label";
import { DateTimeInput } from "../../date-time-input";
import { useProtectedRedirect } from "../../use-protected-redirect";

export const DatesSection = () => {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext();

  const isLoaded = useProtectedRedirect();

  const _availableAt = watch("availableAt") as string;
  const _dueAt = watch("dueAt") as string;

  return (
    <Stack spacing="8" mt="6">
      <Flex
        gap="6"
        display={{ base: "grid", lg: "flex" }}
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr" }}
      >
        <Controller
          name="availableAt"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Stack w="max">
              <SkeletonLabel isLoaded={isLoaded}>Available at</SkeletonLabel>
              <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                <DateTimeInput
                  value={value as string}
                  onChange={onChange}
                  minDate={dayjs().startOf("day").toISOString()}
                  inputStyles={{
                    w: { base: "full", sm: "244px" },
                  }}
                />
              </Skeleton>
            </Stack>
          )}
        />
        <DateDivider />
        <Controller
          name="dueAt"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.dueAt} w="max">
              <Stack>
                <SkeletonLabel isLoaded={isLoaded}>
                  Due at (optional)
                </SkeletonLabel>
                <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                  <DateTimeInput
                    value={value as string}
                    onChange={onChange}
                    placeholder="Set due date"
                    minDate={_availableAt}
                    inputStyles={{
                      w: { base: "full", sm: "244px" },
                    }}
                    nullable
                  />
                </Skeleton>
              </Stack>
              <FormErrorMessage>
                {errors.dueAt?.message as string}
              </FormErrorMessage>
            </FormControl>
          )}
        />
        <DateDivider />
        <Controller
          name="lockedAt"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControl isInvalid={!!errors.lockedAt} w="max">
              <Stack>
                <SkeletonLabel isLoaded={isLoaded}>
                  <HStack>
                    <Text>Locked at (optional)</Text>
                    <Tooltip
                      label="Students will not be able to submit or make any changes after this date."
                      placement="top"
                      p="2"
                      px="3"
                    >
                      <Box color="gray.500">
                        <IconHelpCircle size={16} />
                      </Box>
                    </Tooltip>
                  </HStack>
                </SkeletonLabel>
                <Skeleton rounded="lg" fitContent isLoaded={isLoaded}>
                  <DateTimeInput
                    value={value as string}
                    onChange={onChange}
                    minDate={_dueAt ?? _availableAt}
                    placeholder="Set lock date"
                    inputStyles={{
                      w: { base: "full", sm: "244px" },
                    }}
                    nullable
                  />
                </Skeleton>
              </Stack>
              <FormErrorMessage>
                {errors.lockedAt?.message as string}
              </FormErrorMessage>
            </FormControl>
          )}
        />
      </Flex>
    </Stack>
  );
};

const DateDivider = () => (
  <Center display={{ base: "none", lg: "inherit" }} w="2px" h="61px">
    <Box
      w="2px"
      bg="gray.200"
      _dark={{ bg: "gray.700" }}
      h="56px"
      rounded="full"
    />
  </Center>
);

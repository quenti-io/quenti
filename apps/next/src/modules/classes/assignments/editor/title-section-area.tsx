import { Controller, useFormContext } from "react-hook-form";

import {
  FormControl,
  FormErrorMessage,
  Input,
  SimpleGrid,
  Skeleton,
  Stack,
} from "@chakra-ui/react";

import { SkeletonLabel } from "../../../../components/skeleton-label";
import { useClass } from "../../../../hooks/use-class";
import { SectionSelect } from "../../section-select";
import { useProtectedRedirect } from "../../use-protected-redirect";

export const TitleSectionArea = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const isLoaded = useProtectedRedirect();
  const { data: class_ } = useClass();

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 8, md: 4 }}>
      <Controller
        name="title"
        control={control}
        render={({ field: { value, onChange } }) => (
          <FormControl isInvalid={!!errors.title}>
            <Stack>
              <SkeletonLabel isLoaded={isLoaded}>Title</SkeletonLabel>
              <Skeleton rounded="lg" w="full" isLoaded={isLoaded}>
                <Input
                  w="full"
                  autoFocus
                  rounded="lg"
                  placeholder="Assignment Title"
                  defaultValue={value as string}
                  onChange={onChange}
                  bg="white"
                  shadow="sm"
                  _dark={{
                    bg: "gray.800",
                  }}
                />
              </Skeleton>
            </Stack>
            <FormErrorMessage>
              {errors.title?.message as string}
            </FormErrorMessage>
          </FormControl>
        )}
      />
      <Controller
        name="sectionId"
        control={control}
        render={({ field: { value, onChange } }) => (
          <Stack>
            <SkeletonLabel isLoaded={isLoaded}>Section</SkeletonLabel>
            <Skeleton rounded="lg" isLoaded={isLoaded} w="full" maxW="200px">
              <SectionSelect
                value={value as string}
                onChange={onChange}
                sections={class_?.sections ?? []}
                size="md"
              />
            </Skeleton>
          </Stack>
        )}
      />
    </SimpleGrid>
  );
};

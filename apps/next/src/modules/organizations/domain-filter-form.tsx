import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Link } from "@quenti/components";
import { api } from "@quenti/trpc";
import { refineRegex } from "@quenti/trpc/server/common/validation";

import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconSchool, IconUser } from "@tabler/icons-react";

import { useOrganization } from "../../hooks/use-organization";
import { getBaseDomain } from "./utils/get-base-domain";

export interface DomainFilterFormProps {
  formRef?: React.RefObject<HTMLFormElement>;
  defaultFilter?: string;
  onSuccess?: () => void | Promise<void>;
  onChangeFilter?: (filter: string) => void;
  onChangeLoading?: (loading: boolean) => void;
}

const schema = z.object({
  filter: z
    .string()
    .nonempty({ message: "Enter a regular expression" })
    .refine(...refineRegex),
});

interface DomainFilterFormInputs {
  filter: string;
}

export const DomainFilterForm = React.forwardRef(function DomainFilterForm(
  {
    formRef,
    defaultFilter,
    onSuccess,
    onChangeFilter,
    onChangeLoading,
    children,
  }: React.PropsWithChildren<DomainFilterFormProps>,
  ref,
) {
  const { data: org } = useOrganization();
  const domain = getBaseDomain(org);

  const domainFilterMethods = useForm<DomainFilterFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      filter: defaultFilter ?? "^[^0-9]",
    },
  });
  const {
    formState: { errors },
  } = domainFilterMethods;

  const setDomainFilter = api.organizations.setDomainFilter.useMutation({
    onSuccess,
  });

  const watchFilter = domainFilterMethods.watch("filter");
  React.useEffect(() => {
    onChangeFilter?.(watchFilter);
  }, [watchFilter, onChangeFilter]);

  const [testValue, setTestValue] = React.useState("");

  const testValid =
    z
      .string()
      .email()
      .safeParse(`${testValue}@${domain?.requestedDomain || ""}`).success ||
    !testValue.trim().length;

  const evaluate = () => {
    try {
      return new RegExp(watchFilter).test(testValue);
    } catch {
      return false;
    }
  };
  const evaluation = evaluate();

  const onSubmit: SubmitHandler<DomainFilterFormInputs> = async (data) => {
    await setDomainFilter.mutateAsync({
      orgId: org!.id,
      domainId: domain!.id,
      filter: data.filter,
    });
  };

  React.useEffect(() => {
    onChangeLoading?.(setDomainFilter.isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDomainFilter.isLoading]);

  React.useImperativeHandle(
    ref,
    () => {
      return {
        setFilter: (filter: string) => {
          domainFilterMethods.setValue("filter", filter);
        },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const highlight = useColorModeValue("blue.500", "blue.200");
  const addonBg = useColorModeValue("gray.100", "gray.750");
  const error = useColorModeValue("red.600", "red.300");

  return (
    <form onSubmit={domainFilterMethods.handleSubmit(onSubmit)} ref={formRef}>
      <Stack spacing="8">
        <Stack spacing="6">
          <Stack spacing="6">
            <Controller
              name="filter"
              control={domainFilterMethods.control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.filter}>
                  <FormLabel fontSize="sm" mb="10px" color="gray.500">
                    Regular expression •{" "}
                    <Link
                      href="https://www.janmeppe.com/blog/regex-for-noobs/"
                      transition="color 0.2s ease-in-out"
                      _hover={{ color: highlight }}
                      target="_blank"
                    >
                      learn more
                    </Link>
                  </FormLabel>
                  <Input
                    placeholder="^[^0-9]"
                    fontFamily="mono"
                    value={value}
                    onChange={onChange}
                  />
                  <FormErrorMessage>{errors.filter?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </Stack>
          <Stack spacing="3">
            <FormControl>
              <FormLabel fontSize="sm" mb="10px" color="gray.500">
                Test your filter
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="email"
                  value={testValue}
                  onChange={(e) => setTestValue(e.target.value)}
                />
                <InputRightAddon bg={addonBg}>
                  @{domain?.requestedDomain || ""}
                </InputRightAddon>
              </InputGroup>
            </FormControl>
            <HStack
              color={testValid ? undefined : error}
              transition="color 0.15s ease-in-out"
            >
              {evaluation && testValue.trim().length ? (
                <IconSchool size={16} />
              ) : (
                <IconUser size={16} />
              )}
              <Text fontSize="sm">
                {testValue.trim().length && testValid ? (
                  <>
                    {testValue}@{domain?.requestedDomain || ""} is a{" "}
                    <strong>{evaluation ? "teacher" : "student"}</strong>
                  </>
                ) : testValid ? (
                  "Enter an email to test your filter"
                ) : (
                  "Enter a valid email"
                )}
              </Text>
            </HStack>
          </Stack>
        </Stack>
        {children}
      </Stack>
    </form>
  );
});

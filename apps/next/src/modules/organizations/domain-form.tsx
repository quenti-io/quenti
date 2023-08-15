import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@quenti/trpc";

import {
  Alert,
  AlertDescription,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";

import { IconExclamationCircle } from "@tabler/icons-react";

import { DOMAIN_REGEX } from "../../../../../packages/lib/constants/organizations";
import { useOrganization } from "../../hooks/use-organization";
import { DomainConflictCard } from "./domain-conflict-card";

interface DomainFormInputs {
  domain: string;
  email: string;
}

const schema = z.object({
  domain: z
    .string()
    .nonempty({ message: "Domain is required" })
    .regex(DOMAIN_REGEX, { message: "Enter a valid domain" }),
  email: z
    .string()
    .nonempty("Email is required")
    .email({ message: "Enter a valid email" }),
});

interface DomainFormProps {
  formRef?: React.RefObject<HTMLFormElement>;
  onSuccess?: () => void | Promise<void>;
  onChangeLoading?: (loading: boolean) => void;
}

export const DomainForm: React.FC<React.PropsWithChildren<DomainFormProps>> = ({
  formRef,
  onSuccess,
  onChangeLoading,
  children,
}) => {
  const [domainConflict, setDomainConflict] = React.useState<
    string | undefined
  >();

  const { data: org } = useOrganization();
  const domainFormMethods = useForm<DomainFormInputs>({
    defaultValues: {
      domain: "",
      email: "",
    },
    resolver: zodResolver(schema),
  });
  const {
    formState: { errors },
  } = domainFormMethods;

  const watchDomain = domainFormMethods.watch("domain");

  const addStudentDomain = api.organizations.addStudentDomain.useMutation({
    onSuccess,
    onError: (data) => {
      if (data.message == "email_domain_mismatch") {
        domainFormMethods.setError("email", {
          type: "custom",
          message: "That email address doesn't end in your domain",
        });
      } else if (data.message == "email_domain_blacklisted") {
        domainFormMethods.setError("domain", {
          type: "custom",
          message: "We can't use this domain for your organization",
        });
      } else if (data.message == "domain_already_verified") {
        setDomainConflict(addStudentDomain.variables?.domain);
      } else if (data.message == "already_verified_for_organization") {
        domainFormMethods.setError("domain", {
          type: "custom",
          message: "This domain is already verified for your organization",
        });
      } else {
        domainFormMethods.setError("root", {
          type: "custom",
          message: "Something went wrong",
        });
      }
    },
  });

  const onSubmit: SubmitHandler<DomainFormInputs> = async (data) => {
    setDomainConflict(undefined);
    await addStudentDomain.mutateAsync({
      orgId: org!.id,
      domain: data.domain,
      email: data.email,
    });
  };

  React.useEffect(() => {
    onChangeLoading?.(addStudentDomain.isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addStudentDomain.isLoading]);

  return (
    <form onSubmit={domainFormMethods.handleSubmit(onSubmit)} ref={formRef}>
      <Stack spacing="10">
        <Stack spacing="6">
          <Controller
            name="domain"
            control={domainFormMethods.control}
            defaultValue=""
            render={({ field: { value } }) => (
              <FormControl isInvalid={!!errors.domain}>
                <FormLabel fontSize="sm" mb="10px">
                  Domain
                </FormLabel>
                <Input
                  placeholder="example.edu"
                  autoFocus
                  defaultValue={value}
                  onChange={(e) => {
                    domainFormMethods.setValue("domain", e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.domain?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          <Controller
            name="email"
            control={domainFormMethods.control}
            defaultValue=""
            render={({ field: { value } }) => (
              <FormControl isInvalid={!!errors.email}>
                <FormLabel fontSize="sm" mb="10px">
                  Email for verification
                </FormLabel>
                <Input
                  placeholder={
                    !watchDomain.trim().length
                      ? `Email address for that domain`
                      : `Email address ending in @${watchDomain.trim()}`
                  }
                  defaultValue={value}
                  onChange={(e) => {
                    domainFormMethods.setValue("email", e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
          {domainConflict && <DomainConflictCard domain={domainConflict} />}
          {errors.root && (
            <Alert status="error" rounded="md" fontSize="sm">
              <Box color="red.400" mr="2">
                <IconExclamationCircle />
              </Box>
              <AlertDescription fontWeight={600}>
                {errors.root.message}
              </AlertDescription>
            </Alert>
          )}
        </Stack>
        {children}
      </Stack>
    </form>
  );
};

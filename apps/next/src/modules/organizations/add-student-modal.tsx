import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Input,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useOrganization } from "../../hooks/use-organization";
import { getBaseDomain } from "./utils/get-base-domain";

export interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddStudentFormInputs {
  email: string;
}

const schema = (domain: string) =>
  z.object({
    email: z
      .string()
      .nonempty("Email is required")
      .email("Enter a valid email")
      .refine(
        (email) => {
          const emailDomain = email.split("@")[1];
          return domain == emailDomain;
        },
        { message: "Email must end in your organization's domain" },
      ),
  });

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useUtils();
  const { data: org } = useOrganization();
  const baseDomain = getBaseDomain(org)!;
  const studentDomain = org?.domains.find((d) => d.type == "Student");
  const domain = studentDomain || baseDomain;

  const mutedColor = useColorModeValue("gray.600", "gray.400");

  const addStudentFormMethods = useForm<AddStudentFormInputs>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema(domain.requestedDomain || "")),
  });
  const {
    formState: { errors },
  } = addStudentFormMethods;

  const addStudent = api.organizations.addStudent.useMutation({
    onSuccess: async () => {
      onClose();
      addStudentFormMethods.reset();

      await utils.organizations.getUsers.invalidate();
    },
    onError: (error) => {
      switch (error.message) {
        case "cannot_add_self":
          addStudentFormMethods.setError("root", {
            message: "You can't add yourself as a student.",
          });
          break;
        case "no_account_for_email":
          addStudentFormMethods.setError("root", {
            message:
              "We couldn't find an account for that email. Once they sign up, they'll automatically be added to your organization.",
          });
          break;
        case "student_already_in_org":
          addStudentFormMethods.setError("root", {
            message: "This student is already in your organization.",
          });
          break;
        case "member_in_org":
          addStudentFormMethods.setError("root", {
            message:
              "This email belongs to a member of your organization. If you wish to add them a student, remove them as a member first.",
          });
          break;
      }
    },
  });

  const onSubmit: SubmitHandler<AddStudentFormInputs> = async (data) => {
    await addStudent.mutateAsync({
      orgId: org!.id,
      email: data.email,
    });
  };

  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={inputRef}>
      <Modal.Overlay />
      <Modal.Content>
        <form onSubmit={addStudentFormMethods.handleSubmit(onSubmit)}>
          <Modal.Body>
            <Modal.Heading>Add student</Modal.Heading>
            <Controller
              name="email"
              control={addStudentFormMethods.control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.email}>
                  <Input
                    ref={inputRef}
                    placeholder={`student@${domain.requestedDomain || ""}`}
                    defaultValue={value}
                    onChange={onChange}
                  />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
            {errors.root && (
              <Text color={mutedColor} fontSize="sm">
                {errors.root.message}
              </Text>
            )}
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={addStudent.isLoading} type="submit">
                Add student
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

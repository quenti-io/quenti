import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Modal } from "@quenti/components";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";

import { IconUpload } from "@tabler/icons-react";

import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { AutoResizeTextarea } from "../../components/auto-resize-textarea";
import { Toast } from "../../components/toast";
import { plural } from "../../utils/string";

export interface InviteTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  domain: string;
}

interface InviteTeachersFormInputs {
  emails: string[];
}

const requiredEmail = (domain: string) =>
  z
    .string()
    .nonempty({ message: "Email is required" })
    .email({ message: "Enter a valid email" })
    .endsWith(`@${domain}`, {
      message: `You can only invite people from your domain ${domain}`,
    });

const schema = (domain: string) =>
  z.object({
    emails: z
      .array(requiredEmail(domain))
      .nonempty("Emails are required")
      .max(1000, {
        message: "You can only invite up to 1000 teachers at a time",
      }),
  });

export const InviteTeachersModal: React.FC<InviteTeachersModalProps> = ({
  isOpen,
  onClose,
  orgId,
  domain,
}) => {
  const toast = useToast();

  const inviteMemberFormMethods = useForm<InviteTeachersFormInputs>({
    defaultValues: {
      emails: [],
    },
    resolver: zodResolver(schema(domain)),
  });
  const {
    formState: { errors },
  } = inviteMemberFormMethods;

  const inviteTeachers = api.organizations.inviteTeachers.useMutation({
    onSuccess: ({ invited }) => {
      if (invited > 0) {
        toast({
          title: `Invited ${plural(invited, "teacher")}`,
          status: "success",
          colorScheme: "green",
          icon: <AnimatedCheckCircle />,
          render: Toast,
        });
      }

      onClose();
    },
  });

  const handleFileUpload = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    if (!target.files?.length) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      const content = e?.target?.result as string;
      const emails = content
        ?.split(",")
        .map((email) => email.trim().toLowerCase());
      inviteMemberFormMethods.setValue("emails", emails);
      textAreaRef.current!.value = emails?.join(", ") || "";

      importRef.current!.value = "";
    };

    reader.readAsText(target.files[0]!);
  };

  const onSubmit: SubmitHandler<InviteTeachersFormInputs> = async (data) => {
    await inviteTeachers.mutateAsync({
      orgId,
      emails: data.emails,
    });
  };

  const importRef = React.useRef<HTMLInputElement | null>(null);
  const textAreaRef = React.useRef<HTMLTextAreaElement | null>(null);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <form onSubmit={inviteMemberFormMethods.handleSubmit(onSubmit)}>
        <Modal.Content>
          <Modal.Body>
            <Stack spacing="3">
              <Modal.Heading>Invite teachers</Modal.Heading>
              <Text>
                Teachers within your organization with emails ending in{" "}
                <strong>@{domain}</strong> are automatically added. Send out
                invites for your teachers to sign up on Quenti.
              </Text>
            </Stack>
            <Stack spacing="6">
              <Stack spacing="4">
                <Controller
                  name="emails"
                  control={inviteMemberFormMethods.control}
                  render={({ field: { value, onChange } }) => (
                    <FormControl isInvalid={!!errors.emails}>
                      <FormLabel>Invite via email</FormLabel>
                      <AutoResizeTextarea
                        ref={textAreaRef}
                        allowTab={false}
                        placeholder={`email-one@${domain}, email-two@${domain}`}
                        minH="120px"
                        maxH="480px"
                        overflowY="auto"
                        defaultValue={value}
                        onChange={(e) => {
                          const values = e.target.value
                            .toLowerCase()
                            .split(",");

                          const emails = values.map((v) => v.trim());
                          onChange(emails);
                        }}
                      />
                      <FormErrorMessage>
                        {errors.emails?.message ||
                          (errors.emails?.find
                            ? errors.emails?.find((x) => x?.message)?.message
                            : null)}
                      </FormErrorMessage>
                    </FormControl>
                  )}
                />
                <Button
                  variant="outline"
                  colorScheme="gray"
                  leftIcon={<IconUpload size={18} />}
                  onClick={() => {
                    if (importRef.current) importRef.current.click();
                  }}
                >
                  Upload a .csv file
                </Button>
                <input
                  ref={importRef}
                  hidden
                  id="bulkImport"
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    if (e) handleFileUpload(e);
                  }}
                />
              </Stack>
            </Stack>
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={inviteTeachers.isLoading}>
                Invite teachers
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal.Content>
      </form>
    </Modal>
  );
};

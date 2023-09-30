import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { Modal } from "@quenti/components";

import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Stack,
} from "@chakra-ui/react";

import { IconUpload } from "@tabler/icons-react";

import { AutoResizeTextarea } from "../../components/auto-resize-textarea";

export interface InviteTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
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
    emails: z.array(requiredEmail(domain)).nonempty("Emails are required"),
  });

export const InviteTeachersModal: React.FC<InviteTeachersModalProps> = ({
  isOpen,
  onClose,
  domain,
}) => {
  const inviteMemberFormMethods = useForm<InviteTeachersFormInputs>({
    defaultValues: {
      emails: [],
    },
    resolver: zodResolver(schema(domain)),
  });
  const {
    formState: { errors },
  } = inviteMemberFormMethods;

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
    };

    reader.readAsText(target.files[0]!);
  };

  const importRef = React.useRef<HTMLInputElement | null>(null);

  <Modal isOpen={isOpen} onClose={onClose}>
    <Modal.Overlay />
    <form onSubmit={inviteMemberFormMethods.handleSubmit(onSubmit)}>
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Invite teachers</Modal.Heading>
          <Stack spacing="6">
            <Stack spacing="4">
              <Controller
                name="emails"
                control={inviteMemberFormMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.emails}>
                    <FormLabel>Invite via email</FormLabel>
                    <AutoResizeTextarea
                      allowTab={false}
                      placeholder={`email-one@${domain}, email-two@${domain}`}
                      minH="120px"
                      defaultValue={value}
                      onChange={(e) => {
                        const values = e.target.value.toLowerCase().split(",");

                        const emails =
                          values.length == 1
                            ? values[0]!.trim()
                            : values.map((v) => v.trim());

                        onChange(emails);
                      }}
                    />
                    <FormErrorMessage>
                      {errors.emails?.message}
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
                style={{ display: "none" }}
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
            <Button type="submit" isLoading={inviteMember.isLoading}>
              Invite teachers
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </form>
  </Modal>;
};

import {
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  SlideFade,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@quenti/trpc";
import { useRouter } from "next/router";
import React from "react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Modal } from "../../components/modal";

export interface InviteTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InviteTeachersFormInputs {
  emails: string[];
  sendEmail: boolean;
}

const schema = z.object({
  emails: z
    .array(z.string().trim())
    .min(1)
    .max(10)
    .refine(
      (sections) => {
        return !!sections.find((s) => s.length > 0);
      },
      { message: "Enter at least one email" }
    ),
  sendEmail: z.boolean().default(true),
});

export const InviteTeachersModal: React.FC<InviteTeachersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const utils = api.useContext();

  const inviteTeachers = api.classes.inviteTeachers.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
      onClose();
    },
  });

  const inviteTeachersMethods = useForm<InviteTeachersFormInputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      emails: ["", ""],
      sendEmail: true,
    },
  });
  const {
    formState: { errors },
  } = inviteTeachersMethods;

  const onSubmit: SubmitHandler<InviteTeachersFormInputs> = async (data) => {
    await inviteTeachers.mutateAsync({
      ...data,
      classId: router.query.id as string,
      emails: data.emails.filter((s) => s.length > 0),
    });
  };

  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    if (!isOpen) {
      setMounted(false);
      return;
    }
    inviteTeachersMethods.reset();

    requestAnimationFrame(() => {
      setMounted(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const labelColor = useColorModeValue("gray.600", "gray.400");

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <form onSubmit={inviteTeachersMethods.handleSubmit(onSubmit)}>
          <Modal.Body>
            <Modal.Heading>Invite teaachers</Modal.Heading>
            <Stack spacing="4">
              <FormLabel m="0" fontSize="xs" color={labelColor}>
                Invite teachers to join this class
              </FormLabel>
              <Controller
                name="emails"
                control={inviteTeachersMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.emails}>
                    <Stack spacing="3">
                      {value.map((email, index) => (
                        <SlideFade
                          in
                          key={index}
                          transition={{
                            enter: {
                              duration: mounted ? 0.15 : 0,
                            },
                          }}
                        >
                          <Stack spacing="0">
                            <Input
                              autoFocus={index === 0}
                              // TODO: handle org domain placeholder
                              placeholder={`email@example.com`}
                              isInvalid={index === 0 && !!errors.emails}
                              px="14px"
                              defaultValue={email}
                              onChange={(e) => {
                                const emails = [...value];
                                emails[index] = e.target.value;
                                onChange(emails);
                              }}
                              onFocus={() => {
                                if (
                                  value.length - 1 === index &&
                                  value.length < 10
                                ) {
                                  onChange([...value, ""]);
                                }
                              }}
                            />
                            {index === 0 && (
                              <FormErrorMessage>
                                {errors.emails?.message}
                              </FormErrorMessage>
                            )}
                          </Stack>
                        </SlideFade>
                      ))}
                    </Stack>
                  </FormControl>
                )}
              />
            </Stack>
            <Controller
              name="sendEmail"
              control={inviteTeachersMethods.control}
              render={({ field: { onChange } }) => (
                <FormControl>
                  <Checkbox
                    defaultChecked
                    onChange={(e) => onChange(e.target.checked)}
                  >
                    Send an invite email
                  </Checkbox>
                </FormControl>
              )}
            />
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={inviteTeachers.isLoading}>
                Invite
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

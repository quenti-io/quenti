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
import { useClass } from "../../hooks/use-class";
import { getBaseDomain } from "../organizations/utils/get-base-domain";

export interface InviteTeachersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface InviteTeachersFormInputs {
  emails: (string | undefined)[];
  sendEmail: boolean;
}

const email = (domain?: string) =>
  z
    .string()
    .email({ message: "Enter a valid email" })
    .endsWith(domain ? `@${domain}` : "", {
      message: `You can only invite people from your organization's domain ${
        domain || ""
      }`,
    })
    .optional();

const schema = (domain?: string) =>
  z.object({
    emails: z.array(email(domain)).min(1).max(10),
    sendEmail: z.boolean().default(true),
  });

export const InviteTeachersModal: React.FC<InviteTeachersModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const utils = api.useContext();
  const { data: class_ } = useClass();
  const domain = getBaseDomain(class_?.organization ?? undefined);

  const inviteTeachers = api.classes.inviteTeachers.useMutation({
    onSuccess: async () => {
      await utils.classes.getMembers.invalidate();
      await utils.classes.get.invalidate();
      onClose();
    },
  });

  const inviteTeachersMethods = useForm<InviteTeachersFormInputs>({
    resolver: zodResolver(schema(domain?.domain ?? undefined)),
    defaultValues: {
      emails: [undefined, undefined],
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
      emails: data.emails.filter(
        (s) => s !== undefined && s.trim().length > 0
      ) as string[],
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
                              placeholder={`email@${
                                domain ? domain.domain ?? "" : "example.com"
                              }`}
                              isInvalid={!!errors.emails?.[index]}
                              px="14px"
                              defaultValue={email}
                              onChange={(e) => {
                                const emails = [...value];
                                const v = e.target.value.trim();
                                emails[index] = v.length ? v : undefined;
                                onChange(emails);
                              }}
                              onFocus={() => {
                                if (
                                  value.length - 1 === index &&
                                  value.length < 10
                                ) {
                                  onChange([...value, undefined]);
                                }
                              }}
                            />
                            {/* {index === 0 && errors.emails && (
                              <FormErrorMessage mt="0">
                                {errors.emails?.message}
                              </FormErrorMessage>
                            )} */}
                            {errors.emails?.[index] && (
                              <FormErrorMessage>
                                {errors.emails?.[index]?.message}
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

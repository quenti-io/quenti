import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Input,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@quenti/trpc";
import { useRouter } from "next/router";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { Modal } from "./modal";

export interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateClassFormInputs {
  name: string;
  description: string;
}

const schema = z.object({
  name: z.string().nonempty({ message: "Enter a name" }).min(1),
  description: z.string().optional(),
});

export const CreateClassModal: React.FC<CreateClassModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();

  const create = api.classes.create.useMutation({
    onSuccess: (data) => {
      onClose();
      void router.push(`/classes/${data.id}`);
    },
  });

  const createMethods = useForm<CreateClassFormInputs>({
    resolver: zodResolver(schema),
  });
  const {
    formState: { errors },
  } = createMethods;

  const onSubmit: SubmitHandler<CreateClassFormInputs> = async (data) => {
    await create.mutateAsync(data);
  };

  const inputBg = useColorModeValue("gray.100", "gray.750");
  const inputColor = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={false}>
      <Modal.Overlay />
      <Modal.Content>
        <form onSubmit={createMethods.handleSubmit(onSubmit)}>
          <Modal.Body>
            <Modal.Heading>Create a class</Modal.Heading>
            <Stack spacing="4">
              <Controller
                name="name"
                control={createMethods.control}
                render={({ field: { value, onChange } }) => (
                  <FormControl isInvalid={!!errors.name}>
                    <Input
                      placeholder="Title"
                      variant="flushed"
                      fontWeight={700}
                      bg={inputBg}
                      color={inputColor}
                      defaultValue={value}
                      onChange={onChange}
                      rounded="md"
                      px="4"
                      size="lg"
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="description"
                control={createMethods.control}
                defaultValue=""
                render={({ field: { value, onChange } }) => (
                  <AutoResizeTextarea
                    allowTab={false}
                    placeholder="Description (optional)"
                    bg={inputBg}
                    color={inputColor}
                    defaultValue={value}
                    onChange={onChange}
                    py="3"
                    border="none"
                  />
                )}
              />
            </Stack>
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button isLoading={create.isLoading} type="submit">
                Create
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal>
  );
};

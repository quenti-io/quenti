import React from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import {
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  Input,
} from "@chakra-ui/react";

import { useClass } from "../../hooks/use-class";

export interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AddSectionFormInputs {
  name: string;
}

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const utils = api.useUtils();
  const { data } = useClass();

  const createSection = api.classes.createSection.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
      onClose();
    },
    onError: (e) => {
      if (e.message == "section_already_exists") {
        addSectionMethods.setError("name", {
          type: "custom",
          message: "A section with that name already exists",
        });
      } else {
        addSectionMethods.setError("name", {
          type: "custom",
          message: e.message,
        });
      }
    },
  });

  const addSectionMethods = useForm<AddSectionFormInputs>();
  const {
    formState: { errors },
  } = addSectionMethods;

  React.useEffect(() => {
    if (isOpen) {
      addSectionMethods.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit: SubmitHandler<AddSectionFormInputs> = async (formData) => {
    await createSection.mutateAsync({
      classId: data!.id,
      name: formData.name,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <form onSubmit={addSectionMethods.handleSubmit(onSubmit)}>
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>Add section</Modal.Heading>
            <Controller
              name="name"
              control={addSectionMethods.control}
              render={({ field: { value, onChange } }) => (
                <FormControl isInvalid={!!errors.name}>
                  <Input
                    defaultValue={value}
                    onChange={onChange}
                    placeholder="Section name"
                  />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
              )}
            />
          </Modal.Body>
          <Modal.Divider />
          <Modal.Footer>
            <ButtonGroup>
              <Button variant="ghost" colorScheme="gray" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={createSection.isLoading}>
                Add section
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal.Content>
      </form>
    </Modal>
  );
};

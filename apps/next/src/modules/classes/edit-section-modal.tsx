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

export interface EditSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionId?: string;
}

interface EditSectionFormInputs {
  name: string;
}

export const EditSectionModal: React.FC<EditSectionModalProps> = ({
  isOpen,
  onClose,
  sectionId,
}) => {
  const utils = api.useUtils();
  const { data } = useClass();
  const section = data?.sections?.find((s) => s.id === sectionId);

  const updateSection = api.classes.updateSection.useMutation({
    onSuccess: async () => {
      await utils.classes.get.invalidate();
      onClose();
    },
    onError: (e) => {
      if (e.message == "section_already_exists") {
        editSectionMethods.setError("name", {
          type: "custom",
          message: "A section with that name already exists",
        });
      } else {
        editSectionMethods.setError("name", {
          type: "custom",
          message: e.message,
        });
      }
    },
  });

  const editSectionMethods = useForm<EditSectionFormInputs>();
  const {
    formState: { errors },
  } = editSectionMethods;

  React.useEffect(() => {
    if (isOpen) {
      editSectionMethods.reset({
        name: section?.name || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const onSubmit: SubmitHandler<EditSectionFormInputs> = async (formData) => {
    await updateSection.mutateAsync({
      classId: data!.id,
      sectionId: sectionId!,
      name: formData.name,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <form onSubmit={editSectionMethods.handleSubmit(onSubmit)}>
        <Modal.Content>
          <Modal.Body>
            <Modal.Heading>Edit section</Modal.Heading>
            <Controller
              name="name"
              control={editSectionMethods.control}
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
              <Button type="submit" isLoading={updateSection.isLoading}>
                Update section
              </Button>
            </ButtonGroup>
          </Modal.Footer>
        </Modal.Content>
      </form>
    </Modal>
  );
};

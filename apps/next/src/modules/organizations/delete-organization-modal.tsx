import { useRouter } from "next/router";
import React from "react";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import {
  Button,
  HStack,
  Input,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";

import { AnimatedCheckCircle } from "../../components/animated-icons/check";
import { Toast } from "../../components/toast";
import { useOrganization } from "../../hooks/use-organization";

interface DeleteOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteOrganizationModal: React.FC<
  DeleteOrganizationModalProps
> = ({ isOpen, onClose }) => {
  const utils = api.useUtils();
  const { data: org } = useOrganization();
  const router = useRouter();

  const toast = useToast();

  const apiDelete = api.organizations.delete.useMutation({
    onSuccess: async ({ scheduled }) => {
      if (!scheduled) {
        await utils.user.me.invalidate();
        await router.push("/home");
      } else {
        await utils.organizations.get.invalidate();

        toast({
          title: "Your organization will be deleted in 48 hours",
          icon: <AnimatedCheckCircle />,
          render: Toast,
        });
        onClose();
      }
    },
  });

  const [input, setInput] = React.useState("");
  const isValid = input == org?.name;

  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const mutedColor = useColorModeValue("gray.700", "gray.300");

  return (
    <Modal isOpen={isOpen} onClose={onClose} initialFocusRef={cancelRef}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>Delete organization</Modal.Heading>
          <Text color={mutedColor}>
            Are you sure you want to delete your organization? All members and
            students will be disbanded from the organization. Your billing will
            automatically be cancelled. <b>This action is irreversible.</b>
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <HStack spacing="4" w="full">
            <Input
              placeholder="Organization name"
              w="full"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <Button
              isDisabled={!isValid}
              onClick={() => {
                apiDelete.mutate({ orgId: org!.id });
              }}
              isLoading={apiDelete.isLoading}
              colorScheme="red"
              variant="outline"
              minW="max"
            >
              Delete organization
            </Button>
          </HStack>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

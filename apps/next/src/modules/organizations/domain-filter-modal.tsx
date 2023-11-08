import React from "react";

import { Modal } from "@quenti/components/modal";
import { api } from "@quenti/trpc";

import { Button, ButtonGroup, Text } from "@chakra-ui/react";

import { DomainFilterForm } from "./domain-filter-form";

export interface DomainFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filter?: string;
  update?: boolean;
}

export const DomainFilterModal: React.FC<DomainFilterModalProps> = ({
  isOpen,
  onClose,
  filter,
  update,
}) => {
  const utils = api.useUtils();

  const formRef = React.useRef<HTMLFormElement>(null);
  const [loading, setLoading] = React.useState(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>
            {update ? "Update" : "Add"} domain filter
          </Modal.Heading>
          <Text>
            Your domain&apos;s filter is a regular expression that matches when
            an email belongs to a teacher.
          </Text>
          <DomainFilterForm
            defaultFilter={filter}
            formRef={formRef}
            onChangeLoading={setLoading}
            onSuccess={async () => {
              onClose();
              await utils.organizations.get.invalidate();
            }}
          />
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose} colorScheme="gray">
              Cancel
            </Button>
            <Button
              isLoading={loading}
              onClick={() =>
                formRef.current?.dispatchEvent(
                  new Event("submit", { cancelable: true, bubbles: true }),
                )
              }
            >
              {update ? "Update" : "Add filter"}
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

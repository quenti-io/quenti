import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  useColorModeValue,
} from "@chakra-ui/react";
import type { MembershipRole } from "@prisma/client";
import { Select } from "chakra-react-select";
import React from "react";
import { Modal } from "../../components/modal";
import { api } from "../../utils/api";
import { useOrganization } from "../../hooks/use-organization";

export interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  role: MembershipRole;
}

const options: {
  label: string;
  value: MembershipRole;
  isDisabled?: boolean;
}[] = [
  {
    label: "Owner",
    value: "Owner",
  },
  {
    label: "Admin",
    value: "Admin",
  },
  {
    label: "Member",
    value: "Member",
  },
];

export const EditMemberModal: React.FC<EditMemberModalProps> = ({
  isOpen,
  onClose,
  id,
  role: _role,
}) => {
  const org = useOrganization();
  const utils = api.useContext();
  const myRole = org?.me?.role || "Member";

  const [role, setRole] = React.useState<MembershipRole>(_role);
  React.useEffect(() => {
    setRole(_role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const baseBg = useColorModeValue("gray.100", "gray.750");
  const dropdownBg = useColorModeValue("gray.200", "gray.700");
  const chevronColor = useColorModeValue("blue.400", "blue.200");

  const editMemberRole = api.organizations.editMemberRole.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.organizations.get.invalidate();
    },
  });

  const hydrateOptions = () => {
    if (myRole === "Admin") {
      return options.map((x) =>
        x.value === "Owner" ? { ...x, isDisabled: true } : x
      );
    }

    return options;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Edit member</Modal.Heading>
          <FormControl>
            <FormLabel>Role</FormLabel>
            <Select
              selectedOptionStyle="check"
              value={options.find((o) => o.value === role)}
              isSearchable={false}
              onChange={(e) => {
                setRole(e!.value);
              }}
              chakraStyles={{
                container: (provided) => ({
                  ...provided,
                  background: baseBg,
                  rounded: "lg",
                }),
                inputContainer: () => ({
                  width: 100,
                  rounded: "lg",
                }),
                option: (props, option) => ({
                  ...props,
                  cursor: option.isDisabled ? "not-allowed" : "pointer",
                  backgroundColor: option.isDisabled
                    ? undefined
                    : props.backgroundColor,
                  // color: option.isDisabled ? "gray.500" : props.color,
                }),
                dropdownIndicator: (provided) => ({
                  ...provided,
                  paddingX: 2,
                  backgroundColor: dropdownBg,
                  color: chevronColor,
                }),
              }}
              options={hydrateOptions().sort(
                (a, b) => (a.isDisabled ? 1 : 0) - (b.isDisabled ? 1 : 0)
              )}
            />
          </FormControl>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                editMemberRole.mutate({
                  orgId: org!.id,
                  userId: id,
                  role,
                });
              }}
              isLoading={editMemberRole.isLoading}
            >
              Update
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

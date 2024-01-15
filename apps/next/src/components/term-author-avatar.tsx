import type { FacingTerm } from "@quenti/interfaces";

import { Avatar, Popover, PopoverTrigger } from "@chakra-ui/react";

import { CollaboratorPopoverContent } from "../modules/main/collaborator-popover-content";

export interface TermAuthorAvatarProps {
  user: NonNullable<FacingTerm["author"]>;
  computePosition?: boolean;
}

export const TermAuthorAvatar: React.FC<TermAuthorAvatarProps> = ({
  user,
  computePosition,
}) => {
  return (
    <Popover
      isLazy
      trigger="hover"
      placement="top"
      computePositionOnMount={computePosition}
    >
      <PopoverTrigger>
        <Avatar
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
          style={{
            minWidth: 24,
            width: 24,
            height: 24,
            overflow: "hidden",
          }}
          src={user.image || ""}
          icon={<></>}
        />
      </PopoverTrigger>
      <CollaboratorPopoverContent type="collaborator" user={user} />
    </Popover>
  );
};

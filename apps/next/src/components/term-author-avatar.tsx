import type { FacingTerm } from "@quenti/interfaces";

import { Popover, PopoverTrigger, chakra } from "@chakra-ui/react";

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
        <chakra.img
          bg="gray.200"
          _dark={{
            bg: "gray.700",
          }}
          style={{
            minWidth: 24,
            width: 24,
            height: 24,
            overflow: "hidden",
            borderRadius: "50%",
          }}
          src={user.image || ""}
          alt={`${user.username}'s avatar`}
        />
      </PopoverTrigger>
      <CollaboratorPopoverContent type="collaborator" user={user} />
    </Popover>
  );
};

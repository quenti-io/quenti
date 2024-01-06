import type { FacingTerm } from "@quenti/interfaces";

import { Popover, PopoverTrigger } from "@chakra-ui/react";

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
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

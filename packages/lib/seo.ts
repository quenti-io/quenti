import { env } from "@quenti/env/client";
import type { EntityType } from "@quenti/prisma/client";

import { truncateOnWord } from "./text";

export const SEO_IMAGE_DEFAULT = `${env.NEXT_PUBLIC_APP_URL}/og-image.png`;
export const SEO_IMAGE_OG = `${env.NEXT_PUBLIC_APP_URL}/api/og`;

export interface EntityImageProps {
  type: EntityType;
  title: string;
  description: string;
  numItems: number;
  collaborators?: {
    total: number;
    avatars: string[];
  };
  user: {
    image: string;
    username: string;
  };
}

export interface ProfileImageProps {
  username: string;
  image: string;
  name: string | null;
  verified: boolean;
}

export const buildEntityImage = (
  props: EntityImageProps,
  encodeUri = false,
) => {
  const url = [
    `?type=${props.type}`,
    `&title=${encodeURIComponent(props.title)}`,
    `&description=${encodeURIComponent(
      truncateOnWord(props.description, 300),
    )}`,
    `&numItems=${props.numItems}`,
    `&userImage=${encodeURIComponent(props.user.image)}`,
    `&username=${encodeURIComponent(props.user.username)}`,
    props.collaborators ? `&collaborators=${props.collaborators.total}` : [],
    props.collaborators
      ? `&avatars=${encodeURIComponent(
          JSON.stringify(props.collaborators.avatars),
        )}`
      : [],
  ]
    .flat()
    .join("");

  return encodeUri ? encodeURIComponent(url) : url;
};

export const buildProfileImage = (
  props: ProfileImageProps,
  encodeUri = false,
) => {
  const url = [
    "?type=profile",
    `&username=${encodeURIComponent(props.username)}`,
    `&image=${encodeURIComponent(props.image)}`,
    `&name=${encodeURIComponent(props.name ?? "")}`,
    `&verified=${props.verified}`,
  ].join("");

  return encodeUri ? encodeURIComponent(url) : url;
};

import { env } from "@quenti/env/client";
import type { EntityType } from "@quenti/prisma/client";

import { truncateOnWord } from "./text";

export const SEO_IMAGE_DEFAULT = `${env.NEXT_PUBLIC_BASE_URL}/og-image.png`;
export const SEO_IMAGE_OG = `${env.NEXT_PUBLIC_BASE_URL}/api/og`;

export interface EntityImageProps {
  type: EntityType;
  title: string;
  description: string;
  numItems: number;
  user: {
    image: string;
    username: string;
  };
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
  ].join("");

  return encodeUri ? encodeURIComponent(url) : url;
};

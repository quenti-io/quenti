import merge from "lodash.merge";
import { NextSeo, type NextSeoProps } from "next-seo";
import { usePathname } from "next/navigation";

import { BODY_COPY_SEO } from "@quenti/branding";
import { WEBSITE_URL } from "@quenti/lib/constants/url";
import {
  type EntityImageProps,
  type ProfileImageProps,
  SEO_IMAGE_DEFAULT,
  SEO_IMAGE_OG,
  buildEntityImage,
  buildProfileImage,
} from "@quenti/lib/seo";
import { truncateOnWord } from "@quenti/lib/text";
import { canonicalUrl } from "@quenti/lib/url";

export interface HeadSeoProps {
  title: string;
  description?: string;
  canonical?: string;
  hideTitleSuffix?: boolean;
  nextSeoProps?: NextSeoProps;
  entity?: EntityImageProps;
  profile?: ProfileImageProps;
}

const buildSeo = (props: {
  title: string;
  description: string;
  image: string;
  canonical?: string;
}): NextSeoProps => {
  const { title, description, image, canonical } = props;
  return {
    title,
    canonical,
    openGraph: {
      siteName: "Quenti",
      type: "website",
      title,
      description,
      images: [{ url: image }],
    },
    twitter: {
      cardType: "summary_large_image",
    },
    additionalMetaTags: [
      {
        property: "name",
        content: title,
      },
      {
        property: "description",
        content: description,
      },
      {
        name: "description",
        content: description,
      },
      {
        property: "image",
        content: image,
      },
    ],
  };
};

export const HeadSeo: React.FC<HeadSeoProps> = ({
  title: _title,
  description: _description = BODY_COPY_SEO,
  canonical,
  hideTitleSuffix = false,
  nextSeoProps = {},
  entity,
  profile,
}) => {
  const path = usePathname();
  const defaultCanonical = canonicalUrl({
    path,
    origin: WEBSITE_URL,
  });

  const title = `${_title}${!hideTitleSuffix ? " | Quenti" : ""}`;
  const description = truncateOnWord(_description);

  let seoObject = buildSeo({
    title,
    description: description,
    image: SEO_IMAGE_DEFAULT,
    canonical: canonical ?? defaultCanonical,
  });

  if (entity) {
    const ogImage = SEO_IMAGE_OG + buildEntityImage(entity);
    seoObject = buildSeo({
      title,
      description,
      image: ogImage,
      canonical: canonical ?? defaultCanonical,
    });
  }
  if (profile) {
    const ogImage = SEO_IMAGE_OG + buildProfileImage(profile);
    seoObject = buildSeo({
      title,
      description,
      image: ogImage,
      canonical: canonical ?? defaultCanonical,
    });
  }

  const seoProps: NextSeoProps = merge(nextSeoProps, seoObject);

  return <NextSeo {...seoProps} />;
};

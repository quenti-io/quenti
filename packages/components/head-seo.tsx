import merge from "lodash.merge";
import { NextSeo, type NextSeoProps } from "next-seo";
import { usePathname } from "next/navigation";

import { env } from "@quenti/env/client";
import {
  type EntityImageProps,
  SEO_IMAGE_DEFAULT,
  SEO_IMAGE_OG,
  buildEntityImage,
} from "@quenti/lib/seo";
import { truncateOnWord } from "@quenti/lib/text";
import { canonicalUrl } from "@quenti/lib/url";

export interface HeadSeoProps {
  title: string;
  description: string;
  canonical?: string;
  nextSeoProps?: NextSeoProps;
  entity?: EntityImageProps;
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
  title,
  description,
  canonical,
  nextSeoProps = {},
  entity,
}) => {
  const path = usePathname();
  const defaultCanonical = canonicalUrl({
    path,
    origin: env.NEXT_PUBLIC_BASE_URL,
  });

  const truncated = truncateOnWord(description);
  let seoObject = buildSeo({
    title,
    description: truncated,
    image: SEO_IMAGE_DEFAULT,
    canonical: canonical ?? defaultCanonical,
  });

  if (entity) {
    const ogImage = SEO_IMAGE_OG + buildEntityImage(entity);
    seoObject = buildSeo({
      title,
      description: truncated,
      image: ogImage,
      canonical: canonical ?? defaultCanonical,
    });
  }

  const seoProps: NextSeoProps = merge(nextSeoProps, seoObject);

  return <NextSeo {...seoProps} />;
};

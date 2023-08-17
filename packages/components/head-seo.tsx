import { NextSeo, type NextSeoProps } from "next-seo";
import { usePathname } from "next/navigation";

import { env } from "@quenti/env/client";
import { truncateOnWord } from "@quenti/lib/text";
import { canonicalUrl } from "@quenti/lib/url";

export interface HeadSeoProps {
  title: string;
  description: string;
  canonical?: string;
  nextSeoProps?: NextSeoProps;
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
}) => {
  const path = usePathname();
  const defaultCanonical = canonicalUrl({
    path,
    origin: env.NEXT_PUBLIC_BASE_URL,
  });

  const truncated = truncateOnWord(description);
  const seoObject = buildSeo({
    title,
    description: truncated,
    image: `${env.NEXT_PUBLIC_BASE_URL}/og-image.png`,
    canonical: canonical ?? defaultCanonical,
  });

  return <NextSeo {...seoObject} />;
};

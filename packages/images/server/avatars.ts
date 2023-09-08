import { HeadObjectCommand } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { env } from "@quenti/env/server";

import { S3, USERS_BUCKET } from ".";

export const getPresignedAvatarUrl = async (
  userId: string,
): Promise<string> => {
  if (!S3) return "";

  const presigned = await createPresignedPost(S3, {
    Bucket: USERS_BUCKET,
    Key: `${userId}/avatar.png`,
    Expires: 300,
    Fields: {
      acl: "public-read",
    },
    Conditions: [
      {
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=60",
        "Content-Type": "image/png",
      },
    ],
  });

  return presigned.url;
};

export const getUserAvatarUrl = async (userId: string) => {
  if (!S3) return null;

  try {
    await S3.send(
      new HeadObjectCommand({
        Bucket: USERS_BUCKET,
        Key: `${userId}/avatar.png`,
      }),
    );

    return `${env.USERS_BUCKET_URL}/${userId}/avatar.png`;
  } catch {
    return null;
  }
};

import { S3Client } from "@aws-sdk/client-s3";

import { env } from "@quenti/env/server";

export const USERS_BUCKET = env.USERS_BUCKET_NAME || "users";
export const ASSETS_BUCKET = env.ASSETS_BUCKET_NAME || "assets";

export * from "./avatars";
export * from "./assets";
export * from "./terms";
export * from "./thumbhash";

const hasEnv =
  !!env.R2_ACCOUNT_ID &&
  !!env.R2_ACCESS_KEY_ID &&
  !!env.R2_SECRET_ACCESS_KEY &&
  !!env.USERS_BUCKET_URL &&
  !!env.ASSETS_BUCKET_NAME;

export const S3 = hasEnv
  ? new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID!,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
      },
    })
  : null;

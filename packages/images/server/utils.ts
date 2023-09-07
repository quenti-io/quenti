import crypto from "crypto";

export const md5Hash = (data: string | Buffer) => {
  return crypto.createHash("md5").update(data).digest("hex");
};

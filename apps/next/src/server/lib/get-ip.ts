import type { NextApiRequest } from "next";

export const parseIp = (value: string | string[]) => {
  return Array.isArray(value) ? value[0] : value.split(",")[0];
};

export const getIp = (req: Request | NextApiRequest) => {
  let xff =
    req instanceof Request
      ? req.headers.get("cf-connecting-ip")
      : req.headers["cf-connecting-ip"];

  if (!xff) {
    xff =
      req instanceof Request
        ? req.headers.get("x-real-ip")
        : req.headers["x-real-ip"];
  }

  return xff ? parseIp(xff) ?? "127.0.0.1" : "127.0.0.1";
};

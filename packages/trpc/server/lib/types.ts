import type { Session } from "next-auth";
import type { AxiomAPIRequest } from "next-axiom";

import type { PrismaClient } from "@quenti/prisma/client";

export type HandlerInput = object;

export type UserContext = {
  req: AxiomAPIRequest;
  session: {
    user: Session["user"];
  };
  prisma: PrismaClient;
};

export type DefaultContext = {
  req: AxiomAPIRequest;
  session: Session | null;
  prisma: PrismaClient;
};

export type NonNullableUserContext = {
  req: AxiomAPIRequest;
  session: {
    user: NonNullable<Session["user"]>;
  };
  prisma: PrismaClient;
};

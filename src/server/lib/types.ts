import type { PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import type { AxiomAPIRequest } from "next-axiom";

export type HandlerInput = object;

export type UserContext = {
  req: AxiomAPIRequest;
  session: {
    user: Session["user"];
  };
  prisma: PrismaClient;
};

export type NonNullableUserContext = {
  req: AxiomAPIRequest;
  session: {
    user: NonNullable<Session["user"]>;
  };
  prisma: PrismaClient;
};

import type { GetServerSidePropsContext as Next } from "next";
import type { AxiomAPIRequest } from "next-axiom";

export type GetServerSidePropsContext = Next & {
  req: AxiomAPIRequest;
};

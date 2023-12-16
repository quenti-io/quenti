import type { GetServerSidePropsContext } from "next";

import { db, eq } from "@quenti/drizzle";
import { classJoinCode as classJoinCodeTable } from "@quenti/drizzle/schema";

export const runtime = "experimental-edge";

const ClassResolver = ({}) => {
  return <div></div>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!db) return { props: { class: null } };

  const id = ctx.query?.id as string;

  const classJoinCode = await db.query.classJoinCode.findFirst({
    where: eq(classJoinCodeTable.id, id.substring(1)),
    with: {
      class: true,
    },
  });

  if (!classJoinCode) return { props: { class: null } };

  return { props: { class: classJoinCode.class } };
};

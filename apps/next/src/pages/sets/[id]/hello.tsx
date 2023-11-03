import type { GetServerSidePropsContext } from "next";

import { prisma } from "@quenti/prisma";

import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/main-layout";

const Hello = () => {
  return <div>hello</div>;
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // const session = await getServerAuthSession(ctx);
  // const userId = session?.user?.id;

  const set = await prisma.studySet.findUnique({
    where: {
      id: ctx.query?.id as string,
    },
    select: {
      id: true,
      title: true,
      description: true,
      visibility: true,
      user: {
        select: {
          id: true,
          username: true,
          image: true,
        },
      },
      _count: {
        select: {
          terms: true,
        },
      },
    },
  });

  if (!set) return { props: { set: null } };

  return {
    props: {
      set,
    },
  };
};

Hello.PageWrapper = PageWrapper;
Hello.getLayout = getLayout;

export default Hello;

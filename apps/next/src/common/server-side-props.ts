import type { GetServerSideProps } from "next";

// eslint-disable-next-line @typescript-eslint/require-await
export const singleIdServerSideProps: GetServerSideProps = async (ctx) => {
  const url = ctx.resolvedUrl;
  const id = url.match(/(c[a-z0-9]{24}|_[a-zA-Z0-9]{10})/)?.[0];

  return {
    props: {
      id,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/require-await
export const folderServerSideProps: GetServerSideProps = async (ctx) => {
  const url = ctx.resolvedUrl;
  const segments = url.split("/").filter((s) => s.length);
  const username = segments[1];

  if (!username?.startsWith("@")) {
    return {
      props: {},
    };
  }

  return {
    props: {
      folderData: {
        username: username.slice(1),
        idOrSlug: segments[3],
      },
    },
  };
};

import dynamic from "next/dynamic";

const LazyInternal = dynamic(
  () => import("./lazy-internal").then((mod) => mod.default),
  {
    ssr: false,
  },
);

export const LazyWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return <LazyInternal>{children}</LazyInternal>;
};

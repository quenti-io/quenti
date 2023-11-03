import { useRouter } from "next/router";
import React from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

export const TopLoadingBar = () => {
  const router = useRouter();

  const barRef = React.useRef<LoadingBarRef>(null);

  React.useEffect(() => {
    const setPageRegexp = /^\/c([a-zA-Z0-9_-]{24})$/;

    router.events.on("routeChangeStart", (url) => {
      if (setPageRegexp.test(url as string))
        barRef.current?.continuousStart(20, 750);
    });
    router.events.on("routeChangeComplete", (url) => {
      if (setPageRegexp.test(url as string)) barRef.current?.complete();
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LoadingBar
      ref={barRef}
      color="#ffa54c"
      height={3}
      waitingTime={500}
      transitionTime={500}
    />
  );
};

export default TopLoadingBar;

import { useRouter } from "next/router";
import React from "react";

export const HistoryContext = React.createContext<string[]>([]);

export const HistoryProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const [history, setHistory] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (!router.isReady) return;

    setHistory((h) => [...h, router.pathname]);
  }, [router.isReady, router.pathname]);

  return (
    <HistoryContext.Provider value={history}>
      {children}
    </HistoryContext.Provider>
  );
};

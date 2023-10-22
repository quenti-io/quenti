import React from "react";

import { Footer } from "./footer";

export const WithFooter: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div>
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          marginTop: "40px",
          paddingBottom: "120px",
        }}
      >
        {children}
      </div>
      <Footer />
    </div>
  );
};

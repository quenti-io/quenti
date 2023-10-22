import { Body, Container } from "@react-email/components";
import React from "react";

export const BodyContainer: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <Body style={main}>
    <Container
      className="mt-6 w-[620px] rounded-xl border-[2px] border-solid border-gray-200 bg-white shadow-lg"
      style={{
        maxWidth: "90vh",
      }}
    >
      {children}
    </Container>
  </Body>
);

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

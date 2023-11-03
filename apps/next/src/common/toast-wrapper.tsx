import { ToastOptionProvider, ToastProvider } from "@chakra-ui/toast";

export const ToastWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <ToastOptionProvider
      value={{
        containerStyle: {
          marginBottom: "2rem",
          marginTop: "-1rem",
        },
      }}
    >
      {children}
      <ToastProvider />
    </ToastOptionProvider>
  );
};

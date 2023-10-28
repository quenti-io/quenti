import { Fade } from "@chakra-ui/react";

export const EnterWrapper: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  return (
    <Fade
      in
      initial={{
        opacity: -1,
        transform: "translateY(-16px)",
      }}
      animate={{
        opacity: 1,
        transform: "translateY(0)",
        transition: {
          delay: 0.1,
          duration: 0.3,
          ease: "easeOut",
        },
      }}
    >
      {children}
    </Fade>
  );
};

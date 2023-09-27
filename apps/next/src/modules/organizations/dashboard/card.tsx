import {
  type CardProps,
  Card as ChakraCard,
  forwardRef,
} from "@chakra-ui/react";

export const Card = forwardRef<CardProps, "div">(({ children, ...props }) => {
  return (
    <ChakraCard
      px="6"
      py="4"
      rounded="xl"
      borderWidth="1px"
      bg="white"
      borderColor="gray.200"
      shadow="sm"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.750",
      }}
      {...props}
    >
      {children}
    </ChakraCard>
  );
});

import {
  Divider as ChakraDivider,
  Heading as ChakraHeading,
  Modal as ChakraModal,
  ModalBody as ChakraModalBody,
  ModalContent as ChakraModalContent,
  ModalFooter as ChakraModalFooter,
  ModalOverlay as ChakraModalOverlay,
  type ComponentWithAs,
  type HeadingProps,
  type ModalProps,
  Stack,
  type StackProps,
  forwardRef,
  useColorModeValue,
} from "@chakra-ui/react";

const Content = function ModalBody({
  children,
}: {
  children?: JSX.Element | JSX.Element[];
}) {
  const modalBg = useColorModeValue("white", "gray.800");

  return (
    <ChakraModalContent rounded="xl" bg={modalBg} shadow="xl">
      {children}
    </ChakraModalContent>
  );
};

const Body = forwardRef<StackProps, "div">(({ children, ...props }) => {
  return (
    <ChakraModalBody py="8" px="10">
      <Stack spacing="6" {...props}>
        {children}
      </Stack>
    </ChakraModalBody>
  );
});

const Heading = forwardRef<HeadingProps, "h1">(({ children, ...props }) => {
  return (
    <ChakraHeading size="lg" {...props}>
      {children}
    </ChakraHeading>
  );
});

const Divider = function ModalDivider() {
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  return <ChakraDivider borderColor={dividerColor} borderBottomWidth="2px" />;
};

const BodySeparator = function ModalBodySeparator() {
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  return (
    <ChakraDivider
      borderColor={dividerColor}
      borderBottomWidth="2px"
      w="calc(100% + 80px)"
      ml="-40px"
    />
  );
};

const Footer = function ModalFooter({
  children,
}: {
  children?: JSX.Element | JSX.Element[];
}) {
  return (
    <ChakraModalFooter px="10" py="6">
      {children}
    </ChakraModalFooter>
  );
};

export const Modal = forwardRef<ModalProps, "div">(
  ({ isOpen, onClose, children, ...props }) => {
    return (
      <ChakraModal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        isCentered
        {...props}
      >
        {children}
      </ChakraModal>
    );
  },
) as ComponentWithAs<"div", ModalProps> & {
  Overlay: typeof Overlay;
  Content: typeof Content;
  Body: typeof Body;
  Heading: typeof Heading;
  Divider: typeof Divider;
  BodySeparator: typeof BodySeparator;
  Footer: typeof Footer;
};

const Overlay = function ModalOverlay() {
  const background = useColorModeValue("blackAlpha.400", "blackAlpha.600");

  return (
    <ChakraModalOverlay backdropFilter="blur(6px)" background={background} />
  );
};

Modal.Overlay = Overlay;
Modal.Content = Content;
Modal.Body = Body;
Modal.Heading = Heading;
Modal.Divider = Divider;
Modal.BodySeparator = BodySeparator;
Modal.Footer = Footer;

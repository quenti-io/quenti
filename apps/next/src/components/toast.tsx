import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  type ToastProps,
  chakra,
  useColorModeValue,
} from "@chakra-ui/react";

export const Toast: React.FC<ToastProps> = (props) => {
  const { status, id, title, description, colorScheme, icon } = props;

  const ids = id
    ? {
        root: `toast-${id}`,
        title: `toast-${id}-title`,
        description: `toast-${id}-description`,
      }
    : undefined;

  const color = useColorModeValue(`${colorScheme}.400`, `${colorScheme}.200`);

  return (
    <Alert
      addRole={false}
      status={status}
      variant="solid"
      id={ids?.root}
      alignItems="start"
      borderRadius="lg"
      boxShadow="xl"
      paddingEnd={8}
      textAlign="start"
      borderWidth="2px"
      width="auto"
      colorScheme={colorScheme}
      background="white"
      borderColor="gray.100"
      color="gray.900"
      _dark={{
        background: "gray.750",
        borderColor: "gray.700",
        color: "white",
      }}
    >
      <AlertIcon color={color}>{icon}</AlertIcon>
      <chakra.div flex="1" maxWidth="100%">
        {title && (
          <AlertTitle fontWeight={700} id={ids?.title}>
            {title}
          </AlertTitle>
        )}
        {description && (
          <AlertDescription id={ids?.description} display="block">
            {description}
          </AlertDescription>
        )}
      </chakra.div>
    </Alert>
  );
};

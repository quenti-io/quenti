import { Text } from "@react-email/components";

export const Content: React.FC<React.PropsWithChildren> = ({ children }) => (
  <Text className="mt-4 text-lg text-gray-600">{children}</Text>
);

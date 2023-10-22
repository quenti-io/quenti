import { Heading as EmailHeading } from "@react-email/components";

export const Heading: React.FC<React.PropsWithChildren> = ({ children }) => (
  <EmailHeading className="mt-6 text-2xl font-medium text-gray-700">
    {children}
  </EmailHeading>
);

import Link from "next/link";
import React from "react";

import { Flex, SkeletonText, Tab } from "@chakra-ui/react";

interface SkeletonTabProps {
  isLoaded: boolean;
  href: string;
}
export const SkeletonTab: React.FC<
  React.PropsWithChildren<SkeletonTabProps>
> = ({ isLoaded, children, href }) => {
  return (
    <Link href={href}>
      <Tab px="0" bg="none" fontWeight={600} pb="3">
        <Flex alignItems="center" h="21px">
          <SkeletonText isLoaded={isLoaded} noOfLines={1} skeletonHeight="4">
            {children}
          </SkeletonText>
        </Flex>
      </Tab>
    </Link>
  );
};

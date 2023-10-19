import { outfit } from "@quenti/lib/chakra-theme";

import {
  Card,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";

export interface GridStatProps {
  value: number | string;
  label: string;
  bg?: string;
}

export const GridStat: React.FC<GridStatProps> = ({ value, label, bg }) => {
  const defaultBg = useColorModeValue("white", "gray.750");

  return (
    <GridItem>
      <Card
        bg={bg ?? defaultBg}
        pt="3"
        pb="4"
        shadow="lg"
        rounded="2xl"
        borderBottomWidth="3px"
        borderColor="orange.300"
      >
        <Stat textAlign="center">
          <StatNumber
            fontSize={{ base: "3xl", md: "4xl" }}
            fontFamily={outfit.style.fontFamily}
            fontWeight={800}
          >
            {value}
          </StatNumber>
          <StatLabel color="gray.500" fontWeight={600}>
            {label}
          </StatLabel>
        </Stat>
      </Card>
    </GridItem>
  );
};

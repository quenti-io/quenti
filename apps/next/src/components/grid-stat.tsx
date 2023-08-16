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
        pb="4"
        shadow="lg"
        rounded="2xl"
        borderWidth="2px"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        borderBottomColor="orange.300"
        borderBottomWidth="3px"
      >
        <Stat textAlign="center">
          <StatNumber
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            fontFamily="Outfit"
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

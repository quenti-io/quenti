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
  const text = useColorModeValue("gray.600", "gray.400");

  return (
    <GridItem>
      <Card
        bg={bg}
        pb="4"
        shadow="lg"
        rounded="lg"
        borderBottomColor="orange.300"
        borderBottomWidth="4px"
      >
        <Stat textAlign="center">
          <StatNumber
            fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
            fontFamily="Outfit"
            fontWeight={800}
          >
            {value}
          </StatNumber>
          <StatLabel color={text} fontWeight={700}>
            {label}
          </StatLabel>
        </Stat>
      </Card>
    </GridItem>
  );
};

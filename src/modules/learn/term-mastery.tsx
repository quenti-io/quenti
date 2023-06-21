import {
  Card,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { useTermMastery } from "../../hooks/use-term-mastery";

export const TermMastery = () => {
  const [unstudied, familiar, mastered] = useTermMastery();

  return (
    <Grid gridTemplateColumns="1fr 1fr 1fr" gap={4} w="full">
      <GridStat label="Unstudied" value={unstudied?.length || 0} />
      <GridStat label="Familiar" value={familiar?.length || 0} />
      <GridStat label="Mastered" value={mastered?.length || 0} />
    </Grid>
  );
};

export interface GridStatProps {
  value: number | string;
  label: string;
  bg?: string
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

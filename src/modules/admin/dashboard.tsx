import {
  Grid,
  GridItem,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  useColorModeValue,
} from "@chakra-ui/react";
import { useAdmin } from "../../hooks/use-admin";

export const AdminDashboard = () => {
  const data = useAdmin();

  return (
    <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
      <Item label="Users" value={data.users.length} />
      <Item label="Study Sets" value={data.studySets} />
      <Item label="Terms" value={data.terms} />
      <Item label="Folders" value={data.folders} />
      <Item label="Experiences" value={data.experiences} />
      <Item label="Starred Terms" value={data.starredTerms} />
      <Item label="Studiable Terms" value={data.studiableTerms} />
    </Grid>
  );
};

interface ItemProps {
  label: string;
  value: number;
}

const Item: React.FC<ItemProps> = ({ label, value }) => {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.750");

  return (
    <GridItem
      bg={bg}
      py="3"
      px="6"
      rounded="lg"
      shadow="lg"
      border="2px"
      borderColor={border}
      transition="all ease-in-out 150ms"
      _hover={{
        borderBottomColor: "blue.300"
      }}
    >
      <Stat>
        <StatLabel>{label}</StatLabel>
        <StatNumber color="blue.300">
          <Heading size="xl">{value.toLocaleString()}</Heading>
        </StatNumber>
      </Stat>
    </GridItem>
  );
};

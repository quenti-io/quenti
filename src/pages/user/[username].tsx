import { Container, Heading } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { ComponentWithAuth } from "../../components/auth-component";

const UserPage: ComponentWithAuth = () => {
  const router = useRouter();
  const username = router.query.username as string;

  return (
    <Container maxW="7xl" marginTop="10">
      <Heading>{username}</Heading>
    </Container>
  );
};

UserPage.authenticationEnabled = true;

export default UserPage;

export { getServerSideProps } from "../../components/chakra";

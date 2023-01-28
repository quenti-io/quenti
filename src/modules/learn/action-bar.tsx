import {
  Box,
  Button,
  Container,
  Flex,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { useLearnContext } from "../../stores/use-learn-store";
import { AnyKeyPressLayer } from "./any-key-press-layer";

export const ActionBar = () => {
  const status = useLearnContext((s) => s.status);
  const roundSummary = useLearnContext((s) => s.roundSummary);
  const acknowledgeIncorrect = useLearnContext((s) => s.acknowledgeIncorrect);
  const nextRound = useLearnContext((s) => s.nextRound);

  const visible = status == "incorrect" || !!roundSummary;
  const action = status == "incorrect" ? acknowledgeIncorrect : nextRound;

  const backgroundColor = useColorModeValue("gray.200", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.400");

  return (
    <>
      {visible && <AnyKeyPressLayer onSubmit={action} />}
      <AnimatePresence>
        {visible && (
          <motion.div
            style={{ position: "fixed", bottom: 0, width: "100%" }}
            initial={{ translateY: 80 }}
            animate={{ translateY: 0 }}
            exit={{ translateY: 80 }}
          >
            <Box w="full" bg={backgroundColor}>
              <Container maxW="4xl" py="4">
                <Flex alignItems="center" justifyContent="space-between">
                  <Text fontSize="lg" color={textColor}>
                    Press any key to continue
                  </Text>
                  <Button size="lg" onClick={action}>
                    Continue
                    {roundSummary && ` to round ${roundSummary.round + 2}`}
                  </Button>
                </Flex>
              </Container>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

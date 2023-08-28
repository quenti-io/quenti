import {
  Box,
  Button,
  ButtonGroup,
  HStack,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";

import { Modal } from "../../components/modal";

export interface TestSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TestSettingsModal: React.FC<TestSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body>
          <Modal.Heading>Settings</Modal.Heading>
          <HStack
            gap={{ base: 4, sm: 8 }}
            flexDir={{ base: "column", sm: "row" }}
            justifyContent="space-between"
          >
            <Stack spacing="0">
              <Text fontWeight={600}>Questions</Text>
            </Stack>
            <Slider defaultValue={60} min={0} max={300} step={30}>
              <SliderTrack
                bg="gray.100"
                _dark={{
                  bg: "gray.700",
                }}
                h="1"
                rounded="full"
              >
                <Box position="relative" right={10} />
                <SliderFilledTrack bg="blue.300" />
              </SliderTrack>
              <SliderThumb
                boxSize={12}
                borderWidth="4px"
                bg="white"
                borderColor="blue.300"
                _dark={{
                  bg: "gray.800",
                  borderColor: "blue.300",
                }}
                shadow="md"
                transitionProperty="transform,border-width"
                transitionDuration="normal"
                _active={{
                  transform: `translateY(-50%) scale(1.3)`,
                  borderWidth: "3px",
                }}
              >
                <Text
                  color="blue.300"
                  fontSize="sm"
                  fontWeight={700}
                  fontFamily="heading"
                >
                  20
                </Text>
              </SliderThumb>
            </Slider>
          </HStack>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" colorScheme="gray">
              Cancel
            </Button>
            <Button>Start test</Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

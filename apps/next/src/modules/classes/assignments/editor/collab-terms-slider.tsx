import {
  Box,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/react";

import { SkeletonLabel } from "../../../../components/skeleton-label";
import { useProtectedRedirect } from "../../use-protected-redirect";

export interface CollabTermsSliderProps {
  isLoaded?: boolean;
  minTerms: number;
  maxTerms: number;
  onChange: (min: number, max: number) => void;
}

export const CollabTermsSlider: React.FC<CollabTermsSliderProps> = ({
  minTerms,
  maxTerms,
  onChange,
  isLoaded: propsIsLoaded,
}) => {
  const _isLoaded = useProtectedRedirect();
  const isLoaded = propsIsLoaded !== undefined ? propsIsLoaded : _isLoaded;

  return (
    <Stack spacing="8">
      <Stack spacing="0">
        <SkeletonLabel isLoaded={isLoaded}>
          Minimum/maximum number of terms per user
        </SkeletonLabel>
        <Skeleton isLoaded={isLoaded} fitContent>
          <Text
            fontSize="sm"
            color="gray.600"
            _dark={{
              color: "gray.400",
            }}
          >
            Students will need to contribute this many terms to submit the
            assignment.
          </Text>
        </Skeleton>
      </Stack>
      <Box>
        <RangeSlider
          // eslint-disable-next-line jsx-a11y/aria-proptypes
          aria-label={["Min terms per member", "Max terms per member"]}
          display="block"
          value={[minTerms, maxTerms]}
          max={20}
          min={1}
          m="0"
          onChange={([min, max]) => onChange(min!, max!)}
        >
          <RangeSliderTrack
            bg="gray.100"
            _dark={{
              bg: "gray.700",
            }}
            h="2px"
            rounded="full"
          >
            <RangeSliderFilledTrack
              bg={isLoaded ? "blue.300" : "gray.400"}
              _dark={{
                bg: isLoaded ? "blue.300" : "gray.600",
              }}
            />
          </RangeSliderTrack>
          <Thumb index={0} value={minTerms} isLoaded={isLoaded} />
          <Thumb index={1} value={maxTerms} isLoaded={isLoaded} />
        </RangeSlider>
        <Flex
          w="full"
          justifyContent="space-between"
          color="gray.500"
          fontSize="sm"
        >
          <SkeletonLabel isLoaded={isLoaded}>1 term</SkeletonLabel>
          <SkeletonLabel isLoaded={isLoaded}>20 terms</SkeletonLabel>
        </Flex>
      </Box>
    </Stack>
  );
};

const Thumb: React.FC<{ index: number; value: number; isLoaded: boolean }> = ({
  index,
  value,
  isLoaded,
}) => {
  return (
    <RangeSliderThumb
      boxSize={8}
      borderWidth="2px"
      bg="white"
      borderColor={isLoaded ? "blue.300" : "gray.400"}
      _dark={{
        bg: "gray.800",
        borderColor: isLoaded ? "blue.300" : "gray.600",
      }}
      shadow="md"
      transitionProperty="transform,border-width"
      transitionDuration="normal"
      _active={{
        transform: `translateY(-50%) scale(1.3)`,
        borderWidth: "1.5px",
      }}
      index={index}
      pointerEvents={!isLoaded ? "auto" : "none"}
      position="relative"
    >
      <Skeleton
        rounded="full"
        position="absolute"
        isLoaded={isLoaded}
        top="0"
        left="0"
        w="full"
        h="full"
      />
      <Text
        color="gray.900"
        _dark={{
          color: "white",
        }}
        fontSize="xs"
        fontWeight={700}
        fontFamily="heading"
        visibility={isLoaded ? "visible" : "hidden"}
      >
        {value}
      </Text>
    </RangeSliderThumb>
  );
};

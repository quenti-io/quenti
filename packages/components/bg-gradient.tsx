import { Box, type BoxProps } from "@chakra-ui/react";

const gradient = (hsl: string, direction = "top") => `
  linear-gradient(
    to ${direction},
    hsl(${hsl}) 0%,
    hsla(${hsl}, 0.987) 8.1%,
    hsla(${hsl}, 0.951) 15.5%,
    hsla(${hsl}, 0.896) 22.5%,
    hsla(${hsl}, 0.825) 29%,
    hsla(${hsl}, 0.741) 35.3%,
    hsla(${hsl}, 0.648) 41.2%,
    hsla(${hsl}, 0.55) 47.1%,
    hsla(${hsl}, 0.45) 52.9%,
    hsla(${hsl}, 0.352) 58.8%,
    hsla(${hsl}, 0.259) 64.7%,
    hsla(${hsl}, 0.175) 71%,
    hsla(${hsl}, 0.104) 77.5%,
    hsla(${hsl}, 0.049) 84.5%,
    hsla(${hsl}, 0.013) 91.9%,
    hsla(${hsl}, 0) 100%
  )
`;

export const BgGradient: React.FC<
  BoxProps & { hsl: string; darkHsl?: string; direction?: string }
> = (props) => {
  return (
    <Box
      backgroundImage={gradient(props.hsl, props.direction)}
      _dark={{
        backgroundImage: gradient(props.darkHsl ?? props.hsl, props.direction),
      }}
      {...props}
    />
  );
};

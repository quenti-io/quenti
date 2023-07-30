import { Img } from "@react-email/components";
import { env } from "../../env/server.mjs";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  width = 42,
  height = 42,
  className = "h-[42px] w-[42px] rounded-[21px]",
}) => {
  return (
    <Img
      src={`${env.NEXT_PUBLIC_BASE_URL}/avatars/quenti.png`}
      width={width}
      height={height}
      alt="Quenti"
      className={className}
    />
  );
};

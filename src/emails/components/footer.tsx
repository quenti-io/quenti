import { Hr, Link } from "@react-email/components";
import { env } from "../../env/server.mjs";
import { Logo } from "./logo";

interface FooterProps {
  withLogo?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ withLogo = false }) => {
  return (
    <>
      <Hr className="mb-6 mt-10 border-[2px] border-gray-200" />
      <div className="flex w-full">
        <Link
          href={env.NEXT_PUBLIC_BASE_URL}
          className="w-1/2 text-sm text-gray-400"
        >
          Quenti
        </Link>
        {withLogo && (
          <div className="w-1/2">
            <Logo
              width={24}
              height={24}
              className="float-right h-6 w-6 rounded-[12px]"
            />
          </div>
        )}
      </div>
    </>
  );
};

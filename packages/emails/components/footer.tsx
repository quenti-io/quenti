import { Hr, Link } from "@react-email/components";

import { WEBSITE_URL } from "@quenti/lib/constants/url";

import { Logo } from "./logo";

interface FooterProps {
  withLogo?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ withLogo = false }) => {
  return (
    <div>
      <Hr className="w-full border-[2px] border-gray-200" />
      <div className="flex px-8 pb-5 pt-3">
        <Link href={WEBSITE_URL} className="w-1/2 text-sm text-gray-400">
          Quenti
        </Link>
        {withLogo && (
          <div className="w-1/2">
            <Logo width={24} height={24} className="float-right h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

import Link from 'next/link';

export function MobileFooterLinks() {
  return (
    <div className="text-center text-sm font-medium text-text-secondary">
      <div className="flex items-center justify-center gap-2">
        <Link href="#" className="hover:underline">
          Help
        </Link>
        <span>•</span>
        <Link href="#" className="hover:underline">
          Terms & Conditions
        </Link>
        <span>•</span>
        <Link href="#" className="hover:underline">
          Privacy Policy
        </Link>
      </div>
      <div className="my-5 border-[1px] border-border-stroke-regular"></div>
      <p className="text-sm font-medium">All rights reserved @2025</p>
    </div>
  );
}

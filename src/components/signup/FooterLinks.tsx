import Link from 'next/link';

export function FooterLinks() {
  return (
    <div className="flex justify-end items-center gap-2 text-sm font-medium text-[#787878]">
      <Link href="#">Help</Link>
      <span className="w-[6px] h-[6px] bg-[#787878] rounded-full"></span>
      <Link href="#">Terms & Conditions</Link>
      <span className="w-[6px] h-[6px] bg-[#787878] rounded-full"></span>
      <Link href="#">Privacy Policy</Link>
    </div>
  );
}

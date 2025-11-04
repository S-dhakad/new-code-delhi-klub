import Image from 'next/image';
import Link from 'next/link';

export function Sidebar({
  hidecreateCommunityButton,
}: {
  hidecreateCommunityButton?: boolean;
}) {
  return (
    <div
      className="md:flex text-white flex-col justify-between p-8 rounded-3xl bg-center bg-cover h-full"
      style={{ backgroundImage: "url('/community.png')" }}
    >
      <div>
        <h1 className="text-[63px] font-extrabold text-white">
          <Image src="/klubWhite.png" alt="klub logo" width={110} height={56} />
        </h1>
        <span className="border-b w-[135px] flex my-3 border-[#FFFFFF]"></span>
        <p className="mt-3 text-lg font-normal">
          A Platform to <span className="font-semibold underline">Create</span>,{' '}
          <span className="font-semibold underline">Manage</span> &{' '}
          <span className="font-semibold underline">Monetize</span> your
          Community
        </p>
      </div>
      <div>
        {hidecreateCommunityButton ? null : (
          <Link
            href="/creator-signup"
            className="mt-10 inline-block text-sm font-medium underline hover:text-gray-300"
          >
            Create a Community →
          </Link>
        )}
        <span className="border-b w-full flex my-6"></span>
        <p className="text-xs font-medium text-[#CBCBCB] opacity-60">
          All rights reserved ©2025
        </p>
      </div>
    </div>
  );
}

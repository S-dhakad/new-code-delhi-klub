import Link from 'next/link';

export function MobileSignupHero({ type }: { type: 'signup' | 'creator' }) {
  const signup = type === 'signup';
  return (
    <div className="rounded-2xl overflow-hidden shadow-sm bg-[#0A0A0A]">
      <div
        className="relative w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/community.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/20" />
        <div
          className={`relative h-full w-full pt-10 pl-[22px] ${signup ? 'pb-14' : 'pb-8'}  text-white`}
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-5xl logo">Klub</h1>
            <div className="h-[1px] w-[120px] bg-white"></div>
            <p className="text-xl font-normal max-w-[240px]">
              A Platform to{' '}
              <span className="underline underline-offset-2 decoration-white/70">
                Create
              </span>
              ,{' '}
              <span className="underline underline-offset-2 decoration-white/70">
                Manage
              </span>{' '}
              &{' '}
              <span className="underline underline-offset-2 decoration-white/70">
                Monetize
              </span>{' '}
              your Community
            </p>
          </div>
          {signup ? (
            <Link
              href="/creator-signup"
              className="mt-[90px] text-sm w-max font-medium inline-flex items-center gap-1 text-white/90 hover:text-white"
            >
              <span className="underline underline-offset-2">
                Create a Community
              </span>
              <span aria-hidden>→</span>
            </Link>
          ) : (
            <div className="mt-[90px]">
              <div className="h-[1px] w-[120px] bg-white"></div>
              <p className="mt-[26px] text-xs font-medium text-text-secondary">
                All rights reserved @2025
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

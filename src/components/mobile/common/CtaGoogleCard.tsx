import Link from 'next/link';
import { SubscribeBadge } from 'src/components/mobile/common/SubscribeBadge';
import { GoogleButton } from 'src/components/mobile/signup/GoogleButton';
import { BenefitsCard } from 'src/components/mobile/signup/BenefitsCard';
import { MobileThumbnails } from 'src/components/mobile/signup/Thumbnails';
import PricingCard from 'src/components/signup/PricingCard';

export default function CtaGoogleCard({
  type,
}: {
  type: 'login' | 'signup' | 'creator';
}) {
  const login = type === 'login';
  return (
    <div
      className="rounded-2xl border border-border-stroke-regular bg-white px-[14px] py-10 bg-cover bg-no-repeat"
      style={{
        backgroundImage: "url('/wave.png')",
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <SubscribeBadge type={type} />

      <h1 className="mt-3 text-[22px] font-semibold leading-tight">
        <span className={login ? 'text-primary' : ''}>
          {login ? 'Sign in ' : "Let's "}
        </span>
        <span className={login ? '' : 'text-primary'}>
          {login ? 'to your account' : 'Create your account'}
        </span>
      </h1>

      <p className="mt-3 font-medium text-text-secondary">
        {login ? 'Welcome back!' : 'The first step to get you started'}
      </p>

      <div className="mt-5">
        <GoogleButton type={type} />
      </div>

      <p className="mt-4 text-sm font-medium text-text-secondary">
        {login ? "Don't have an account," : 'Already have an account,'}
        <Link
          href={login ? '/signup' : '/login'}
          className="ml-1 font-medium text-[#0B63F8] underline underline-offset-2"
        >
          {login ? 'Sign up' : 'Sign in'}
        </Link>
      </p>

      {/* Signup page */}
      {!login && (
        <>
          {type === 'signup' && (
            <div className="my-5 border-[1px] border-border-stroke-regular"></div>
          )}

          {/* Benefits */}
          {type === 'signup' ? (
            <BenefitsCard />
          ) : (
            <div className="mt-5 py-10 px-6 bg-white rounded-2xl border border-border-stroke-regular">
              <PricingCard />
            </div>
          )}

          {/* Thumbnails */}
          {type === 'signup' && (
            <div className="mt-5">
              <MobileThumbnails />
            </div>
          )}

          {/* Terms */}
          <p className="mt-5 border-t border-border-stroke-regular pt-6 font-medium text-text-secondary">
            By Signing up with us, you agree to Klub&apos;s
            <Link href="#" className="ml-1 underline text-text-primary">
              Terms of Service
            </Link>
            <span className="mx-1">&</span>
            <Link href="#" className="underline text-text-primary">
              Privacy Policy
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

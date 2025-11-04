import { MobileSignupHero } from 'src/components/mobile/signup/Hero';
import { MobileFooterLinks } from 'src/components/mobile/common/FooterLinks';
import CtaGoogleCard from 'src/components/mobile/common/CtaGoogleCard';
import { BenefitsCardLogin } from '../login/BenefitsCardLogin';

export default function Auth({
  type,
}: {
  type: 'login' | 'signup' | 'creator';
}) {
  return (
    <div className="mx-auto max-w-[430px] px-4 py-4">
      {/* Hero */}
      {/* Render on signup and creator-signup */}
      {type !== 'login' && <MobileSignupHero type={type} />}

      {/* Card: CTA + Google */}
      <div className="mt-[30px]">
        <CtaGoogleCard type={type} />
      </div>

      {type === 'login' && (
        <div className="mt-[30px]">
          <BenefitsCardLogin />
        </div>
      )}

      {/* Footer */}
      <div className="mt-[30px]">
        <MobileFooterLinks />
      </div>
    </div>
  );
}

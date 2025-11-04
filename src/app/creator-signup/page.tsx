'use client';

import Link from 'next/link';
import { Card, CardContent } from 'src/components/ui/card';
import React, { Suspense, useEffect } from 'react';
import { Sidebar } from 'src/components/signup/Sidebar';
import { SignupHero } from 'src/components/signup/SignupHero';
import { FooterLinks } from 'src/components/signup/FooterLinks';
import PricingCard from 'src/components/signup/PricingCard';
import { useCreatorRazorpayStore } from 'src/store/creator-subscriber-razorpay.store';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileCreatorSignupPage } from 'src/mobile-pages';
import { Button } from 'src/components/ui/button';

function CreatorSignupPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function CreatorSignupPageContent() {
  const isMobile = useIsMobile();
  const { setInitalizeRazorpay } = useCreatorRazorpayStore();

  // This function sets the Razorpay flag before OAuth redirect
  // The flag persists in localStorage and tells /callback to redirect to /community-profile
  // where the Razorpay payment will be triggered automatically
  // Add background for the body
  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);

  const triggerRazorPay = () => {
    setInitalizeRazorpay(true);
    console.log('triggerRazorPay: Set Razorpay flag for post-OAuth payment');
  };

  // Render mobile view
  if (isMobile) {
    return <MobileCreatorSignupPage />;
  }

  // Render desktop view
  return (
    <div className="max-w-[1253px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      <div className="flex justify-end lg:justify-end mb-6">
        <Button
          type="button"
          className="inline-flex items-center gap-2 rounded-[10px] bg-[#4BD3661A] px-4 py-1 h-[34px] border border-[#ECECEC]"
        >
          <span className="w-3 h-3 rounded-full bg-[#4BD366]" />
          <span className="text-sm font-medium text-[#000000]">Creator</span>
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[269px]">
          <Sidebar hidecreateCommunityButton={true} />
        </aside>

        <main
          className="flex-1 rounded-[20px] border border-[#ECECEC] overflow-hidden bg-center bg-cover"
          style={{
            backgroundImage: "url('/wave.png')",
            backgroundSize: 'auto',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <section className="p-6 sm:p-8 lg:px-[38px] lg:py-[50px] border-b lg:border-b-0 lg:border-[#ECECEC]">
              <Card className="p-0 w-full max-w-full border-none shadow-none bg-transparent h-full">
                <CardContent className="p-0 flex flex-col justify-between h-full">
                  <div>
                    <SignupHero triggerRazorPay={triggerRazorPay} />
                  </div>

                  <p className="mt-6 text-sm font-medium text-[#787878] border-t border-[#DCDCDC] pt-4">
                    By Signing up with us, you agree to Klub’s{' '}
                    <Link href="#" className="underline text-[#000000]">
                      Terms of Service
                    </Link>
                    <span className="mx-1 text-[#000000]">&</span>
                    <Link href="#" className="underline text-[#000000]">
                      Privacy Policy
                    </Link>
                  </p>
                </CardContent>
              </Card>
            </section>

            <section className="p-6 sm:p-8 lg:px-[38px] lg:py-[56px]">
              <Card className="w-full max-w-full border-none shadow-none p-6 sm:p-8 rounded-[20px]">
                <PricingCard />
              </Card>
            </section>
          </div>
        </main>
      </div>

      <div className="mt-8">
        <FooterLinks />
      </div>
    </div>
  );
}

export default function CreatorSignupPage() {
  return (
    <Suspense fallback={<CreatorSignupPageSpinner />}>
      <CreatorSignupPageContent />
    </Suspense>
  );
}

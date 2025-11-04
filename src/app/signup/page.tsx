'use client';

import Link from 'next/link';
import { Button } from 'src/components/ui/button';
import { Card, CardContent } from 'src/components/ui/card';
import React, { Suspense } from 'react';

import { Sidebar } from 'src/components/signup/Sidebar';
import { SignupHero } from 'src/components/signup/SignupHero';
import { Benefits } from 'src/components/signup/Benefits';
import { Thumbnails } from 'src/components/signup/Thumbnails';
import { FooterLinks } from 'src/components/signup/FooterLinks';
import { useEffect } from 'react';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileSignupPage } from 'src/mobile-pages';

function SignupPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function SignupPageContent() {
  const isMobile = useIsMobile();

  // Add background for the body
  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);

  // Render mobile view
  if (isMobile) {
    return <MobileSignupPage />;
  }

  return (
    <div className="max-w-[1253px] mx-auto px-4 sm:px-6 lg:px-0 py-6">
      {/* Top subscribe - keep it right-aligned on larger screens, centered on small */}
      <div className="flex justify-end lg:justify-end mb-6">
        <Button
          variant="ghost"
          className="rounded-[10px] flex items-center gap-1 py-2 px-[10px] bg-[#EDD1171A] text-xs font-medium border border-[#ECECEC]"
        >
          <span className="w-[12px] h-[12px] flex rounded-full bg-[#EDD117]"></span>
          Subscriber
        </Button>
      </div>

      <div className="lg:flex lg:gap-6 min-h-[640px]">
        <aside className="w-full lg:w-[270px] mb-6 lg:mb-0">
          <Sidebar />
        </aside>

        <div
          className="flex-1 rounded-[20px] border border-[#ECECEC] overflow-hidden bg-center bg-cover"
          style={{
            backgroundImage: "url('/wave.png')",
            backgroundSize: 'auto',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
            <section className="relative p-6 sm:p-10 lg:px-[38px] lg:py-[50px] border-r border-[#ECECEC] flex items-stretch">
              <Card className="p-0 w-full max-w-full border-none shadow-none bg-transparent">
                <CardContent className="p-0 flex flex-col justify-between h-full">
                  <div>
                    <SignupHero />
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

            <section className="p-6 sm:p-10 lg:px-[38px] lg:py-[50px] flex flex-col gap-5">
              <Card className="w-full max-w-full border-none shadow-none p-5 sm:p-8">
                <Benefits />
              </Card>

              <div>
                <Thumbnails />
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="mt-[66px]">
        <FooterLinks />
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageSpinner />}>
      <SignupPageContent />
    </Suspense>
  );
}

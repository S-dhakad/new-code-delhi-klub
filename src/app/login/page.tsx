'use client';

import { Card, CardContent } from 'src/components/ui/card';

import { Sidebar } from 'src/components/signup/Sidebar';
import { FooterLinks } from 'src/components/signup/FooterLinks';
import { SigninpHero } from 'src/components/signup/SigninHero';
import { Benefits2 } from 'src/components/signup/Benefits2';
import React, { Suspense, useEffect } from 'react';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileLoginPage } from 'src/mobile-pages';

function LoginPageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}

function LoginPageContent() {
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
    return <MobileLoginPage />;
  }

  // Render desktop view
  return (
    <div className="pt-[64px] pb-[64px] px-4 sm:px-6 lg:px-0 max-w-[789px] mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        <aside className="w-full lg:w-[270px]">
          <Sidebar />
        </aside>
        <main
          className="flex-1 rounded-[20px] border border-border-stroke-regular overflow-hidden bg-center bg-cover"
          style={{
            backgroundImage: "url('/wave.png')",
            backgroundSize: 'auto',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-1">
            <div>
              <Card className="p-0 w-full max-w-full border-none shadow-none bg-transparent">
                <CardContent className="p-0 flex flex-col justify-between gap-6 min-h-[320px]">
                  <div>
                    <SigninpHero />
                  </div>

                  <div
                    className="py-4 px-6 sm:py-[22px] sm:px-[54px] rounded-[20px] bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: "url('/benifits.jpg')" }}
                  >
                    <Benefits2 />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      <div className="mt-8">
        <FooterLinks />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSpinner />}>
      <LoginPageContent />
    </Suspense>
  );
}

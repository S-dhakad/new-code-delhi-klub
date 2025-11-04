'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { FooterLinks } from 'src/components/signup/FooterLinks';
import { SucessModal } from 'src/components/modals/SucessModal';
import { FailureModal } from 'src/components/modals/FailureModal';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileCreateCommunityPage } from 'src/mobile-pages';
import { useCreateCommunity } from 'src/hooks/useCreateCommunity';
import { useAuthStore } from 'src/store/auth.store';
import { useProfileStore } from 'src/store/profile.store';

export default function CreateCommunityPage() {
  const features = [
    'A community that represents your brand',
    'Your own private Social Media',
    'Create & sell unlimited digital products',
    'Host live sessions, Q&As & discussions',
    'Create & Organize community events',
    'Inbuilt payment processing (UPI, Cards)',
  ];

  const isMobile = useIsMobile();
  const { accessToken } = useAuthStore();
  const { profile } = useProfileStore();
  const {
    loading,
    showSuccessModal,
    setShowSuccessModal,
    showFailureModal,
    setShowFailureModal,
    handleCreateCommunity,
  } = useCreateCommunity();

  if (isMobile) {
    return <MobileCreateCommunityPage />;
  }

  return (
    <div className="container">
      <div
        className="flex items-center my-10"
        style={{ minHeight: 'calc(100vh - 128px)' }}
      >
        <div className="max-w-[1038px] w-full mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-[#000000]">Klub</h1>
            {accessToken && profile && (
              <div className="ml-auto">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-[#F6F6F6] border px-3 py-1">
                  <div className="relative w-9 h-9 rounded-2xl border-2 border-[#0A5DBC] overflow-hidden">
                    {profile.profilePicture && (
                      <Image
                        src={`${profile.profilePicture}`}
                        alt="profile photo"
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="text-left">
                    <div className="text-base font-semibold text-slate-900 leading-4">
                      {profile.firstName} {profile.lastName}
                    </div>
                    <div className="text-sm font-medium text-slate-400 leading-4 mt-1">
                      {profile.email}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <section className="bg-[url('/wave.png')] bg-repeat rounded-[20px] p-[30px]">
            <div className="bg-transparent rounded-[20px] flex items-stretch">
              {/* LEFT: form */}
              <div className="flex-1 flex-shrink-0">
                <h2 className="text-[26px] font-semibold text-[#000000] mb-3">
                  Let’s{' '}
                  <span className="text-[#0A5DBC]">Create your Community</span>
                </h2>
                <p className="text-sm font-medium text-[#787878] mb-5">
                  Now you can create your own community on Klub, invite members
                  who share your interests, monetize your content and build your
                  recurring brand
                </p>
                <div className="pt-2">
                  <p className="text-sm font-medium text-[#787878] mb-3">
                    What you get inside?
                  </p>
                  <ul className="flex flex-col gap-3">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Image
                          src="/Check.svg"
                          alt="check icon"
                          width={16}
                          height={16}
                        />
                        <span className="text-sm font-medium text-[#000000]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={handleCreateCommunity}
                  disabled={loading}
                  className={`w-full rounded-[15px] bg-[#0A5DBC] h-11 text-base font-semibold text-white mt-5 transition-colors duration-300 hover:bg-[#053875] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : 'Create Community'}
                </Button>
              </div>

              <span className="w-[1px] border-r border-[#ECECEC] mx-[30px]"></span>

              {/* RIGHT: media preview */}
              <div className="flex-1 flex-shrink-0 flex items-center">
                <div className="w-full bg-[#FFFFFF] border border-[#ECECEC] rounded-[20px] py-10 px-[35px]">
                  <div className="flex flex-col gap-5">
                    <div>
                      <h3 className="text-lg font-semibold text-[#000000]">
                        Individual Plan
                      </h3>
                    </div>

                    {/* Plan selector bar */}
                    <div className="rounded-[20px] border border-[#0A5DBC] bg-[#E6EFF8] py-3 px-5 md:p-4 flex items-start justify-between">
                      <div className="flex items-center gap-[10px]">
                        {/* radio */}
                        <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#0A5DBC]">
                          <div className="w-2 h-2 rounded-full bg-sky-600" />
                        </div>
                        <div className="text-base font-semibold text-[#000000]">
                          Monthly
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-medium text-[#000000]">
                          Rs. 1299
                          <span className="text-sm font-medium text-[#787878]">
                            /mo
                          </span>
                        </div>
                        <div className="text-xs font-medium text-[#787878]">
                          Fixed price
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#ECECEC] my-1" />
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-base font-medium text-[#787878]">
                          Total
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-semibold text-[#000000]">
                          Rs. 1299
                        </div>
                        <div className="text-xs font-medium text-[#787878]">
                          Cancel anytime
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="flex items-center justify-between mt-[60px]">
            <p className="text-sm font-medium text-[#787878]">
              All rights reserved @2025
            </p>
            <FooterLinks />
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SucessModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        title="Payment Successful!"
        message="Thank you for your payment! Your community has been created successfully."
        redirectMessage="You'll be redirected to setup your Razorpay account in"
        onOpenChange={(open) => {
          setShowSuccessModal(open);
        }}
      />

      {/* Failure Modal */}
      <FailureModal
        open={showFailureModal}
        setOpen={setShowFailureModal}
        title="Payment Failed"
        message="Your payment could not be processed. Please try again or contact support if the issue persists."
        onOpenChange={(open) => {
          setShowFailureModal(open);
        }}
      />
    </div>
  );
}

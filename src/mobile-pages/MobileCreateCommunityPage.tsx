'use client';
import React from 'react';
import { MobileFooterLinks } from 'src/components/mobile/common/FooterLinks';
import Button from 'src/components/mobile/common/ui/Button';
import PricingCard from 'src/components/signup/PricingCard';
import { SucessModal } from 'src/components/modals/SucessModal';
import { FailureModal } from 'src/components/modals/FailureModal';
import { useCreateCommunity } from 'src/hooks/useCreateCommunity';
import SetupMobileHeader from 'src/components/mobile/community-profile/SetupMobileHeader';

const MobileCreateCommunityPage = () => {
  const {
    loading,
    showSuccessModal,
    setShowSuccessModal,
    showFailureModal,
    setShowFailureModal,
    handleCreateCommunity,
  } = useCreateCommunity();

  return (
    <>
      <SetupMobileHeader />
      <div className="mx-auto max-w-[500px]">
        <div
          className="mt-7 border-y"
          style={{
            backgroundImage: 'url(/wave.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="px-4 py-7">
            <h1 className="text-2xl font-semibold">
              Let&apos;s{' '}
              <span className="text-primary">Create your Community</span>
            </h1>
            <p className="mt-3 text-sm font-medium text-text-secondary">
              Now you can create your own community on Klub, invite members who
              share your interests, monetize your content and build your
              recurring brand
            </p>
            <div className="mt-5 p-5 bg-white rounded-2xl border border-border-stroke-regular">
              <PricingCard />
            </div>
            <div className="mt-5">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                className="h-11"
                onClick={handleCreateCommunity}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Create Community'}
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-5">
          <MobileFooterLinks />
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
    </>
  );
};

export default MobileCreateCommunityPage;

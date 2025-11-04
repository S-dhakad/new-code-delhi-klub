'use client';
import React from 'react';
import Image from 'next/image';
import KlubProfileHero from 'src/components/mobile/klub-profile/KlubProfileHero';
import Courses from 'src/components/mobile/klub-profile/Courses';
import Posts from 'src/components/mobile/klub-profile/Posts';
import { useKlubProfile } from 'src/hooks/useKlubProfile';
import { SucessModal } from 'src/components/modals/SucessModal';
import { FailureModal } from 'src/components/modals/FailureModal';
import { useCourses } from 'src/hooks/useCourses';

interface MobileKlubProfilePageProps {
  showJoinButton?: boolean;
  communityId?: string;
}

const MobileKlubProfilePage = ({
  showJoinButton = true,
  communityId,
}: MobileKlubProfilePageProps) => {
  const {
    community,
    featuredPosts,
    loading,
    error,
    isMember,
    showSuccessModal,
    showFailureModal,
    open,
    copied,
    setShowSuccessModal,
    setShowFailureModal,
    setOpen,
    getProfileLinks,
    formatJoinedDate,
    getEmbedUrl,
    handleJoinNow,
    handleCopy,
    handleLikePost,
    handleUnlikePost,
    handleCommentOnPost,
  } = useKlubProfile(communityId);

  const { courses } = useCourses(community?.id);

  if (loading) {
    return (
      <div className="mx-auto max-w-[410px] px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="mx-auto max-w-[410px] px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            {error || 'Community not found'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-[410px] px-4 py-6 space-y-7">
        {/* Hero */}
        <KlubProfileHero
          community={community}
          isMember={isMember}
          open={open}
          copied={copied}
          setOpen={setOpen}
          formatJoinedDate={formatJoinedDate}
          getEmbedUrl={getEmbedUrl}
          getProfileLinks={getProfileLinks}
          handleJoinNow={handleJoinNow}
          handleCopy={handleCopy}
          showJoinButton={showJoinButton}
        />

        {/* About */}
        {community?.about && (
          <section>
            <h2 className="text-base font-medium text-text-secondary mb-4">
              About
            </h2>
            <p className="text-sm font-medium">{community.about}</p>
          </section>
        )}

        {/* Key Highlights */}
        {(community?.description ||
          (community?.images && community.images.length > 0)) && (
          <section>
            <h2 className="text-base font-medium text-text-secondary mb-4">
              Key Highlights
            </h2>
            {community?.description && (
              <p className="text-sm font-medium">{community.description}</p>
            )}
            {community?.images && community.images.length > 0 && (
              <div className="mt-4 p-4 grid grid-cols-2 gap-3">
                {community.images.map((img, i) => (
                  <div
                    key={i}
                    className="rounded-[20px] overflow-hidden bg-white"
                  >
                    <Image
                      src={img}
                      alt={`Highlight ${i + 1}`}
                      width={183}
                      height={149}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Courses */}
        <Courses courses={courses} />

        {/* Posts */}
        <Posts
          posts={featuredPosts}
          onLike={handleLikePost}
          onUnlike={handleUnlikePost}
          onComment={handleCommentOnPost}
        />
      </div>

      {/* Success Modal */}
      <SucessModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        title="Payment Successful!"
        message="Thank you for your payment! You have successfully joined the community."
        redirectMessage="You'll be redirected to the community in"
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

export default MobileKlubProfilePage;

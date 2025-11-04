'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Separator } from 'src/components/ui/separator';
import KlubCourseCard from 'src/components/courses/KlubCourseCard';
import { Course } from 'src/types/courses.types';
import { useCourses } from 'src/hooks/useCourses';
import { SucessModal } from 'src/components/modals/SucessModal';
import { FailureModal } from 'src/components/modals/FailureModal';
import { useKlubProfile } from 'src/hooks/useKlubProfile';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileKlubProfilePage from 'src/mobile-pages/MobileKlubProfilePage';
import Link from 'next/link';
import VideoPlayer from 'src/components/VideoPlayer';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';

export default function KlubProfile() {
  const {
    community,
    loading,
    error,
    isMember,
    showSuccessModal,
    showFailureModal,
    setShowSuccessModal,
    setShowFailureModal,
    getProfileLinks,
    formatJoinedDate,
    getEmbedUrl,
    handleJoinNow,
  } = useKlubProfile();

  const { courses } = useCourses(community?.id);
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="container mx-auto max-w-7xl px-4 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">
            {error || 'Community not found'}
          </div>
        </div>
      </div>
    );
  }

  // Mobile layout
  if (isMobile) {
    return <MobileKlubProfilePage />;
  }
  console.log(community?.banner?.[0]);

  return (
    <>
      <div className="border-b border-[#ECECEC]">
        <div className="container">
          <div className="pt-[30px] pb-[15px] flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              <Image
                src="/briefcase.svg"
                width={22}
                height={22}
                alt="klub icon"
              />
              <h1 className="text-xl font-semibold text-[#000000]">
                Klub Profile
              </h1>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="max-w-[1200px] mx-auto">
          <div className="mt-6 w-full mx-auto flex flex-col lg:flex-row gap-8 lg:gap-14">
            <div className="w-full lg:w-[412px] flex-shrink-0">
              <div className="rounded-[20px] bg-transparent border border-[#ECECEC] pb-6 overflow-hidden">
                <div className="relative">
                  <div className="w-full h-[235px] overflow-hidden rounded-t-[20px]">
                    {community?.banner?.[0] && (
                      <VideoPlayer
                        src={community.banner[0]}
                        width="100%"
                        height="100%"
                        borderRadius="20px 20px 0 0"
                      />
                    )}
                  </div>
                  <div className="absolute -bottom-10 left-4 h-[90px] w-[90px] border-2 border-[#0A5DBC] p-2 rounded-2xl bg-white">
                    {community?.image ? (
                      <Image
                        src={community.image}
                        alt="Community Logo"
                        width={74}
                        height={74}
                        className="object-cover w-full h-full rounded-2xl"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-2xl" />
                    )}
                  </div>
                </div>

                <div className="px-6 pt-12">
                  <div>
                    <h4 className="text-xl font-semibold">{community?.name}</h4>
                    <p className="text-base text-black font-medium mt-2">
                      Owned by{' '}
                      <span className="underline cursor-pointer font-semibold">
                        {/* {dummyOwnerName} */}
                      </span>
                    </p>
                    {community?.createdAt && (
                      <p className="text-sm text-[#787878] font-medium mt-2">
                        {formatJoinedDate(community.createdAt)}
                      </p>
                    )}
                    {community?.bio && (
                      <p className="mt-2 text-base font-medium text-black">
                        {community.bio}
                      </p>
                    )}
                    {community?.subscriptionAmount && (
                      <p className="mt-3 text-sm text-[#787878] font-medium">
                        <span className="text-2xl font-bold text-black">
                          ₹{community.subscriptionAmount}
                        </span>
                        /month
                      </p>
                    )}
                    <div className="mt-3 flex items-center gap-4 text-sm font-medium text-[#787878]">
                      {community?._count?.members && (
                        <div>
                          <span className="text-base font-bold text-black">
                            {community._count.members > 1000
                              ? `${(community._count.members / 1000).toFixed(2)}K`
                              : community._count.members}
                          </span>{' '}
                          Members
                        </div>
                      )}
                      {community?._count?.posts && (
                        <div>
                          <span className="text-base font-bold text-black">
                            {community._count.posts || 0}
                          </span>{' '}
                          Posts
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        className={`flex-1 border border-[#0A5DBC] bg-[#0A5DBC] text-white py-2 rounded-[15px] text-sm font-medium h-11 transition-colors duration-300 hover:bg-[#053875] ${
                          isMember ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={(e) => handleJoinNow(e)}
                        disabled={isMember}
                      >
                        Join Now
                      </button>
                      <Button
                        className="border border-[#0A5DBC] rounded-[15px] px-4 py-2 text-[#0A5DBC] text-sm font-medium h-11 bg-white"
                        onClick={() =>
                          copyToClipboardWithToast(
                            `/klub-profile/${community?.id}`,
                          )
                        }
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                  {getProfileLinks().length > 0 && (
                    <>
                      <Separator className="my-4 bg-[#ECECEC]" />
                      <div className="flex flex-col gap-3">
                        <div className="flex w-full flex-wrap gap-3">
                          {getProfileLinks().map((social, i) => (
                            <Link
                              key={i}
                              href={social.subtitle}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex bg-white rounded-[20px] w-full"
                            >
                              <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-tl-[20px] rounded-bl-[20px]">
                                <Image
                                  src={social.img}
                                  alt={social.title}
                                  width={85}
                                  height={85}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="p-4 flex-1">
                                <div className="text-sm font-medium text-[#000000]">
                                  {social.title}
                                </div>
                                <div className="text-xs font-medium text-[#787878] break-words break-all">
                                  {social.subtitle}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex-1">
              <div className="space-y-6">
                {/* About */}
                {community?.about && (
                  <div>
                    <h2 className="font-medium text-[#787878] text-base mb-4">
                      About
                    </h2>
                    <p className="text-base font-medium text-[#2A2A2A]">
                      {community.about}
                    </p>
                  </div>
                )}

                {/* Key Highlights */}
                {(community?.description ||
                  (community?.images && community.images.length > 0)) && (
                  <div>
                    <h2 className="font-medium text-[#787878] text-base mt-8 mb-4">
                      Key Highlights
                    </h2>
                    {community?.description && (
                      <p className="text-[15px] font-medium text-[#000000]">
                        {community.description}
                      </p>
                    )}
                    {community?.images && community.images.length > 0 && (
                      <div className="flex gap-3 mt-4 bg-white rounded-[20px] p-5 flex-wrap">
                        {community.images.map((img, i) => (
                          <div key={i} className="w-full sm:w-1/2 lg:w-auto">
                            <Image
                              src={img}
                              alt={`Highlight ${i + 1}`}
                              width={156}
                              height={126}
                              className="rounded-[20px] object-cover w-[156px] h-[126px]"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Courses */}
                <div>
                  <div className="flex justify-between items-center mt-[30px] mb-4">
                    <h2 className="font-medium text-[#787878] text-[15px]">
                      Courses
                    </h2>
                    <Button
                      variant="link"
                      className="text-sm font-medium text-[#0A5DBC]"
                    >
                      View all
                    </Button>
                  </div>

                  {/* <ul className="space-y-2 text-[15px] font-medium text-black">
                    {community?.topics?.map((item) => (
                      <li>{item}</li>
                    ))}
                  </ul> */}

                  <section className="grid lg:grid-cols-2 gap-6 mt-4">
                    {courses.map((course: Course) => (
                      <KlubCourseCard key={course.id} course={course} />
                    ))}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
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
}

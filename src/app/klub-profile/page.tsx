'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Separator } from 'src/components/ui/separator';
import KlubCourseCard from 'src/components/courses/KlubCourseCard';
import { useCommunityStore } from 'src/store/community.store';
import { useParams, useRouter } from 'next/navigation';
import { useCourses } from 'src/hooks/useCourses';
import Link from 'next/link';
import { formatJoinedDate } from 'src/utils/formatDate';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileKlubProfilePage from 'src/mobile-pages/MobileKlubProfilePage';

export default function KlubProfile() {
  const { community, userCommunity } = useCommunityStore();
  const { courses } = useCourses(community?.id);
  const params = useParams();
  const router = useRouter();
  const isMobile = useIsMobile();

  const getProfileLinks = () => {
    const links = [];

    if (community?.website) {
      links.push({
        title: 'My Website',
        subtitle: community.website,
        img: '/map.jpg',
      });
    }

    if (community?.youtube) {
      links.push({
        title: 'YouTube',
        subtitle: community.youtube,
        img: '/thumbnail.jpg',
      });
    }

    if (community?.instagram) {
      links.push({
        title: 'Instagram',
        subtitle: community.instagram,
        img: '/thumbnail.jpg',
      });
    }

    if (community?.linkedin) {
      links.push({
        title: 'LinkedIn',
        subtitle: community.linkedin,
        img: '/thumbnail.jpg',
      });
    }

    if (community?.facebook) {
      links.push({
        title: 'Facebook',
        subtitle: community.facebook,
        img: '/thumbnail.jpg',
      });
    }
    return links;
  };

  // Convert YouTube URLs to embeddable format
  const getEmbedUrl = (url: string) => {
    // YouTube URL patterns
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);

    if (match) {
      // Convert to YouTube embed URL
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    // For other video URLs (AWS, etc.), return as is
    return url;
  };

  useEffect(() => {
    if (!params?.id) return;
    if (community && community.id !== params.id) {
      router.replace('/404');
    }
  }, [community, params?.id, router]);

  // Mobile layout without join button
  if (isMobile) {
    return (
      <MobileKlubProfilePage
        showJoinButton={false}
        communityId={community?.id}
      />
    );
  }

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
            {userCommunity?.role === 'ADMIN' && (
              <Link
                href="/setting/profile"
                className="rounded-[15px] border border-[#0A5DBC] text-[#0A5DBC] px-4 py-2 h-[40px] text-base font-medium"
              >
                Edit Profile
              </Link>
            )}
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
                      <video
                        src={community.banner[0]}
                        autoPlay
                        className="w-full h-full object-cover"
                        style={{ objectFit: 'cover' }}
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
                    <p className="text-base text-[#000000] font-medium mt-2">
                      Owned by{' '}
                      <span className="underline cursor-pointer font-semibold">
                        {/* {dummyOwnerName} */}
                      </span>
                    </p>
                    {community?.createdAt && (
                      <p className="text-sm text-[#787878] font-medium">
                        {formatJoinedDate(community.createdAt)}
                      </p>
                    )}
                    <p className="mt-2 text-base font-medium text-black">
                      {community?.bio}
                    </p>
                    <p className="mt-3 text-sm text-[#787878] font-medium">
                      <span className="text-2xl font-bold text-black">
                        ₹{community?.subscriptionAmount}
                      </span>
                      /month
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-sm font-medium text-[#787878]">
                      <div>
                        <span className="text-base font-bold text-black">
                          {community?._count?.members
                            ? community._count.members > 1000
                              ? `${(community._count.members / 1000).toFixed(2)}K`
                              : community._count.members
                            : community?._count?.members}
                        </span>{' '}
                        Members
                      </div>
                      <div>
                        <span className="text-base font-bold text-black">
                          {community?._count?.posts || 0}
                        </span>{' '}
                        Posts
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button
                        onClick={() =>
                          copyToClipboardWithToast(
                            `/klub-profile/${community?.id}`,
                          )
                        }
                        className="w-full border border-[#0A5DBC] rounded-[15px] px-4 py-2 text-[#0A5DBC] bg-white text-sm font-medium h-11"
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
                    <p className="text-[15px] font-medium text-[#000000]">
                      {community?.about}
                    </p>
                  </div>
                )}

                {/* Key Highlights */}
                <div>
                  {community?.description && (
                    <>
                      <h2 className="font-medium text-[#787878] text-base mt-8 mb-4">
                        Key Highlights
                      </h2>
                      <p className="text-[15px] font-medium text-[#000000]">
                        {community?.description}
                      </p>
                    </>
                  )}
                  {community?.images && community.images.length > 0 && (
                    <div className="flex gap-3 mt-4 bg-white rounded-[20px] p-5 flex-wrap">
                      {community?.images?.map((img, i) => (
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

                {/* Courses */}
                <div>
                  <div className="flex justify-between items-center mt-[30px] mb-4">
                    <h2 className="font-medium text-[#787878] text-[15px]">
                      Courses
                    </h2>
                    <Link
                      href="/courses"
                      className="text-sm font-medium text-[#0A5DBC]"
                    >
                      View all
                    </Link>
                  </div>

                  <ul className="space-y-2 text-[15px] font-medium text-black">
                    <li>
                      ✅ Easy-to-follow trainings on AI tools, automation, and
                      monetization
                    </li>
                    <li>
                      ✅ Pre-built templates for lead gen, sales, and client
                      delivery
                    </li>
                    <li>
                      ✅ Weekly coaching calls, Q&amp;A sessions, and real-time
                      feedback
                    </li>
                  </ul>

                  <section className="grid lg:grid-cols-2 gap-6 mt-4">
                    {courses.map((course) => (
                      <KlubCourseCard key={course.id} course={course} />
                    ))}
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

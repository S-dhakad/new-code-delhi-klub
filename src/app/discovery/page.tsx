'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Input } from 'src/components/ui/input';
import CommunityCard from 'src/components/CommunityCard';
import FilterSidebar from 'src/components/FilterSidebar';
import { useAuthStore } from 'src/store/auth.store';
import { useProfileStore } from 'src/store/profile.store';
import { useDiscoveryData } from 'src/hooks/useDiscoveryData';
import { Fragment, useEffect } from 'react';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileDiscoveryPage } from 'src/mobile-pages';
import CommunityCardSkeleton from 'src/components/skeletons/CommunityCardSkeleton';

const topics = [
  'All',
  'Finance',
  'Travel',
  'Technology',
  'Food',
  'Music',
  'Education',
  'Marketing',
  'Business',
  'Adventure sports',
  'MVPs',
  'Entrepreneurship',
  'AI',
  'Side Hustle',
  'Funding',
  'Health & Fitness',
  'Sales',
];

const typeFilters = ['Both', 'Private - Paid', 'Public - Free'];

export default function DiscoveryPage() {
  const { accessToken } = useAuthStore();
  const { profile } = useProfileStore();
  const isMobile = useIsMobile();

  // Add background for the body
  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);

  const {
    selectedTopics,
    selectedType,
    searchQuery,
    communities,
    loading,
    loadingMore,
    error,
    hasNextPage,
    handleTopicSelect,
    handleTypeSelect,
    handleSearch,
    getCommunityCardProps,
  } = useDiscoveryData();

  console.log('communities dicovery', communities);

  if (isMobile) {
    return <MobileDiscoveryPage />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#ECECEC]">
        <div className="container">
          <div className="py-[25px] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <img src="/klub.png" alt="klub logo" width={71} height={25} />
              </Link>
            </div>
            {accessToken && profile ? (
              <div className="ml-auto">
                <div className="inline-flex items-center gap-2 rounded-[20px] bg-[#F6F6F6] border border-[#ECECEC] px-[15px] py-3">
                  <div className="relative w-11 h-11 rounded-[15px] border-2 border-[#0A5DBC] overflow-hidden">
                    {profile.profilePicture && (
                      <img
                        src={`${profile.profilePicture}`}
                        alt="profile photo"
                        width={44}
                        height={44}
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="text-left">
                    <div className="text-base font-semibold text-[#000000]">
                      {profile.firstName} {profile.lastName}
                    </div>
                    <div className="text-sm font-medium text-[#787878]">
                      {profile.username}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/signup"
                  className="rounded-[15px] px-4 py-2 text-sm text-[#0A5DBC] font-semibold border border-[#0A5DBC] h-11 flex items-center justify-center"
                >
                  Sign up
                </Link>
                <Link
                  href="/creator-signup"
                  className="rounded-[15px] px-4 py-2 text-sm text-white font-semibold bg-[#0A5DBC] h-11 flex items-center justify-center transition-colors duration-300 hover:bg-[#053875]"
                >
                  Create community
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="container">
        <div className="py-8 w-full grid grid-cols-1 lg:grid-cols-1 gap-9">
          <div className="hidden lg:block fixed top-[152px] left-[calc((100vw-1280px)/2)] w-[275px] h-fit">
            <FilterSidebar
              topics={topics}
              typeFilters={typeFilters}
              selectedTopics={selectedTopics}
              selectedType={selectedType}
              onTopicSelect={handleTopicSelect}
              onTypeSelect={handleTypeSelect}
            />
          </div>

          {/* Right Content */}
          <section className="space-y-[30px] lg:ml-[311px]">
            <div className="flex flex-col md:flex-row items-start md:items-baseline justify-between gap-4">
              <div className="flex items-baseline">
                <h2 className="text-lg font-medium text-[#000000]">
                  Let&apos;s{' '}
                  <span className="text-lg font-semibold text-[#0A5DBC]">
                    find you a Klub
                  </span>
                </h2>
              </div>

              <div className="w-full md:w-[337px]">
                <div className="relative w-full">
                  <Image
                    src="/Search.svg"
                    alt="search icon"
                    width={18}
                    height={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  />
                  <Input
                    type="text"
                    placeholder="Search for a community or topic"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full rounded-[15px] px-5 py-2.5 text-sm pl-10 border h-11"
                  />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <CommunityCardSkeleton count={6} />
              </div>
            ) : error ? (
              <div className="flex justify-center items-center py-12">
                <div className="text-lg text-red-600">{error}</div>
              </div>
            ) : communities && communities.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {communities.map((community) => (
                  <Link
                    href={`/klub-profile/${community?.id}`}
                    key={community.id}
                  >
                    <CommunityCard {...getCommunityCardProps(community)} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center py-12">
                <div className="text-lg text-gray-600">
                  No communities found for the selected filters.
                </div>
              </div>
            )}

            {/* Loading More State */}
            {loadingMore && (
              <div className="flex justify-center items-center py-8">
                <div className="text-lg text-gray-600">
                  Loading more communities...
                </div>
              </div>
            )}

            {/* End of Results Message */}
            {!loading &&
              !loadingMore &&
              !hasNextPage &&
              communities.length > 0 && (
                <div className="flex justify-center items-center py-8">
                  <div className="text-sm text-gray-500">
                    You&apos;ve reached the end of the results
                  </div>
                </div>
              )}
          </section>
        </div>
      </div>
    </div>
  );
}

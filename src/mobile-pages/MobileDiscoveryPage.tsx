'use client';
import React from 'react';
import Image from 'next/image';
import CommunityCard from 'src/components/mobile/common/CommunityCard';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import Link from 'next/link';
import { useDiscoveryData } from 'src/hooks/useDiscoveryData';
import { useRouter } from 'next/navigation';
import DiscoveryHeader from 'src/components/mobile/discovery/DiscoveryHeader';

const MobileDiscoveryPage = () => {
  const router = useRouter();
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
  ] as const;

  const {
    selectedTopics,
    searchQuery,
    communities,
    loading,
    loadingMore,
    error,
    handleTopicSelect,
    handleSearch,
    getCommunityCardProps,
  } = useDiscoveryData();

  return (
    <div className="mx-auto max-w-[500px] bg-white">
      <DiscoveryHeader />
      <div className="flex flex-col gap-5 px-4 pt-7">
        <h2 className="text-[22px] font-medium">
          Discover <span className="text-primary font-semibold">Klubs</span>
        </h2>
        <Button
          className="w-full text-white rounded-2xl font-semibold py-3 h-11"
          variant="default"
          onClick={() => router.push('/create-community')}
        >
          Create Community
        </Button>
        <div className="relative w-full">
          <Image
            src="/Search.svg"
            alt="search icon"
            width={18}
            height={18}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          />
          <Input
            placeholder="Search Klubs"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full text-sm font-medium rounded-2xl pl-10 h-10 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 border border-[#ECECEC]"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide p-1">
          {topics.map((topic) => {
            const selected = selectedTopics.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => handleTopicSelect(topic)}
                aria-pressed={selected}
                className={`rounded-[10px] border px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer select-none ${
                  selected
                    ? 'bg-secondary font-semibold text-primary border-secondary ring-1 ring-primary'
                    : 'text-text-secondary font-medium hover:bg-muted border-border-stroke-regular'
                }`}
              >
                {topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Community Cards */}
      <div className="mt-[30px] grid grid-cols-1 gap-5 px-4">
        {loading && (
          <div className="text-center text-sm text-gray-500 py-6">
            Loading communities...
          </div>
        )}
        {error && !loading && (
          <div className="text-center text-sm text-red-600 py-6">{error}</div>
        )}
        {!loading && !error && communities.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">
            No communities found.
          </div>
        )}
        {!loading &&
          !error &&
          communities.map((community) => (
            <Link href={`/klub-profile/${community?.id}`} key={community.id}>
              <CommunityCard {...getCommunityCardProps(community)} />
            </Link>
          ))}
        {loadingMore && (
          <div className="text-center text-xs text-gray-400 py-4">
            Loading more...
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileDiscoveryPage;

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FeaturedPost from 'src/components/profile/FeaturedPost';
import { Community } from 'src/types/community.types';
import { Post } from 'src/types/post.types';
import { Profile } from 'src/types/profile.types';

interface ProfileContentProps {
  profile: Profile;
  ownedCommunities: Community[];
  memberships: Community[];
  featuredPost: Post[];
}

export default function ProfileContent({
  profile,
  ownedCommunities,
  memberships,
  featuredPost,
}: ProfileContentProps) {
  return (
    <div className="flex-1 overflow-hidden">
      {/* Owned Communities */}
      {ownedCommunities.length > 0 && (
        <div>
          <h4 className="text-base font-medium text-[#787878] mb-4">
            Owned by {profile.firstName}
          </h4>
          <div className="space-y-5">
            {ownedCommunities.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white rounded-[20px] border-0 p-5"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {item.image && (
                    <div className="w-11 h-11 rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={44}
                        height={44}
                        className="w-11 h-11 object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#000000]">
                      {item.name}
                    </div>
                    <div className="text-sm font-medium text-[#787878]">
                      0K members | ₹{item.subscriptionAmount}/m
                    </div>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">
                  <Link
                    href={`/klub-profile/${item.id}`}
                    className="bg-[#0A5DBC] text-white font-medium text-sm px-4 py-2 rounded-[15px] h-10 transition-colors duration-300 hover:bg-[#053875]"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Memberships */}
      {memberships.length > 0 && (
        <div className="mt-8">
          <h4 className="text-base font-medium text-[#787878] mb-4">
            Memberships
          </h4>
          <div className="bg-white rounded-[20px] border-0 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {memberships.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                {item.image && (
                  <div className="w-11 h-11 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={44}
                      height={44}
                      className="w-11 h-11 object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className="font-semibold text-sm text-[#000000]">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#787878]">
                    0K members | ₹{item.subscriptionAmount}/m
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Posts (only for owner) */}
      {featuredPost && featuredPost.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-medium text-[#787878]">
              Featured Posts
            </h4>
          </div>
          {featuredPost.map((post) => (
            <FeaturedPost key={post.id} post={post} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}

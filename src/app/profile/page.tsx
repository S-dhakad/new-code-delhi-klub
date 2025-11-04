'use client';

import React from 'react';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { useOwnProfile } from 'src/hooks/useOwnProfile';
import ProfileHeader from 'src/components/profile/desktop/ProfileHeader';
import ProfileSidebar from 'src/components/profile/desktop/ProfileSidebar';
import ProfileContent from 'src/components/profile/desktop/ProfileContent';
import { MobileCreatorProfilePage } from 'src/mobile-pages';

export default function OwnProfilePage() {
  const isMobile = useIsMobile();
  const {
    profile,
    ownedCommunities,
    memberships,
    featuredPost,
    loading,
    isOwner,
  } = useOwnProfile();

  if (!profile || loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (isMobile) {
    return (
      <MobileCreatorProfilePage
        profile={profile}
        isOwner={isOwner}
        ownedCommunities={ownedCommunities}
        memberships={memberships}
      />
    );
  }

  return (
    <div>
      <ProfileHeader isOwner={isOwner} />
      <div className="container">
        <div className="max-w-[1200px] mx-auto mt-[30px]">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-20">
            <ProfileSidebar profile={profile} isOwner={isOwner} />
            <ProfileContent
              profile={profile}
              ownedCommunities={ownedCommunities}
              memberships={memberships}
              featuredPost={featuredPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

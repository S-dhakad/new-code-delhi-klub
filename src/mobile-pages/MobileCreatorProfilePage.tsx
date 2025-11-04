import React from 'react';
import Link from 'next/link';
import CreatorProfileHero from 'src/components/mobile/creator-profile/CreatorProfileHero';
import KlubCard from 'src/components/mobile/creator-profile/KlubCard';
import MembershipCard from 'src/components/mobile/creator-profile/MembershipCard';
import { Profile } from 'src/types/profile.types';
import { Community } from 'src/types/community.types';

interface MobileCreatorProfilePageProps {
  profile: Profile;
  isOwner: boolean;
  ownedCommunities: Community[];
  memberships: Community[];
}

const MobileCreatorProfilePage = ({
  profile,
  isOwner,
  ownedCommunities,
  memberships,
}: MobileCreatorProfilePageProps) => {
  return (
    <div className="mx-auto max-w-[500px] px-4 py-6 space-y-7">
      <CreatorProfileHero profile={profile} isOwner={isOwner} />

      {/* Owned Communities */}
      {ownedCommunities.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-text-secondary mb-4">
            Owned by {profile.firstName}
          </h2>
          <div className="space-y-4">
            {ownedCommunities.map((community) => (
              <Link key={community.id} href={`/klub-profile/${community.id}`}>
                <KlubCard
                  image={community.image || '/feedImage.jpg'}
                  title={community.name}
                  membersText="0K members"
                  priceText={
                    community.subscriptionAmount === 0
                      ? 'Free'
                      : `₹${community.subscriptionAmount}/m`
                  }
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Memberships */}
      {memberships.length > 0 && (
        <section>
          <h2 className="text-base font-medium text-text-secondary mb-4">
            Memberships
          </h2>
          <MembershipCard memberships={memberships} />
        </section>
      )}
    </div>
  );
};

export default MobileCreatorProfilePage;

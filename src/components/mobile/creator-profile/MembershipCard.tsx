import Image from 'next/image';
import React from 'react';
import { Community } from 'src/types/community.types';

interface MembershipCardProps {
  memberships: Community[];
}

const MembershipCard = ({ memberships }: MembershipCardProps) => {
  if (memberships.length === 0) return null;

  return (
    <div className="flex flex-col gap-4 bg-white rounded-[20px] p-5">
      {memberships.map((membership) => (
        <div key={membership.id} className="flex items-center gap-3">
          {membership.image && (
            <Image
              src={membership.image}
              alt={membership.name}
              width={44}
              height={44}
              className="rounded-2xl object-cover aspect-square"
            />
          )}
          <div>
            <h2 className="text-sm font-semibold">{membership.name}</h2>
            <div className="text-sm font-medium text-text-secondary mt-1">
              0K members | ₹{membership.subscriptionAmount}/m
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembershipCard;

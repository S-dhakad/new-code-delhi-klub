'use client';
import React from 'react';
import Image from 'next/image';
import Button from 'src/components/mobile/common/ui/Button';
import { useMembership, DISCOVER_KLUB } from 'src/hooks/settings/useMembership';
import Link from 'next/link';
import { SettingMembershipModal } from 'src/components/setting/SettingMembershipModal';

const MobileMembership: React.FC = () => {
  const {
    communities,
    loading,
    showSettingMembership,
    setShowSettingMembership,
  } = useMembership();

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* Communities List */}
      {communities.map((community) => (
        <div key={community.id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[15px] bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={community.image || '/cardImage1.jpg'}
                alt={community.name}
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
            <div>
              <h4 className="text-sm font-semibold">{community.name}</h4>
              <p className="mt-1 text-sm text-text-secondary">
                {community._count.members} members |{' '}
                {community.isPaid
                  ? `$${community.subscriptionAmount}/m`
                  : 'Free'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="rounded-full h-10"
            onClick={() => setShowSettingMembership(true)}
          >
            Settings
          </Button>
        </div>
      ))}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-2 text-sm text-gray-500">Loading...</div>
      )}

      {/* Discover Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-[15px] bg-white flex items-center justify-center overflow-hidden">
            <Image
              src={DISCOVER_KLUB.avatar}
              alt="discover icon"
              width={44}
              height={44}
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-sm font-semibold">{DISCOVER_KLUB.title}</h4>
            <p className="mt-1 text-sm text-text-secondary">
              {DISCOVER_KLUB.subtitle}
            </p>
          </div>
        </div>
        <Link href="/">
          <Button
            size="sm"
            variant="outline"
            className="text-primary border-primary rounded-full h-10"
          >
            Discover
          </Button>
        </Link>
      </div>

      <SettingMembershipModal
        open={showSettingMembership}
        setOpen={setShowSettingMembership}
      />
    </div>
  );
};

export default MobileMembership;

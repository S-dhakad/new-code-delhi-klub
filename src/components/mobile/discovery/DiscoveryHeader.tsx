import React from 'react';
import Image from 'next/image';
import Button from '../common/ui/Button';
import Link from 'next/link';
import { useProfileStore } from 'src/store/profile.store';

const DiscoveryHeader = () => {
  const { profile } = useProfileStore();
  return (
    <header className="p-4 flex items-center justify-between border-b">
      <Link href="/">
        <Image src="/Klub.png" alt="Klub Logo" width={63} height={63} />
      </Link>
      {profile ? (
        <div className="flex items-center gap-2 p-2.5 border rounded-2xl bg-[#F6F6F6]">
          <Image
            src={profile?.profilePicture || '/profile3.jpg'}
            alt={profile?.username || 'Profile'}
            width={44}
            height={44}
            className="aspect-square object-cover border-2 border-primary rounded-2xl"
          />
          <div>
            <h3 className="font-semibold">
              {(profile?.firstName || '') + ' ' + (profile?.lastName || '')}
            </h3>
            {profile?.username && (
              <p className="text-xs text-text-secondary">{profile.username}</p>
            )}
          </div>
        </div>
      ) : (
        <Link href="/login">
          <Button
            size="md"
            variant="outline"
            className="text-primary border-primary h-11"
          >
            Sign in
          </Button>
        </Link>
      )}
    </header>
  );
};

export default DiscoveryHeader;

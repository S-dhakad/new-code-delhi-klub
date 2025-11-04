import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useProfileStore } from 'src/store/profile.store';

const SetupMobileHeader = () => {
  const { profile } = useProfileStore();
  return (
    <header className="p-4 flex items-center justify-between border-b">
      <Link href="/">
        <Image src="/klub.png" alt="Klub Logo" width={63} height={63} />
      </Link>
      <div className="flex items-center gap-2 p-2.5 border rounded-2xl bg-[#F6F6F6]">
        <Image
          src={profile?.profilePicture || '/profile3.jpg'}
          alt="Edit"
          width={44}
          height={44}
          className="aspect-square object-cover border-2 border-primary rounded-2xl"
        />
        <div>
          <h3 className="font-semibold">
            {profile?.firstName + ' ' + profile?.lastName}
          </h3>
          <p className="text-xs text-text-secondary">{profile?.username}</p>
        </div>
      </div>
    </header>
  );
};

export default SetupMobileHeader;

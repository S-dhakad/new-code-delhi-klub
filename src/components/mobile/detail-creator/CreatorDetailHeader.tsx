import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CreatorDetailHeader = () => {
  return (
    <header className="px-4 py-6 flex items-center justify-between border-b">
      <Link href="/">
        <Image src="/Klub.png" alt="Klub Logo" width={63} height={63} />
      </Link>
    </header>
  );
};

export default CreatorDetailHeader;

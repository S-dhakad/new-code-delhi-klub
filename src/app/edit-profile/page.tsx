'use client';
import { useEffect } from 'react';
import ProfilePreview from 'src/components/profile/ProfilePreview';
import ProfileForm from 'src/components/profile/ProfileForm';
import { FooterLinks } from 'src/components/signup/FooterLinks';
import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileDetailCreatorPage from 'src/mobile-pages/MobileDetailCreatorPage';
import { formatDate } from 'src/utils/formatDate';
import { useProfileForm } from 'src/hooks/useProfileForm';

export default function EditProfilePage() {
  const isMobile = useIsMobile();
  const { fullName, username, bio, avatar, profile } = useProfileForm();

  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);

  // Render mobile-specific edit profile page
  if (isMobile) {
    return <MobileDetailCreatorPage />;
  }

  return (
    <div className="bg-white pt-[83px] pb-[83px]">
      <div className="max-w-[960px] mx-auto">
        <div className="flex items-center justify-between">
          <Image src="/Klub.png" alt="klub logo" width={65} height={25} />
          <Button
            type="button"
            className="inline-flex items-center gap-2 rounded-[10px] bg-[#4BD3661A] px-4 py-1 h-[34px] border border-[#ECECEC]"
          >
            <span className="w-3 h-3 rounded-full bg-[#4BD366]" />
            <span className="text-sm font-medium text-[#000000]">Creator</span>
          </Button>
        </div>
        <div
          className="mt-6 rounded-[20px] border border-[#ECECEC]"
          style={{
            backgroundImage: "url('/wave.png')",
            backgroundSize: 'auto',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <ProfileForm />

            <div className="flex flex-col">
              {username && (
                <ProfilePreview
                  fullName={fullName}
                  username={username}
                  bio={bio}
                  avatar={avatar}
                  joinedDate={
                    formatDate(profile?.createdAt || '', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) || ''
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[60px]">
          <p className="text-sm font-medium text-[#787878]">
            All rights reserved @2025
          </p>
          <FooterLinks />
        </div>
      </div>
    </div>
  );
}

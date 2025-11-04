'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import GeneralInfoCommunities from 'src/components/setting/GeneralInfoCommunities';
import FeaturePost from 'src/components/setting/FeaturePost';
import GeneralInfo from 'src/components/setting/GeneralInfoProfile';
import Membership from 'src/components/setting/Membership';
import SocialLinks from 'src/components/setting/SocialLinks';
import Courses from 'src/components/setting/Courses';
import AccountSetting from 'src/components/setting/AccountSetting';
import HelpSupport from 'src/components/setting/HelpSupport';
import SettingsSidebar from 'src/components/setting/SettingsSidebar';
import { useCommunityStore } from 'src/store/community.store';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileEditProfilePage from 'src/mobile-pages/MobileEditProfilePage';
import { Filter } from 'src/components/mobile/edit-profile/EditProfileTab';

export default function SettingsPage({ params }: { params: { tab: string } }) {
  const path = usePathname();
  const router = useRouter();
  const { userCommunity } = useCommunityStore();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!path) return;

    // Handle mobile routing
    if (isMobile) {
      // Mobile should always show MobileEditProfilePage regardless of path
      return;
    }

    // Desktop routing validation
    if (userCommunity?.role === 'MEMBER' && path === '/setting/communities') {
      router.replace('/404');
      return;
    }

    const allowedPaths = [
      '/setting/profile',
      ...(userCommunity?.role === 'MEMBER' ? [] : ['/setting/communities']),
      '/setting/account',
      '/setting/notifications',
      '/setting/payments',
      '/setting/help',
    ];

    if (!allowedPaths.includes(path)) {
      router.replace('/404');
    }
  }, [path, router, userCommunity?.role, isMobile]);

  // Tab mapping for both mobile and desktop
  const filterToTab: { [key: string]: string } = {
    Profile: 'profile',
    Communities: 'communities',
    Account: 'account',
    'Payments & Invoices': 'payments',
    'Help & Support': 'help',
  };

  const handleTabChange = (newValue: Filter) => {
    const tab = filterToTab[newValue];
    router.push(`/setting/${tab}`);
  };

  if (isMobile) {
    return (
      <MobileEditProfilePage
        currentTab={params.tab as string}
        onTabChange={handleTabChange}
      />
    );
  }

  return (
    <div className="bg-[#F6F6F6]">
      <div className="border-b border-[#ECECEC]">
        <div className="container">
          <div className="pt-9 pb-5">
            <h1 className="text-xl font-semibold text-[#000000]">Settings</h1>
          </div>
        </div>
      </div>

      <div className="min-h-screen mt-8">
        <div className="container">
          <div className="max-w-[1200px] mx-auto">
            <div className="lg:flex lg:flex-row md:flex-col sm:flex-col gap-6 md:gap-[75px]">
              <div className="w-full md:w-[238px] flex-shrink-0">
                <SettingsSidebar />
              </div>
              <div className="flex-1">
                {path === '/setting/profile' && (
                  <div className="space-y-6">
                    <GeneralInfo />
                    <SocialLinks context="profile" />
                    <Membership />
                    {/* <FeaturePost /> */}
                  </div>
                )}
                {path === '/setting/communities' && (
                  <div className="space-y-6">
                    <GeneralInfoCommunities />
                    <SocialLinks context="community" />
                    <Courses />
                    {/* <FeaturePost /> */}
                  </div>
                )}
                {path === '/setting/account' && <AccountSetting />}
                {path === '/setting/notifications' && (
                  <div>setting notifications</div>
                )}
                {path === '/setting/payments' && <div>setting payments</div>}
                {path === '/setting/help' && <HelpSupport />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

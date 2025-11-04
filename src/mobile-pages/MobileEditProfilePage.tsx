'use client';
import React from 'react';
import EditProfileTab, {
  Filter,
} from 'src/components/mobile/edit-profile/EditProfileTab';
import ProfileSection from 'src/components/mobile/edit-profile/sections/ProfileSection';
import CommunitiesSection from 'src/components/mobile/edit-profile/sections/CommunitiesSection';
import AccountSection from 'src/components/mobile/edit-profile/sections/AccountSection';
import PaymentsSection from 'src/components/mobile/edit-profile/sections/PaymentsSection';
import HelpSection from 'src/components/mobile/edit-profile/sections/HelpSection';
import MobileSettingHeader from 'src/components/mobile/edit-profile/MobileSettingHeader';

interface MobileEditProfilePageProps {
  currentTab: string;
  onTabChange: (newValue: Filter) => void;
}

const MobileEditProfilePage: React.FC<MobileEditProfilePageProps> = ({
  currentTab,
  onTabChange,
}) => {
  const tabToFilter: { [key: string]: Filter } = {
    profile: 'Profile',
    communities: 'Communities',
    account: 'Account',
    payments: 'Payments & Invoices',
    help: 'Help & Support',
  };

  const selected = tabToFilter[currentTab] || 'Profile';

  return (
    <div className="mx-auto max-w-[480px] min-h-dvh bg-[#F6F6F6]">
      <MobileSettingHeader />
      <div className="mt-7 px-4">
        <EditProfileTab value={selected} onChange={onTabChange} />

        <div className="mt-7">
          {selected === 'Profile' && <ProfileSection />}
          {selected === 'Communities' && <CommunitiesSection />}
          {selected === 'Account' && <AccountSection />}
          {selected === 'Payments & Invoices' && <PaymentsSection />}
          {selected === 'Help & Support' && <HelpSection />}
        </div>
      </div>
    </div>
  );
};

export default MobileEditProfilePage;

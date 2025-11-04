import React from 'react';
import { MobileFooterLinks } from 'src/components/mobile/common/FooterLinks';
import ProfileFormMobile from 'src/components/mobile/detail-creator/ProfileFormMobile';
import CreatorDetailHeader from 'src/components/mobile/detail-creator/CreatorDetailHeader';

const MobileDetailCreatorPage = () => {
  return (
    <div className="mx-auto max-w-[500px] bg-white">
      <CreatorDetailHeader />
      <div className="px-4 py-7">
        <ProfileFormMobile />
        <div className="mt-[30px]">
          <MobileFooterLinks />
        </div>
      </div>
    </div>
  );
};

export default MobileDetailCreatorPage;

'use client';

import React from 'react';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileNavBar from 'src/components/mobile/common/MobileNavBar';
import HeaderBar from 'src/components/header/HeaderBar';

/**
 * Client-only header switcher to avoid using client hooks in server layout.
 */
const HeaderSwitcher: React.FC = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileNavBar /> : <HeaderBar />;
};

export default HeaderSwitcher;

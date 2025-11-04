'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useAuthStore } from 'src/store/auth.store';
import { useCommunityStore } from 'src/store/community.store';
import ProfileMenu from 'src/components/header/ProfileMenu';

/**
 * Mobile Navigation Bar Component
 * Bottom navigation bar for mobile view with main navigation items
 * Matches HeaderBar UI and functionality
 */
const MobileNavBar = () => {
  const pathname = usePathname();
  const { accessToken, isAuthenticated } = useAuthStore();
  const { community } = useCommunityStore();

  // Add body margin for mobile navbar (same as HeaderBar)
  useEffect(() => {
    const classes = ['mb-24'];
    const shouldApply = isAuthenticated && accessToken && community;
    if (shouldApply) {
      document.body.classList.add(...classes);
    }
    return () => {
      if (shouldApply) {
        document.body.classList.remove(...classes);
      }
    };
  }, [isAuthenticated, accessToken, community]);

  // Don't render if not authenticated (same as HeaderBar)
  if (!isAuthenticated || !accessToken || !community) {
    return null;
  }

  return (
    <header className="pointer-events-none">
      <div className="fixed left-1/2 -translate-x-1/2 bottom-4 px-4 pointer-events-auto z-50">
        <div className="rounded-[20px] bg-[#F6F6F6] border border-[#ECECEC] px-3 py-2 flex items-center justify-between gap-3">
          {/* Feed Icon */}
          <Link
            href="/feed"
            className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/feed' ? 'bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
            aria-label="Feed"
          >
            <Image
              src={
                pathname === '/feed' ? '/feedIcon.svg' : '/feedIconInactive.svg'
              }
              alt="feed icon"
              width={22}
              height={22}
              className="w-[22px] h-[22px] flex-shrink-0"
            />
            {pathname === '/feed' ? (
              <span className="text-base font-medium whitespace-nowrap">
                Feed
              </span>
            ) : null}
          </Link>

          {/* Courses Icon */}
          <Link
            href="/courses"
            className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/courses' || pathname === '/create-course' ? 'bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
            aria-label="Courses"
          >
            <Image
              src={
                pathname === '/courses' || pathname === '/create-course'
                  ? '/playIconBlue.svg'
                  : '/playIconInactive.svg'
              }
              alt="courses icon"
              width={22}
              height={22}
              className="w-[22px] h-[22px] flex-shrink-0"
            />
            {pathname === '/courses' || pathname === '/create-course' ? (
              <span className="text-base font-medium whitespace-nowrap">
                Courses
              </span>
            ) : null}
          </Link>

          {/* Events Icon */}
          <Link
            href="/events"
            className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/events' ? 'bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
            aria-label="Events"
          >
            <Image
              src={
                pathname === '/events'
                  ? '/calendarBlueH.svg'
                  : '/calendarInactive.svg'
              }
              alt="events icon"
              width={22}
              height={22}
              className="w-[22px] h-[22px] flex-shrink-0"
            />
            {pathname === '/events' ? (
              <span className="text-base font-medium whitespace-nowrap">
                Events
              </span>
            ) : null}
          </Link>

          {/* Klub Profile Icon */}
          <Link
            href="/klub-profile"
            className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/klub-profile' ? 'bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
            aria-label="Klub Profile"
          >
            <Image
              src={
                pathname === '/klub-profile'
                  ? '/briefcaseBlue.svg'
                  : '/briefcaseInactive.svg'
              }
              alt="klub profile icon"
              width={22}
              height={22}
              className="w-[22px] h-[22px] flex-shrink-0"
            />
            {pathname === '/klub-profile' ? (
              <span className="text-base font-medium whitespace-nowrap">
                Klub Profile
              </span>
            ) : null}
          </Link>

          {/* Profile Menu (same as HeaderBar) */}
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
};

export default MobileNavBar;

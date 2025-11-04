'use client';

import React, { useEffect, useState } from 'react';
import CommunitiesDropdown from './CommunitiesDropdown';
import NotificationsDropdown from './NotificationsDropdown';
import ProfileMenu from './ProfileMenu';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from 'src/store/auth.store';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';
import { communityService } from 'src/axios/community/communityApi';
import { Community } from 'src/types/community.types';
import { workspaceService } from 'src/axios/workspace/workspace';
import { useProfileStore } from 'src/store/profile.store';
import { profileService } from 'src/axios/profile/profileApi';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

const SETTINGS_PATHS = [
  '/setting/profile',
  '/setting/communities',
  '/setting/account',
  '/setting/notifications',
  '/setting/payments',
  '/setting/help',
];
export default function HeaderBar() {
  const pathname = usePathname();
  const isActive = SETTINGS_PATHS.includes(pathname);
  const HIDE_HEADER_PATHS = [
    '/razorpay-setup',
    '/community-profile',
    '/create-community',
  ];
  const { accessToken, isAuthenticated } = useAuthStore();
  const { profile, setProfile } = useProfileStore();
  const { community, setCommunity, setCommunityData, clearCommunity } =
    useCommunityStore();
  const router = useRouter();

  const {
    setWorkspaces,
    setSelectedWorkspaceId,
    setWorkspace,
    clearWorkspaces,
  } = useWorkspaceStore();

  const [profileFetched, setProfileFetched] = useState(false);
  const [isLoadingDefault, setIsLoadingDefault] = useState(true);
  const [communityInitialized, setCommunityInitialized] = useState(false);
  const showToast = useToastStore((s) => s.showToast);

  useEffect(() => {
    if (!accessToken) return;
    if (profileFetched) return;
    if (profile) {
      setProfileFetched(true);
      return;
    }

    const load = async () => {
      try {
        const resp = await profileService.loadProfile();
        setProfile(resp.data);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to load selected community details',
          message,
        });
        setProfile(null);
      } finally {
        setProfileFetched(true);
      }
    };
    load();
  }, [accessToken, profile, profileFetched, setProfile]);

  // Load default community on component mount
  useEffect(() => {
    if (!accessToken || communityInitialized) {
      // wait until we have an access token or if already initialized
      if (!accessToken) setIsLoadingDefault(false);
      return;
    }

    const loadDefaultCommunity = async () => {
      try {
        setIsLoadingDefault(true);
        const response = await communityService.getCommunitiesMe({ limit: 1 });

        // Combine ownedCommunities and memberShips into one array
        const ownedCommunities = response.data?.ownedCommunities || [];
        const membershipCommunities = (response.data?.memberShips || [])
          .map((membership: Community | { community: Community }) => {
            // Handle both structures: direct community object or nested under 'community' property
            return 'community' in membership
              ? membership.community
              : membership;
          })
          .filter((community: Community) => community && community.id);

        const allCommunities = [
          ...ownedCommunities,
          ...membershipCommunities,
        ].filter((community: Community) => community && community.id);

        if (allCommunities.length > 0) {
          const firstCommunity = allCommunities[0];

          // Call getCommunityById to get more specific data and store it properly
          const communityDetailResponse =
            await communityService.getCommunityById(firstCommunity.id);
          const { community: detailedCommunity, userCommunity } =
            communityDetailResponse.data;
          // set canonical community first so subscribers update immediately
          setCommunity(detailedCommunity);

          setCommunityData({ community: detailedCommunity, userCommunity });
          if (detailedCommunity?.accountId == null) {
            showToast({
              type: 'default-error',
              title: 'No account ID found,Please setup Razorpay',
            });
            router.push(`/razorpay-setup?communityId=${detailedCommunity.id}`);
            return;
          }
          if (detailedCommunity?.name == '') {
            showToast({
              type: 'default-error',
              title:
                'Community is not setup yet,Please setup community profile',
            });
            router.push(
              `community-profile?communityId=${detailedCommunity.id}`,
            );
            return;
          }
          // Also fetch workspaces for the default community
          try {
            const workspacesResponse = await workspaceService.getWorkspacesMe(
              firstCommunity.id,
            );
            const workspacesData = workspacesResponse.data || [];
            setWorkspaces(workspacesData);

            // Set the first workspace as selected by default if workspaces exist
            if (workspacesData.length > 0) {
              setSelectedWorkspaceId(workspacesData[0].id);
              setWorkspace(workspacesData[0]);
            } else {
              clearWorkspaces();
            }
          } catch (error) {
            const message = getErrorMessage(error);
            showToast({
              type: 'default-error',
              title: 'Failed to load workspaces for default community',
              message,
            });
            clearWorkspaces();
          }
        } else {
          showToast({
            type: 'default-error',
            title: 'No communities found for user',
          });
        }
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to load default community',
          message,
        });
      } finally {
        // Add a small delay to prevent loading state from flashing
        setTimeout(() => {
          setIsLoadingDefault(false);
          setCommunityInitialized(true);
        }, 100);
      }
    };

    const validateAndLoadWorkspaces = async (persistedCommunity: Community) => {
      try {
        setIsLoadingDefault(true);
        // Validate that the persisted community still exists and user has access
        const communityDetailResponse = await communityService.getCommunityById(
          persistedCommunity.id,
        );
        const { community: detailedCommunity, userCommunity } =
          communityDetailResponse.data;

        // Update community data with fresh data from server
        setCommunityData({ community: detailedCommunity, userCommunity });

        // Load workspaces for the persisted community
        const workspacesResponse = await workspaceService.getWorkspacesMe(
          persistedCommunity.id,
        );
        const workspacesData = workspacesResponse.data || [];
        setWorkspaces(workspacesData);

        // Set the first workspace as selected by default if workspaces exist and none is selected
        if (workspacesData.length > 0) {
          setSelectedWorkspaceId(workspacesData[0].id);
          setWorkspace(workspacesData[0]);
        } else {
          clearWorkspaces();
        }
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to validate persisted community',
          message,
        });
        // If validation fails, clear the persisted community and load default
        clearCommunity();
        clearWorkspaces();
        loadDefaultCommunity();
        return;
      } finally {
        setTimeout(() => {
          setIsLoadingDefault(false);
          setCommunityInitialized(true);
        }, 100);
      }
    };

    // Check if we have a persisted community
    if (community && community.id) {
      // Validate and load workspaces for persisted community
      validateAndLoadWorkspaces(community);
    } else {
      // No persisted community, load default
      loadDefaultCommunity();
    }
  }, [
    accessToken,
    communityInitialized,
    community,
    setCommunity,
    setCommunityData,
    clearCommunity,
    setWorkspaces,
    setSelectedWorkspaceId,
    setWorkspace,
    clearWorkspaces,
  ]);

  useEffect(() => {
    const classes = ['mb-52', 'sm:mb-52', 'md:mb-60', 'lg:mb-32'];
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

  if (
    HIDE_HEADER_PATHS.includes(pathname) ||
    !isAuthenticated ||
    !accessToken ||
    !community
  ) {
    return null;
  }
  return (
    <header className="pointer-events-none">
      <div className="container relative">
        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 md:bottom-[50px] w-full max-w-[1100px] px-4 pointer-events-auto z-50">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <CommunitiesDropdown
              isLoadingDefault={isLoadingDefault}
              community={community}
            />
            <div className="rounded-[20px] bg-[#F6F6F6] border border-[#ECECEC] px-3 py-2 flex flex-wrap items-center gap-3 justify-center">
              <Link href="/" className="font-extrabold text-lg text-[#000000]">
                <img src="/Klub.png" alt="klub logo" width={64} height={29} />
              </Link>

              <div className="h-6 w-px bg-slate-200 mx-1 rounded" />

              <div className="flex items-center gap-3 min-w-0">
                <Link
                  href="/feed"
                  className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/feed' ? 'border-[#0A5DBC] bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
                >
                  {pathname === '/feed' ? (
                    <>
                      <Image
                        src="/feedIcon.svg"
                        alt="feed icon"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] flex-shrink-0"
                      />
                      <span className="text-base font-medium whitespace-nowrap">
                        Feed
                      </span>
                    </>
                  ) : (
                    <Image
                      src="/feedIconInactive.svg"
                      alt="feed icon"
                      width={22}
                      height={22}
                      className="w-[22px] h-[22px] flex-shrink-0"
                    />
                  )}
                </Link>

                <nav className="hidden sm:flex items-center gap-3 whitespace-nowrap">
                  <Link
                    href="/courses"
                    className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/courses' || pathname === '/create-course' ? 'border-[#0A5DBC] bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
                  >
                    {pathname === '/courses' ||
                    pathname === '/create-course' ? (
                      <>
                        <Image
                          src="/playIconBlue.svg"
                          alt="courses icon"
                          width={22}
                          height={22}
                          className="w-[22px] h-[22px] flex-shrink-0"
                        />
                        <span className="text-base font-medium whitespace-nowrap">
                          Courses
                        </span>
                      </>
                    ) : (
                      <Image
                        src="/playIconInactive.svg"
                        alt="courses icon"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] flex-shrink-0"
                      />
                    )}
                  </Link>

                  <Link
                    href="/events"
                    className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === '/events' ? 'border-[#0A5DBC] bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
                  >
                    {pathname === '/events' ? (
                      <>
                        <Image
                          src="/calendarBlueH.svg"
                          alt="events icon"
                          width={22}
                          height={22}
                          className="w-[22px] h-[22px] flex-shrink-0"
                        />
                        <span className="text-base font-medium whitespace-nowrap">
                          Events
                        </span>
                      </>
                    ) : (
                      <Image
                        src="/calendarInactive.svg"
                        alt="events icon"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] flex-shrink-0"
                      />
                    )}
                  </Link>

                  <Link
                    href="/klub-profile"
                    className={`rounded-[10px] p-3 flex items-center gap-2 ${pathname === `/klub-profile` ? 'border-[#0A5DBC] bg-[#E6EFF8] text-[#0A5DBC] hover:bg-[#E6EFF8]' : 'bg-white'}`}
                  >
                    {pathname === `/klub-profile` ? (
                      <>
                        <Image
                          src="/briefcaseBlue.svg"
                          alt="profile icon"
                          width={22}
                          height={22}
                          className="w-[22px] h-[22px] flex-shrink-0"
                        />
                        <span className="text-base font-medium whitespace-nowrap">
                          Klub Profile
                        </span>
                      </>
                    ) : (
                      <Image
                        src="/briefcaseInactive.svg"
                        alt="profile icon"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] flex-shrink-0"
                      />
                    )}
                  </Link>
                </nav>
              </div>

              <div className="h-6 w-px bg-slate-200 mx-1 rounded" />

              <div className="flex items-center gap-3">
                <NotificationsDropdown />

                <Link
                  href="/setting/profile"
                  className={`rounded-[10px] p-3 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-0 ${isActive ? 'border-[#0A5DBC] bg-[#E6EFF8] text-[#0A5DBC]' : 'bg-white'}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Image
                    src={
                      isActive ? '/settingsBlue.svg' : '/settingsInactive.svg'
                    }
                    alt="settings icon"
                    width={22}
                    height={22}
                    className="w-[22px] h-[22px] flex-shrink-0"
                  />
                  {isActive ? (
                    <span className="text-base font-medium whitespace-nowrap">
                      Settings
                    </span>
                  ) : null}
                </Link>
                <Link
                  href="/dashboard"
                  className={`rounded-[10px] h-[46px] p-3 flex items-center gap-2 ${pathname === `/dashboard` ? 'border-[#0A5DBC] bg-[#E6EFF8] text-[#0A5DBC] hover:bg-[#E6EFF8]' : 'bg-white'}`}
                >
                  {pathname === `/dashboard` ? (
                    <>
                      <Image
                        src="/dashboardBlue.svg"
                        alt="profile icon"
                        width={22}
                        height={22}
                        className="w-[22px] h-[22px] flex-shrink-0"
                      />
                      <span className="text-base font-medium whitespace-nowrap">
                        Dashboard
                      </span>
                    </>
                  ) : (
                    <Image
                      src="/dashboardInactive.svg"
                      alt="profile icon"
                      width={22}
                      height={22}
                      className="w-[22px] h-[22px] flex-shrink-0"
                    />
                  )}
                </Link>

                {/* <AppsMenu /> */}
                <div className="h-6 w-px bg-slate-200 mx-1 rounded" />
                <ProfileMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

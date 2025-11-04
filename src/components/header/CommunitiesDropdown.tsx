'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from 'src/components/ui/dropdown-menu';
import { Input } from '../ui/input';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';
import { communityService } from 'src/axios/community/communityApi';
import { workspaceService } from 'src/axios/workspace/workspace';
import { Community } from 'src/types/community.types';
import Link from 'next/link';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { useRouter } from 'next/navigation';

export default function CommunitiesDropdown({
  isLoadingDefault,
  community,
}: {
  isLoadingDefault?: boolean;
  community?: Community;
}) {
  const { setCommunity, setCommunityData } = useCommunityStore();
  const {
    setWorkspaces,
    setSelectedWorkspaceId,
    setWorkspace,
    clearWorkspaces,
  } = useWorkspaceStore();
  const [open, setOpen] = useState(false);
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToastStore();
  const router = useRouter();
  // Load communities list when dropdown is opened
  const handleDropdownOpen = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await communityService.getCommunitiesMe();
      const ownedCommunities = response.data?.ownedCommunities || [];
      const membershipCommunities = (response.data?.memberShips || [])
        .map((membership: Community | { community: Community }) => {
          return 'community' in membership ? membership.community : membership;
        })
        .filter((community: Community) => community && community.id); // Filter out null/undefined communities

      const allCommunities = [
        ...ownedCommunities,
        ...membershipCommunities,
      ].filter((community: Community) => community && community.id); // Additional safety filter

      setCommunities(allCommunities);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to load communities',
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle community selection
  const handleCommunitySelect = async (selectedCommunity: Community) => {
    try {
      // Fetch detailed community data and store it in the store
      if (selectedCommunity.id) {
        const response = await communityService.getCommunityById(
          selectedCommunity.id,
        );
        const { community: detailedCommunity, userCommunity } = response.data;
        setCommunityData({ community: detailedCommunity, userCommunity });
        if (detailedCommunity?.accountId == null) {
          showToast({
            type: 'default-error',
            title: 'No account ID found, redirecting to Razorpay setup',
          });
          router.push(`/razorpay-setup?communityId=${detailedCommunity.id}`);
          return;
        }
        if (detailedCommunity?.name == '') {
          showToast({
            type: 'default-error',
            title:
              'Community is not setup yet, redirecting to community profile',
          });
          router.push(`community-profile?communityId=${detailedCommunity.id}`);
          return;
        }

        // After setting community data, fetch and set workspaces
        try {
          const workspacesResponse = await workspaceService.getWorkspacesMe(
            selectedCommunity.id,
          );
          const workspacesData = workspacesResponse.data || [];
          setWorkspaces(workspacesData);

          // Set the first workspace as selected by default if workspaces exist
          if (workspacesData.length > 0) {
            setSelectedWorkspaceId(workspacesData[0].id);
            setWorkspace(workspacesData[0]);
          } else {
            // Clear workspace data if no workspaces found
            clearWorkspaces();
          }
        } catch (workspaceError) {
          const message = getErrorMessage(workspaceError);
          showToast({
            type: 'default-error',
            title: 'Failed to load workspaces for community',
            message,
          });
          clearWorkspaces();
        }
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to load selected community details',
        message,
      });
      // Fallback to setting the basic community data
      setCommunity(selectedCommunity);
      clearWorkspaces();
    }
  };
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (val) handleDropdownOpen();
      }}
    >
      <DropdownMenuTrigger asChild>
        <div
          className="rounded-[20px] bg-[#F6F6F6] border border-[#ECECEC] px-3 py-2 flex items-center"
          aria-label="Open communities menu"
          role="button"
        >
          <div className="w-11 h-11 rounded-lg overflow-hidden flex items-center justify-center bg-gradient-to-br from-sky-500 to-indigo-600">
            {isLoadingDefault ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : community?.image &&
              typeof community.image === 'string' &&
              community.image.trim() !== '' ? (
              <Image
                src={community.image}
                alt={community.name}
                width={44}
                height={44}
                className="object-cover h-full w-full"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {community?.name?.charAt(0) || 'K'}
                </span>
              </div>
            )}
          </div>
          <Image
            src="/upDownArrowFill.svg"
            alt="down arrow icon"
            width={24}
            height={32}
            className="object-cover"
          />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="p-0 z-50 rounded-[20px] mb-4"
      >
        <div className="p-5 bg-white rounded-[20px] overflow-hidden shadow-md w-[313px]">
          <div className="pb-0">
            <div className="hidden sm:block w-full relative">
              <Image
                src="/Search.svg"
                alt="Search"
                width={22}
                height={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
              />
              <Input
                placeholder="Find a post, topic.."
                className="pl-12 rounded-[15px] py-2 bg-white w-full h-11"
              />
            </div>
          </div>

          <ul className="py-4 space-y-4 border-b border-[#ECECEC]">
            <li className="w-full rounded-[15px] pr-0 p-1 bg-[#F6F6F6] hover:bg-gray-50">
              <Link
                href="/"
                className="flex items-center justify-start gap-3"
                onClick={() => setOpen(false)}
              >
                <span className="w-11 h-11 rounded-[15px] overflow-hidden flex items-center justify-center bg-[#0A5DBC]">
                  <Image
                    src="/discover.svg"
                    alt="discover icon"
                    width={22}
                    height={22}
                    className="object-cover"
                  />
                </span>
                <span className="font-medium text-sm text-[#000000]">
                  Discover Klubs
                </span>
              </Link>
            </li>

            <li className="w-full rounded-[15px] pr-0 p-1 bg-[#F6F6F6] hover:bg-gray-50">
              <Link
                href="/create-community"
                className="flex items-center justify-start gap-3"
                onClick={() => setOpen(false)}
              >
                <span className="w-11 h-11 rounded-[15px] overflow-hidden flex items-center justify-center bg-[#0A5DBC]">
                  <Image
                    src="/add.svg"
                    alt="discover icon"
                    width={22}
                    height={22}
                    className="object-cover"
                  />
                </span>
                <span className="font-medium text-sm text-[#000000]">
                  Create a Klub
                </span>
              </Link>
            </li>
          </ul>

          <div className="pt-5">
            <div className="text-sm font-medium text-[#787878] mb-3">
              My Communities
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="text-sm text-gray-500">
                  Loading communities...
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[273px] overflow-auto scrollbar-hide">
                {communities
                  .filter((c) => c && c.id)
                  .map((c) => (
                    <div
                      key={c.id}
                      className={`flex items-center gap-3 rounded-[15px] pl-2 cursor-pointer`}
                      onClick={() => handleCommunitySelect(c)}
                    >
                      <div className="w-11 h-11 rounded-[15px] overflow-hidden">
                        {c.image &&
                        typeof c.image === 'string' &&
                        c.image.trim() !== '' ? (
                          <Image
                            src={c.image}
                            alt={c.name || 'Untitled community'}
                            width={44}
                            height={44}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {(c.name && c.name.trim().charAt(0)) || 'K'}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-[#000000] font-medium flex-1">
                        {c.name && c.name.trim() !== ''
                          ? c.name
                          : 'Untitled community'}
                      </div>
                      {community?.id === c.id && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  ))}
                {communities.length === 0 &&
                  !isLoading &&
                  !isLoadingDefault && (
                    <div className="text-sm text-gray-500 text-center py-4">
                      No communities found
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

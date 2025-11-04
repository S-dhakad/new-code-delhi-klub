import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { communityService } from 'src/axios/community/communityApi';
import { workspaceService } from 'src/axios/workspace/workspace';
import { Community } from 'src/types/community.types';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';
import { useRouter } from 'next/navigation';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';

type Props = { onClose?: () => void };

const HamburgerMenu = ({ onClose }: Props) => {
  const { setCommunity, setCommunityData } = useCommunityStore();
  const {
    setWorkspaces,
    setSelectedWorkspaceId,
    setWorkspace,
    clearWorkspaces,
  } = useWorkspaceStore();
  const { showToast } = useToastStore();
  const router = useRouter();

  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const MenuItems = [
    {
      title: 'Settings',
      subtitle: 'Edit your profile and preferences here',
      icon: '/settingsInactive.svg',
      iconColor: 'secondary',
      href: '/setting/profile',
    },
    {
      title: 'Dashboard',
      subtitle: 'View & Manage your Courses & Subscriptions',
      icon: '/dashboardInactive.svg',
      iconColor: 'secondary',
      href: '/dashboard',
    },
    {
      title: 'Discover Klubs',
      subtitle: 'Find new communities to join',
      icon: '/discover.svg',
      iconColor: 'primary',
      href: '/discovery',
    },
    {
      title: 'Create a Klub',
      subtitle: 'Create your own community & build a brand',
      icon: '/add.svg',
      iconColor: 'primary',
      href: '/create-community',
    },
  ];

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const response = await communityService.getCommunitiesMe();
        const ownedCommunities = response.data?.ownedCommunities || [];
        const membershipCommunities = (response.data?.memberShips || [])
          .map((membership: Community | { community: Community }) =>
            'community' in membership ? membership.community : membership,
          )
          .filter((c: Community) => c && c.id);
        const all = [...ownedCommunities, ...membershipCommunities].filter(
          (c: Community) => c && c.id,
        );
        if (mounted) setCommunities(all);
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
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCommunitySelect = async (selectedCommunity: Community) => {
    try {
      if (selectedCommunity.id) {
        const response = await communityService.getCommunityById(
          selectedCommunity.id,
        );
        const { community: detailedCommunity, userCommunity } = response.data;
        setCommunityData({ community: detailedCommunity, userCommunity });
        if (detailedCommunity?.accountId == null) {
          router.push(`/razorpay-setup?communityId=${detailedCommunity.id}`);
          onClose?.();
          return;
        }
        if (detailedCommunity?.name == '') {
          router.push(`community-profile?communityId=${detailedCommunity.id}`);
          onClose?.();
          return;
        }
        try {
          const workspacesResponse = await workspaceService.getWorkspacesMe(
            selectedCommunity.id,
          );
          const workspacesData = workspacesResponse.data || [];
          setWorkspaces(workspacesData);
          if (workspacesData.length > 0) {
            setSelectedWorkspaceId(workspacesData[0].id);
            setWorkspace(workspacesData[0]);
          } else {
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
      setCommunity(selectedCommunity);
      clearWorkspaces();
    } finally {
      onClose?.();
    }
  };

  return (
    <div className="bg-white max-w-[500px] mx-auto">
      <div className="flex items-center justify-between px-4 py-5 text-text-secondary border-b">
        <p className="font-medium">Menu</p>
        <button aria-label="Close menu" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="mt-5 flex flex-col gap-5 px-4">
        {MenuItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <div className="flex items-center gap-3">
              <div
                className={`p-3 rounded-[10px] ${item.iconColor === 'primary' ? 'bg-primary' : 'bg-[#F6F6F6]'}`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={22}
                  height={22}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-text-secondary text-sm font-medium">
                  {item.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-7 px-4">
        <p className="text-text-secondary font-medium">My Communities</p>
        <div className="mt-5">
          {isLoading ? (
            <div className="text-sm text-gray-500 py-2">
              Loading communities...
            </div>
          ) : (
            <div className="space-y-4 max-h-[273px] overflow-auto scrollbar-hide">
              {communities
                .filter((c) => c && c.id)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-3 rounded-[15px] pl-2 cursor-pointer"
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
                    <div className="text-sm font-semibold flex-1">
                      {c.name && c.name.trim() !== ''
                        ? c.name
                        : 'Untitled community'}
                    </div>
                  </div>
                ))}
              {communities.length === 0 && (
                <div className="text-sm text-gray-500 text-center py-4">
                  No communities found
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;

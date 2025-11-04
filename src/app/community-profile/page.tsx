// components/CommunityProfilePage.tsx
'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Card } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import Link from 'next/link';
import { Community, UpdateCommunityDto } from 'src/types/community.types';
import { communityService } from 'src/axios/community/communityApi';
import { workspaceService } from 'src/axios/workspace/workspace';
import { useProfileStore } from 'src/store/profile.store';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import FileUploader, { MediaItem } from 'src/components/FileUploader';
import { FileUploadPayload } from 'src/types/uploads.types';
import { useToastStore } from 'src/store/toast.store';
import MediaUploader from 'src/components/MediaUploader';
import { useSearchParams, useRouter } from 'next/navigation';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import SetupMobileHeader from 'src/components/mobile/community-profile/SetupMobileHeader';
import { useIsMobile } from 'src/hooks/useIsMobile';

type HeaderProps = {
  userHandle?: string;
};

type BannerType = {
  url: string;
  type: 'image' | 'video';
  name?: string;
  isObjectURL?: boolean;
};

export default function CommunityProfilePage({}: HeaderProps) {
  const allTopics: string[] = [
    'Technology',
    'Business',
    'Side Hustle',
    'Health & Fitness',
    'Finance',
    'Sales',
    'Travel',
    'Food',
    'Psychology',
    'English',
    'AI',
    'MVPs',
    'Entrepreneurship',
    'Marketing',
    'Spirituality',
  ];

  const searchParams = useSearchParams();
  const router = useRouter();
  const [communityId, setCommunityId] = useState<string>('');
  const { profile } = useProfileStore();
  const isMobile = useIsMobile();
  const { setCommunityData } = useCommunityStore();
  const { setWorkspaces, setSelectedWorkspaceId } = useWorkspaceStore();
  const [spaces, setSpaces] = useState<string[]>(['General', 'Introductions']);
  const [newSpace, setNewSpace] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const { showToast } = useToastStore();
  const [banner, setBanner] = useState<BannerType | null>(null);

  // Get communityId from URL params
  useEffect(() => {
    const id = searchParams.get('communityId');
    if (id) {
      setCommunityId(id);
    } else {
      // Redirect to create-community if no communityId
      showToast({
        title: 'Invalid Access',
        message: 'Please complete payment first to create a community.',
        type: 'default-error',
      });
      router.push('/create-community');
    }
  }, [searchParams, router, showToast]);

  // Add background for the body
  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);
  // Image upload state
  const [communityImage, setCommunityImage] = useState<MediaItem>({
    id: 'community-default',
    type: 'image',
    url: '',
    name: 'community image',
    isObjectURL: false,
  });
  const [communityImageData, setCommunityImageData] =
    useState<FileUploadPayload | null>(null);
  const [community, setCommunity] = useState<Community>({
    id: '',
    name: '',
    bio: '',
    description: '',
    topics: [],
    isActive: true,
    isPaid: false,
    subscriptionAmount: 0,
    website: '',
    youtube: '',
    instagram: '',
    linkedin: '',
    createdAt: '',
    updatedAt: '',
    members: [],
    workspaces: [],
    _count: {
      posts: 0,
      workspaces: 0,
      members: 0,
    },
  });

  // Form handlers
  const handleInputChange = (
    field: keyof Community,
    value: string | number | boolean,
  ) => {
    setCommunity((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTopicToggle = (topic: string) => {
    setCommunity((prev) => ({
      ...prev,
      topics: prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic],
    }));
  };

  const handleAddSpace = () => {
    if (newSpace.trim() && !spaces.includes(newSpace.trim())) {
      setSpaces((prev) => [...prev, newSpace.trim()]);
      setNewSpace('');
    }
  };

  const handleRemoveSpace = (spaceToRemove: string) => {
    setSpaces((prev) => prev.filter((space) => space !== spaceToRemove));
  };

  // File upload handlers
  const handleCommunityImageFilesAdded = (
    _files: File[],
    items: MediaItem[],
  ) => {
    if (!items || items.length === 0) return;
    const first = items[0];

    if (communityImage?.isObjectURL) {
      try {
        URL.revokeObjectURL(communityImage.url);
      } catch {}
    }

    setCommunityImage({
      id: first.id,
      type: 'image',
      url: first.url,
      name: first.name,
      isObjectURL: true,
    });

    if (first.s3Data) {
      setCommunityImageData({
        key: first.s3Data.fileKey,
        mimetype: first.s3Data.mimetype,
        size: first.s3Data.size,
      });
    }
  };

  // Function to handle form submission (update community + create workspaces)
  const handleSaveAndProceedCommunityProfile = useCallback(async () => {
    if (!communityId) {
      showToast({
        title: 'Invalid Access',
        message: 'Community ID is missing. Please try again.',
        type: 'default-error',
      });
      router.push('/create-community');
      return;
    }

    if (!communityImage.url) {
      showToast({
        title: 'First Upload community Image',
        type: 'default-error',
      });
      return;
    }

    if (!community.name.trim()) {
      showToast({
        title: 'Community Name is required.',
        type: 'default-error',
      });
      return;
    }

    if (!community.bio?.trim()) {
      showToast({
        title: 'Community Bio is required.',
        type: 'default-error',
      });
      return;
    }

    if (community.topics.length === 0) {
      showToast({
        title: 'Select at least one topic for your community.',
        type: 'default-error',
      });
      return;
    }

    if (
      community.isPaid &&
      (!community.subscriptionAmount || community.subscriptionAmount <= 0)
    ) {
      showToast({
        title: 'Please enter a valid subscription amount for a paid community.',
        type: 'default-error',
      });
      return;
    }

    try {
      setLoading(true);
      // Exclude id from the community data before sending
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...communityData } = community;
      const communityFilteredData = {
        ...communityData,
        topics: community.topics.map((topic) => topic.toLowerCase()),
        image: communityImageData || undefined,
      };

      // Update community with all details including social media links
      const response = await communityService.updateCommunity(
        communityId,
        communityFilteredData as UpdateCommunityDto,
      );

      if (!response.success) {
        showToast({
          title: 'Update Failed',
          message: 'Failed to update community profile. Please try again.',
          type: 'default-error',
        });
        return;
      }
      const workspaces = [...spaces, ...newSpace];
      // Create workspaces using Promise.all
      const workspacesResponse = await Promise.all(
        workspaces.map(async (space) => {
          return await workspaceService.createWorkspace(communityId, {
            name: space,
            description: space,
            isPrivate: false,
          });
        }),
      );

      // Check if any workspace creation failed
      if (workspacesResponse.some((res) => !res.success)) {
        showToast({
          title: 'Workspace Creation Failed',
          message: 'Some workspaces could not be created. Please try again.',
          type: 'default-error',
        });
        return;
      }

      // Fetch updated community data and update stores
      try {
        const [communityResponse, workspacesResponse] = await Promise.all([
          communityService.getCommunityById(communityId),
          workspaceService.getWorkspacesMe(communityId),
        ]);

        if (communityResponse.success && workspacesResponse.success) {
          // Update community store with latest data
          setCommunityData({
            community: communityResponse.data.community,
            userCommunity: communityResponse.data.userCommunity,
          });

          // Update workspace store with latest workspaces
          setWorkspaces(workspacesResponse.data);

          // Set the first workspace as selected if available
          if (workspacesResponse.data.length > 0) {
            setSelectedWorkspaceId(workspacesResponse.data[0].id);
          }

          showToast({
            title: 'Community profile saved successfully',
            message: 'You can now start creating content in your community.',
            type: 'default-success',
          });

          // Navigate to feed with updated state
          router.push('/feed');
        } else {
          throw new Error('Failed to fetch updated community data');
        }
      } catch (fetchError) {
        showToast({
          title: 'Community Updated',
          message:
            'Community saved but failed to fetch latest data. Please refresh the page.',
          type: 'default-success',
        });

        // Still navigate to feed even if fetch fails
        window.location.href = '/feed';
      }
    } catch (error) {
      setLoading(false);
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'An error occurred while saving. Please try again.',
        message,
      });
    } finally {
      setLoading(false);
    }
  }, [
    communityId,
    community,
    communityImageData,
    communityImage.url,
    spaces,
    newSpace,
    showToast,
    router,
    setCommunityData,
    setWorkspaces,
    setSelectedWorkspaceId,
  ]);

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (communityImage?.isObjectURL) {
        try {
          URL.revokeObjectURL(communityImage.url);
        } catch {
          /* ignore */
        }
      }
    };
  }, [communityImage]);

  const handleFilesAdded = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const isVideo = file.type.startsWith('video');
      const bannerData: BannerType = {
        url: URL.createObjectURL(file),
        type: isVideo ? 'video' : 'image',
        name: file.name,
        isObjectURL: true,
      };
      setBanner(bannerData);
    }
  };
  const handleRemove = () => {
    setBanner(null);
  };

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (communityImage?.isObjectURL) {
        try {
          URL.revokeObjectURL(communityImage.url);
        } catch {
          /* ignore */
        }
      }
    };
  }, [communityImage]);

  return (
    <div>
      {/* Header */}
      {isMobile ? (
        <SetupMobileHeader />
      ) : (
        <div className="relative w-full border-b border-[#ECECEC] bg-white pt-[30px] pb-[15px]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="relative flex items-center h-16">
              {/* Left: logo */}
              <div className="flex-shrink-0">
                <Link
                  href="/"
                  className="text-[36px] font-extrabold italic text-[#000000]"
                >
                  Klub
                </Link>
              </div>

              {/* Center: headline */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="flex items-center text-base text-slate-700 font-semibold">
                  <span className="mr-1 text-lg font-medium text-[#000000]">
                    Setup your
                  </span>
                  <span className="pointer-events-auto text-lg text-[#0A5DBC] font-semibold">
                    Community Profile
                  </span>
                </div>
              </div>

              {/* Right: profile button (static) */}
              <div className="ml-auto">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-[#F6F6F6] border px-3 py-1">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden ring-1 ring-slate-200">
                    {profile?.profilePicture && (
                      <Image
                        src={profile.profilePicture}
                        alt="profile icon"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    )}
                  </div>

                  <div className="text-left">
                    <div className="text-base font-semibold text-slate-900 leading-4">
                      {profile?.firstName} {profile?.lastName}
                    </div>
                    <div className="text-sm font-medium text-slate-400 leading-4 mt-1">
                      {profile?.username}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[471px] mx-auto mt-[30px] pb-[30px] relative px-4 md:px-0">
        {isMobile && (
          <h1 className="text-[22px] font-semibold mb-[30px]">
            Setup your <span className="text-primary">Community Profile</span>
          </h1>
        )}
        <Card className="border-none shadow-none p-0">
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 relative">
              <div className="relative h-[94px] w-[94px] overflow-hidden rounded-2xl border-2 border-[#0A5DBC] p-2 bg-white">
                {communityImage.url && (
                  <Image
                    src={communityImage.url}
                    alt="community icon"
                    width={100}
                    height={100}
                    className="rounded-2xl"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                )}
              </div>
              <FileUploader
                accept="image/*"
                multiple={false}
                maxFiles={1}
                onFilesAdded={handleCommunityImageFilesAdded}
                onError={(msg) => console.warn(msg)}
              >
                {(open) => (
                  <div
                    className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs shadow-sm absolute bottom-[-10px] right-[-32px] cursor-pointer"
                    onClick={open}
                  >
                    <Image src="/Edit.svg" alt="Edit" width={14} height={14} />
                    Edit
                  </div>
                )}
              </FileUploader>
            </div>
          </div>

          {/* Inputs (readOnly) */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Enter Community Name *
              </label>
              <Input
                value={community.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="AI Automation Agency Hub"
                className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Enter Community Bio *
              </label>
              <Input
                value={community.bio || ''}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Peak Performance Hub for C-Suite Executives"
                className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Upload Banner/Intro video *
              </label>
              <MediaUploader
                banner={banner}
                onFilesAdded={handleFilesAdded}
                onRemove={handleRemove}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Enter Community Location *
              </label>
              <div className="relative">
                <Select>
                  <SelectTrigger
                    className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium w-full"
                    style={{ height: '40px' }}
                  >
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pune">Pune, India</SelectItem>
                    <SelectItem value="mumbai">Mumbai, India</SelectItem>
                    <SelectItem value="delhi">Delhi, India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Enter Community Description
              </label>
              <Textarea
                value={community.description || ''}
                onChange={(e) =>
                  handleInputChange('description', e.target.value)
                }
                placeholder="Write about your community, what it offers, and who it's for..."
                rows={6}
                className="p-[15px] pb-11 resize-none border-[#ECECEC] rounded-[15px] font-medium text-sm text-[#000000]"
              />
            </div>
          </div>

          {/* Topics / Billing / Spaces (static visuals) */}
          <div className="space-y-6">
            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                What are the topics under this community? (select at least 1) *
              </label>
              <div className="flex flex-wrap gap-3">
                {allTopics.map((t) => {
                  const active = community.topics.includes(t);
                  return (
                    <div
                      key={t}
                      onClick={() => handleTopicToggle(t)}
                      className={`px-3 py-1.5 rounded-[10px] text-sm font-medium border cursor-pointer  h-[34px] ${active ? 'bg-[#E6EFF8] border-[#0A5DBC] text-[#0A5DBC]' : 'bg-white border-[#ECECEC] text-[#787878]'}`}
                    >
                      {t}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Paid toggle (static) */}
            <div className="items-center gap-6">
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Is this Community Free or Paid? *
              </label>
              <div className="flex items-center gap-3 select-none mt-2">
                <div
                  onClick={() => handleInputChange('isPaid', !community.isPaid)}
                  className={`w-12 h-7 rounded-full shadow-md flex items-center px-1 cursor-pointer transition-colors ${community.isPaid ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${community.isPaid ? 'translate-x-5' : 'translate-x-0'}`}
                  />
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {community.isPaid ? 'Paid' : 'Free'}
                </div>
              </div>
            </div>

            {/* Subscription amount (static) */}
            {community.isPaid && (
              <div>
                <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                  What is the the Subscription amount for this community?*
                </label>
                <div>
                  <Input
                    type="number"
                    value={community.subscriptionAmount || ''}
                    onChange={(e) =>
                      handleInputChange(
                        'subscriptionAmount',
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="Please Enter subscription Amount"
                    disabled={!community.isPaid}
                    className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium appearance-none ocus:outline-none"
                  />
                </div>
              </div>
            )}
            {/* Spaces (static) */}
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Add spaces inside the community
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {spaces.map((space, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-1 rounded-[10px] border border-[border-[#ECECEC] px-3 py-1 h-[34px] ${isEditing ? 'bg-white' : 'bg-[#F6F6F6]'}`}
                  >
                    <span className="text-[#787878]">#</span>
                    <Input
                      value={space}
                      readOnly={!isEditing}
                      className="bg-transparent border-none focus:outline-none text-sm font-medium text-[#787878] px-1"
                      style={{ width: `${space.length}ch` }}
                    />
                    {isEditing && (
                      <Image
                        src="/cross.svg"
                        alt="remove"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                        onClick={() => handleRemoveSpace(space)}
                      />
                    )}
                  </div>
                ))}
                <Input
                  value={newSpace}
                  onChange={(e) => setNewSpace(e.target.value)}
                  placeholder="Enter space name"
                  className="text-xs px-2 py-1 h-8 w-[200px]"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSpace();
                    }
                  }}
                />
                <Button
                  size="sm"
                  onClick={handleAddSpace}
                  className="bg-[#0A5DBC] text-sm font-medium text-white hover:bg-primary h-[34px] rounded-[10px] transition-colors duration-300 hover:bg-[#053875]"
                >
                  + Add new
                </Button>
                <Button
                  className="rounded-[10px] border border-[#ECECEC] bg-white text-sm font-medium text-[#000000] px-3 py-1 w-1/2 lg:w-auto h-[34px]"
                  onClick={() => setIsEditing((prev) => !prev)}
                >
                  {isEditing ? 'Done' : 'Edit'}
                </Button>
              </div>
            </div>

            {/* Brand URLs (static UI) */}
            <div>
              <label className="block text-sm font-medium text-[#787878] mb-[10px]">
                Add your brand URLs
              </label>

              <Card className="rounded-[20px] py-[30px] px-[20px] bg-[#F6F6F6] border border-[#ECECEC]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-[#000000]">
                      My Website
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/copy.svg"
                        alt="Link"
                        width={16}
                        height={16}
                        className="absolute ml-3"
                      />
                      <Input
                        value={community.website || ''}
                        onChange={(e) =>
                          handleInputChange('website', e.target.value)
                        }
                        placeholder="https://www.website.com"
                        className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-base font-semibold text-[#000000]">
                      YouTube
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/copy.svg"
                        alt="Link"
                        width={16}
                        height={16}
                        className="absolute ml-3"
                      />
                      <Input
                        value={community.youtube || ''}
                        onChange={(e) =>
                          handleInputChange('youtube', e.target.value)
                        }
                        placeholder="https://youtube.com/@yourchannel"
                        className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-base font-semibold text-[#000000]">
                      Instagram
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/copy.svg"
                        alt="Link"
                        width={16}
                        height={16}
                        className="absolute ml-3"
                      />
                      <Input
                        value={community.instagram || ''}
                        onChange={(e) =>
                          handleInputChange('instagram', e.target.value)
                        }
                        placeholder="https://instagram.com/yourusername"
                        className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-base font-semibold text-[#000000]">
                      LinkedIn
                    </div>
                    <div className="flex items-center gap-3">
                      <Image
                        src="/copy.svg"
                        alt="Link"
                        width={16}
                        height={16}
                        className="absolute ml-3"
                      />
                      <Input
                        value={community.linkedin || ''}
                        onChange={(e) =>
                          handleInputChange('linkedin', e.target.value)
                        }
                        placeholder="https://linkedin.com/in/yourprofile"
                        className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-[#000000]">
                      Custom URL 1
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 w-full">
                          <Image
                            src="/text.svg"
                            alt="text icon"
                            width={16}
                            height={16}
                            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            defaultValue=""
                            placeholder="Add a URL name"
                            className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          />
                        </div>
                        <div className="relative flex-1 w-full">
                          <Image
                            src="/copy.svg"
                            alt="copy icon"
                            width={16}
                            height={16}
                            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            defaultValue=""
                            placeholder="Add a URL"
                            className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-base font-semibold text-[#000000]">
                      Custom URL 2
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 w-full">
                          <Image
                            src="/text.svg"
                            alt="text icon"
                            width={16}
                            height={16}
                            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            defaultValue=""
                            placeholder="Add a URL name"
                            className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          />
                        </div>
                        <div className="relative flex-1 w-full">
                          <Image
                            src="/copy.svg"
                            alt="copy icon"
                            width={16}
                            height={16}
                            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            defaultValue=""
                            placeholder="Add a URL"
                            className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Card>
        <div className="mt-5">
          <Button
            onClick={handleSaveAndProceedCommunityProfile}
            size="sm"
            className={`w-full md:w-auto bg-[#0A5DBC] border border-[#0A5DBC] text-white hover:bg-primary h-[44px] rounded-[15px] font-medium text-sm transition-colors duration-300 hover:bg-[#053875] ${loading && 'opacity-50 cursor-not-allowed'}`}
            disabled={loading}
          >
            Save & proceed
          </Button>
        </div>
      </main>
    </div>
  );
}

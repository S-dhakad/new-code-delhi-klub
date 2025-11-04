import { useState, useEffect } from 'react';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';
import { communityService } from 'src/axios/community/communityApi';
import { workspaceService } from 'src/axios/workspace/workspace';
import { FileUploadPayload } from 'src/types/uploads.types';
import { UpdateCommunityDto } from 'src/types/community.types';
import { MediaItem } from 'src/components/FileUploader';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useAuthStore } from 'src/store/auth.store';

interface FormState {
  fullName: string;
  bio: string;
  about: string;
  location: string;
  description: string;
  slug: string;
}

export const useGeneralInfoCommunities = () => {
  const [open, setOpen] = useState<string | undefined>('general');
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(
    null,
  );
  const { community, setCommunity } = useCommunityStore();
  const { workspaces, setWorkspaces } = useWorkspaceStore();
  const [loading, setLoading] = useState(false);
  const [isAddSpaceOpen, setIsAddSpaceOpen] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [spaceLoading, setSpaceLoading] = useState(false);
  const [isAddTopicsOpen, setIsAddTopicsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
  const showToast = useToastStore((s) => s.showToast);
  const { accessToken } = useAuthStore();

  // Single form state object
  const [formState, setFormState] = useState<FormState>({
    fullName: '',
    bio: '',
    about: '',
    location: '',
    description: '',
    slug: '',
  });

  const [thumbnail, setThumbnail] = useState<MediaItem>({
    id: 'thumb-default',
    type: 'image',
    url: '',
    name: 'thubnail image',
    isObjectURL: false,
  });

  const [banner, setBanner] = useState<MediaItem>({
    id: 'banner-default',
    type: 'video',
    url: '',
    name: 'video thumbnail',
    isObjectURL: false,
  });

  // Upload payload states
  const [communityImageData, setCommunityImageData] =
    useState<FileUploadPayload | null>(null);
  const [bannerUploadData, setBannerUploadData] = useState<FileUploadPayload[]>(
    [],
  );
  const [imagesUploadData, setImagesUploadData] = useState<FileUploadPayload[]>(
    [],
  );
  const [imagesPreview, setImagesPreview] = useState<MediaItem[]>([]);

  // Load community data when component mounts or community changes
  useEffect(() => {
    if (community) {
      setFormState({
        fullName: community.name || '',
        bio: community.bio || '',
        about: community.about || '',
        location: community.location || '',
        description: community.description || '',
        slug: community.name?.toLowerCase().replace(/\s+/g, '') || '',
      });

      // Initialize image and banner previews from existing community data
      if (community.image) {
        setThumbnail({
          id: 'thumb-server',
          type: 'image',
          url: community.image,
          name: 'community-image',
          isObjectURL: false,
        });
      }
      if (community.banner && community.banner.length > 0) {
        setBanner({
          id: 'banner-server',
          type: 'image',
          url: community.banner[0] as unknown as string,
          name: 'community-banner',
          isObjectURL: false,
        });
      }
      if (community.images && community.images.length > 0) {
        setImagesPreview(
          community.images.map((img, idx) => ({
            id: `img-server-${idx}`,
            type: 'image' as const,
            url: img,
            name: `community-image-${idx}`,
            isObjectURL: false,
          })),
        );
      } else {
        setImagesPreview([]);
      }
    }
  }, [community]);

  // Helper function to update form state
  const updateFormField = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!community) {
      showToast({
        type: 'default-error',
        title: 'No community data available',
      });
      return;
    }

    if (!accessToken) {
      showToast({
        type: 'default-error',
        title: 'No access token found',
      });
      return;
    }

    setLoading(true);

    try {
      const updateData: UpdateCommunityDto = {
        name: formState.fullName,
        bio: formState.bio,
        location: formState.location,
        description: formState.description,
        image: communityImageData || undefined,
        banner: bannerUploadData.length ? bannerUploadData : undefined,
        images: imagesUploadData.length ? imagesUploadData : undefined,
      };

      await communityService.updateCommunity(community.id, updateData);

      // Update the community in the store after successful update
      const updatedCommunity = await communityService.getCommunityById(
        community.id,
      );
      useCommunityStore.setState({ community: updatedCommunity.data });
      setCommunity(updatedCommunity.data.community);

      showToast({
        type: 'default-success',
        title: 'Community updated successfully',
      });
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to update community',
        message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewSpace = async () => {
    if (!community?.id || !spaceName.trim()) return;

    setSpaceLoading(true);
    try {
      await workspaceService.createWorkspace(community.id, {
        name: spaceName.trim(),
        isPrivate: false,
      });

      // Refetch workspaces to update the spaces list
      const response = await workspaceService.getWorkspacesMe(community.id);
      const workspacesData = response.data || [];
      setWorkspaces(workspacesData);

      setIsAddSpaceOpen(false);
      setSpaceName('');

      showToast({
        type: 'default-success',
        title: 'Space created successfully',
      });
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to create workspace',
        message,
      });
    } finally {
      setSpaceLoading(false);
    }
  };

  // FileUploader handlers
  const handleThumbnailFilesAdded = (_files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;
    const first = items[0];

    if (thumbnail?.isObjectURL) {
      try {
        URL.revokeObjectURL(thumbnail.url);
      } catch {}
    }

    setThumbnail({
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

  const handleBannerFilesAdded = (_files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;
    const first = items[0];

    if (banner?.isObjectURL) {
      try {
        URL.revokeObjectURL(banner.url);
      } catch {}
    }

    setBanner({
      id: first.id,
      type: first.type,
      url: first.url,
      name: first.name,
      isObjectURL: true,
    });

    if (first.s3Data) {
      setBannerUploadData([
        {
          key: first.s3Data.fileKey,
          mimetype: first.s3Data.mimetype,
          size: first.s3Data.size,
        },
      ]);
    }
  };

  const handleImagesFilesAdded = (_files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;

    setImagesPreview((prev) => [
      ...prev,
      ...items.map((it) => ({
        id: it.id,
        type: 'image' as const,
        url: it.url,
        name: it.name,
        isObjectURL: true,
      })),
    ]);

    const newPayloads: FileUploadPayload[] = [];
    for (const it of items) {
      if (it.s3Data) {
        newPayloads.push({
          key: it.s3Data.fileKey,
          mimetype: it.s3Data.mimetype,
          size: it.s3Data.size,
        });
      }
    }
    if (newPayloads.length) {
      setImagesUploadData((prev) => [...prev, ...newPayloads]);
    }
  };

  const removeThumbnail = () => {
    if (thumbnail?.isObjectURL) {
      try {
        URL.revokeObjectURL(thumbnail.url);
      } catch {
        /* ignore */
      }
    }
    setThumbnail({
      id: 'thumb-default',
      type: 'image',
      url: '',
      name: 'thumbnail image',
      isObjectURL: false,
    });
    setCommunityImageData(null);
  };

  const removeBanner = () => {
    if (banner?.isObjectURL) {
      try {
        URL.revokeObjectURL(banner.url);
      } catch {
        /* ignore */
      }
    }
    setBanner({
      id: 'banner-default',
      type: 'video',
      url: '',
      name: 'thumnail video',
      isObjectURL: false,
    });
    setBannerUploadData([]);
  };

  const removeImageAt = (index: number) => {
    setImagesPreview((prev) => {
      const target = prev[index];
      if (target?.isObjectURL) {
        try {
          URL.revokeObjectURL(target.url);
        } catch {}
      }
      const next = [...prev.slice(0, index), ...prev.slice(index + 1)];
      return next;
    });
    // We only remove from upload payloads for newly added (object URLs)
    setImagesUploadData((prev) => prev.slice(0, Math.max(0, prev.length - 1)));
  };

  useEffect(() => {
    return () => {
      if (thumbnail?.isObjectURL) {
        try {
          URL.revokeObjectURL(thumbnail.url);
        } catch {
          /* ignore */
        }
      }
      if (banner?.isObjectURL) {
        try {
          URL.revokeObjectURL(banner.url);
        } catch {
          /* ignore */
        }
      }
      // Clean up images preview object URLs
      imagesPreview.forEach((img) => {
        if (img.isObjectURL) {
          try {
            URL.revokeObjectURL(img.url);
          } catch {
            /* ignore */
          }
        }
      });
    };
    // intentionally not adding setter refs to deps to keep behavior stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleActive = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId);
  };

  return {
    // State
    open,
    setOpen,
    activeWorkspaceId,
    community,
    workspaces,
    loading,
    isAddSpaceOpen,
    setIsAddSpaceOpen,
    spaceName,
    setSpaceName,
    spaceLoading,
    isAddTopicsOpen,
    setIsAddTopicsOpen,
    isEditing,
    setIsEditing,
    showFailureModal,
    setShowFailureModal,
    formState,
    thumbnail,
    banner,
    imagesPreview,

    // Methods
    updateFormField,
    handleSave,
    createNewSpace,
    handleThumbnailFilesAdded,
    handleBannerFilesAdded,
    handleImagesFilesAdded,
    removeThumbnail,
    removeBanner,
    removeImageAt,
    handleActive,
  };
};

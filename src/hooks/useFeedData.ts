import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { workspaceService } from 'src/axios/workspace/workspace';
import { postService } from 'src/axios/post/postApi';
import { communityService } from 'src/axios/community/communityApi';
import { eventsService } from 'src/axios/events';
import { Post } from 'src/types/post.types';
import { FileUploadPayload } from 'src/types/uploads.types';
import { EventStatus } from 'src/types/events.types';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';
import { useProfileStore } from 'src/store/profile.store';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

export function useFeedData() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'feed' | 'members'>('feed');
  const [isAddSpaceOpen, setIsAddSpaceOpen] = useState(false);
  const [spaceName, setSpaceName] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const { profile } = useProfileStore();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [lastClickedSpace, setLastClickedSpace] = useState<string | null>(null);
  const [activeIsAll, setActiveIsAll] = useState(false);
  const showToast = useToastStore((s) => s.showToast);
  const [members, setMembers] = useState<
    Array<{
      id: string;
      userId: string;
      communityId: string;
      role: 'ADMIN' | 'MEMBER' | 'MODERATOR';
      joinedAt: string;
      user?: {
        id: string;
        firstName?: string;
        lastName?: string;
        username?: string;
        profilePicture?: string;
      };
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [allowClick, setAllowClick] = useState(false);
  const [isLoadingFromUrl, setIsLoadingFromUrl] = useState(false);

  const { community, setCommunity, setCommunityData } = useCommunityStore();
  const {
    workspaces,
    selectedWorkspaceId,
    setWorkspaces,
    setSelectedWorkspaceId,
    setWorkspace,
  } = useWorkspaceStore();

  // Load specific community from URL parameter (e.g., after joining)
  useEffect(() => {
    const communityIdFromUrl = searchParams?.get('communityId');

    // Load if we have a communityId in URL and either:
    // 1. No community is loaded yet, OR
    // 2. The URL community is different from the current one
    if (
      communityIdFromUrl &&
      communityIdFromUrl !== community?.id &&
      !isLoadingFromUrl
    ) {
      const loadSpecificCommunity = async () => {
        try {
          setLoading(true);
          setIsLoadingFromUrl(true);

          // Load the specific community
          const communityDetailResponse =
            await communityService.getCommunityById(communityIdFromUrl);
          const { community: detailedCommunity, userCommunity } =
            communityDetailResponse.data;

          // Update store
          setCommunity(detailedCommunity);
          setCommunityData({ community: detailedCommunity, userCommunity });

          // Load workspaces for this community
          const workspacesResponse =
            await workspaceService.getWorkspacesMe(communityIdFromUrl);
          const workspacesData = workspacesResponse.data || [];
          setWorkspaces(workspacesData);

          // Set the first workspace as selected
          if (workspacesData.length > 0) {
            setSelectedWorkspaceId(workspacesData[0].id);
            setWorkspace(workspacesData[0]);
          }
        } catch (error) {
          const message = getErrorMessage(error);
          showToast({
            type: 'default-error',
            title: 'Failed to load community',
            message,
          });
          setIsLoadingFromUrl(false);
        } finally {
          setLoading(false);
        }
      };

      loadSpecificCommunity();
    } else if (!communityIdFromUrl) {
      setLoading(false);
    } else if (communityIdFromUrl === community?.id && !isLoadingFromUrl) {
      // Community is already loaded and matches URL parameter
      setLoading(false);
    }
  }, [
    searchParams,
    community?.id,
    isLoadingFromUrl,
    setCommunity,
    setCommunityData,
    setWorkspaces,
    setSelectedWorkspaceId,
    setWorkspace,
    showToast,
  ]);

  // Clean up URL after community is loaded from URL parameter
  useEffect(() => {
    const communityIdFromUrl = searchParams?.get('communityId');

    // If we were loading from URL and now the community matches the URL param, clean up the URL
    if (
      isLoadingFromUrl &&
      communityIdFromUrl &&
      community?.id === communityIdFromUrl
    ) {
      setIsLoadingFromUrl(false);
      // Small delay to ensure state is settled
      setTimeout(() => {
        router.replace('/feed', { scroll: false });
      }, 100);
    }
  }, [isLoadingFromUrl, community?.id, searchParams, router]);

  // Fetch community members
  const fetchCommunityMembers = useCallback(async () => {
    if (!community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot load members. Missing Community Id.',
      });
      return;
    }

    try {
      const response = await communityService.getCommunityMembers(community.id);

      const allMembers = [
        ...(response.data?.members || []).map(
          (m: {
            id: string;
            firstName?: string;
            lastName?: string;
            username?: string;
            email?: string;
            createdAt: string;
            profilePicture?: string;
          }) => ({
            id: m.id,
            userId: m.id,
            communityId: community.id,
            role: 'MEMBER' as const,
            joinedAt: m.createdAt,
            user: m,
          }),
        ),
        ...(response.data?.adminUsers || []).map(
          (admin: {
            id: string;
            firstName: string;
            lastName: string;
            username: string;
            email: string;
            createdAt: string;
          }) => ({
            id: admin.id,
            userId: admin.id,
            communityId: community.id,
            role: 'ADMIN' as const,
            joinedAt: admin.createdAt,
            user: admin,
          }),
        ),
      ];

      setMembers(allMembers);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to load members',
        message,
      });
    }
  }, [community?.id, showToast]);

  // Fetch posts by workspace
  const fetchPosts = useCallback(async () => {
    if (!community?.id || !selectedWorkspaceId) {
      showToast({
        type: 'default-error',
        title:
          'Cannot fetch posts. Missing Community Id or <S></S>electedWorkspaceId.',
      });
      return;
    }

    try {
      setPostsLoading(true);
      const postsData = await postService.getPostsByWorkspace(
        community.id,
        selectedWorkspaceId,
        { limit: 20, page: 1 },
      );
      setPosts(postsData.data?.posts || []);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to fetch posts',
        message,
      });
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, [community?.id, selectedWorkspaceId, showToast]);

  // Fetch all posts
  const fetchAllPosts = useCallback(async () => {
    if (!community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot fetch posts. Missing Community Id.',
      });
      return;
    }
    try {
      setPostsLoading(true);
      const postsData = await postService.getAllPosts(community.id, {
        limit: 20,
        page: 1,
      });
      setPosts(postsData.data?.posts || []);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to fetch all posts',
        message,
      });
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }, [community?.id, showToast]);

  // Fetch members on mount
  useEffect(() => {
    if (community?.id) {
      fetchCommunityMembers();
    }
  }, [community?.id, fetchCommunityMembers]);

  useEffect(() => {
    if (community?.id && workspaces.length > 0 && selectedWorkspaceId) {
      fetchPosts();
    } else if (community?.id && workspaces.length > 0 && !selectedWorkspaceId) {
      fetchAllPosts();
    }
  }, [
    workspaces.length,
    community?.id,
    selectedWorkspaceId,
    fetchPosts,
    fetchAllPosts,
  ]);

  // Handle workspace change
  const handleWorkspaceChange = async (workspaceName: string) => {
    const cleanName = workspaceName.replace('# ', '');
    const workspace = workspaces.find((w) => w.name === cleanName);

    if (workspace) {
      setActiveIsAll(false);
      setSelectedWorkspaceId(workspace.id);
      setWorkspace(workspace);
      setLastClickedSpace(`# ${workspace.name}`);

      if (community?.id) {
        try {
          setPostsLoading(true);
          const postsData = await postService.getPostsByWorkspace(
            community.id,
            workspace.id,
            { limit: 20, page: 1 },
          );
          setPosts(postsData.data?.posts || []);
        } catch (error) {
          const message = getErrorMessage(error);
          showToast({
            type: 'default-error',
            title: 'Failed to fetch posts',
            message,
          });
          setPosts([]);
        } finally {
          setPostsLoading(false);
        }
      }
    } else if (workspaceName === '# All') {
      setActiveIsAll(true);
      // Clear selected workspace so UI reflects "All"
      setSelectedWorkspaceId(null);
      setLastClickedSpace('# All');
      if (community?.id) {
        try {
          setPostsLoading(true);
          const postsData = await postService.getAllPosts(community.id, {
            limit: 20,
            page: 1,
          });
          setPosts(postsData.data?.posts || []);
        } catch (error) {
          const message = getErrorMessage(error);
          showToast({
            type: 'default-error',
            title: 'Failed to fetch all posts',
            message,
          });
          setPosts([]);
        } finally {
          setPostsLoading(false);
        }
      }
    }
  };

  // Create new space
  const createNewSpace = async () => {
    if (!community?.id) {
      showToast({
        type: 'default-error',
        title: 'Cannot create workspace. Community Id Missing.',
      });
      return;
    }
    if (!spaceName.trim()) {
      showToast({
        type: 'default-error',
        title: 'Space Name Can not Empty.',
      });
      return;
    }
    const isDuplicate = workspaces.some(
      (workspace) =>
        workspace.name.trim().toLowerCase() === spaceName.trim().toLowerCase(),
    );

    if (isDuplicate) {
      showToast({
        type: 'default-error',
        title: 'Workspace already exists',
        message: `A workspace named "# ${spaceName.trim()}" already exists.`,
      });
      return;
    }

    try {
      setAllowClick(true);
      const newWorkspace = await workspaceService.createWorkspace(
        community.id,
        {
          name: spaceName.trim(),
          isPrivate: false,
        },
      );

      const response = await workspaceService.getWorkspacesMe(community.id);
      const workspacesData = response.data || [];
      setWorkspaces(workspacesData);

      setSelectedWorkspaceId(newWorkspace.id);
      setWorkspace(newWorkspace);

      try {
        setPostsLoading(true);
        if (community?.id && newWorkspace?.id) {
          const postsData = await postService.getPostsByWorkspace(
            community.id,
            newWorkspace.id,
            { limit: 20, page: 1 },
          );
          setPosts(postsData.data || []);
        }
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to load posts for new workspace',
          message,
        });
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }

      setIsAddSpaceOpen(false);
      setSpaceName('');
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to create workspace',
        message,
      });
      setAllowClick(false);
    } finally {
      setAllowClick(false);
    }
  };

  // Create post
  const handlePost = async (
    content: string,
    urls?: FileUploadPayload[],
  ): Promise<boolean> => {
    if (!community?.id || !selectedWorkspaceId || !content.trim()) {
      showToast({
        type: 'default-error',
        title: 'Cannot create post. Missing required fields.',
      });
      return false;
    }
    try {
      await postService.createPost(community.id, selectedWorkspaceId, {
        content: content.trim(),
        urls: urls && urls.length ? urls : undefined,
      });
      await fetchPosts();
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to create post',
        message,
      });
      return false;
    }
  };

  // Update post
  const handleUpdatePost = async (
    postId: string,
    content: string,
  ): Promise<boolean> => {
    if (!community?.id || !selectedWorkspaceId || !postId || !content.trim()) {
      showToast({
        type: 'default-error',
        title: 'Cannot update post. Missing required fields.',
      });
      return false;
    }

    const trimmed = content.trim();
    if (!trimmed) return false;

    let previousPostsSnapshot: Post[] | null = null;

    setPosts((prevPosts) => {
      previousPostsSnapshot = prevPosts;
      return prevPosts.map((post) =>
        post.id === postId
          ? { ...post, content: trimmed, updatedAt: new Date().toISOString() }
          : post,
      );
    });

    (async () => {
      try {
        await postService.updatePost(
          community.id,
          selectedWorkspaceId,
          postId,
          { content: trimmed },
        );
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to update post',
          message,
        });
        if (previousPostsSnapshot) setPosts(previousPostsSnapshot);
      }
    })();

    return true;
  };

  // Delete post
  const handleDeletePost = async (postId: string): Promise<boolean> => {
    if (!community?.id || !selectedWorkspaceId || !postId) {
      showToast({
        type: 'default-error',
        title: 'Cannot delete post. Missing required fields.',
      });
      return false;
    }
    let previousPostsSnapshot: Post[] | null = null;
    setPosts((prev) => {
      previousPostsSnapshot = prev;
      return prev.filter((p) => p.id !== postId);
    });
    (async () => {
      try {
        await postService.deletePost(community.id, selectedWorkspaceId, postId);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to delete post',
          message,
        });
        if (previousPostsSnapshot) setPosts(previousPostsSnapshot);
      }
    })();
    return true;
  };

  // Like post
  const handleLikePost = async (postId: string) => {
    if (!community?.id || !postId || !profile) {
      showToast({
        type: 'default-error',
        title: 'Cannot like post. Missing required fields.',
      });
      return false;
    }

    const newLike = {
      id: `temp-${Date.now()}`,
      postId,
      userId: profile.id,
      createdAt: new Date().toISOString(),
      user: {
        id: profile.id,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        email: profile.email || '',
        profilePictureUrl: profile.profilePicture,
      },
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: [...(post.likes || []), newLike],
            }
          : post,
      ),
    );

    try {
      if (selectedWorkspaceId) {
        await postService.likePost(community.id, selectedWorkspaceId, postId);
      }
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to like post',
        message,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: (post.likes || []).filter(
                  (like) => like.id !== newLike.id,
                ),
              }
            : post,
        ),
      );
      return false;
    }
  };

  // Dislike post
  const handleDislikePost = async (postId: string) => {
    if (!community?.id || !postId || !profile) {
      showToast({
        type: 'default-error',
        title: 'Cannot unlike post. Missing required fields.',
      });
      return false;
    }

    const currentPost = posts.find((p) => p.id === postId);
    const likeToRemove = currentPost?.likes?.find(
      (like) => like.user?.username === profile.username,
    );

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: (post.likes || []).filter(
                (like) => like.user?.username !== profile.username,
              ),
            }
          : post,
      ),
    );

    try {
      if (selectedWorkspaceId) {
        await postService.unLikePost(community.id, selectedWorkspaceId, postId);
      }
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to unlike post',
        message,
      });
      if (likeToRemove) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: [...(post.likes || []), likeToRemove],
                }
              : post,
          ),
        );
      }
      return false;
    }
  };

  // Create comment
  const handleCreateComment = async (postId: string, content: string) => {
    if (!community?.id || !selectedWorkspaceId || !postId || !content.trim()) {
      showToast({
        type: 'default-error',
        title: 'Cannot add comment. Missing required fields.',
      });
      return false;
    }

    const tempComment = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      postId,
      userId: profile?.id || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: [],
      user: profile
        ? {
            id: profile.id,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            username: profile.username || '',
            email: profile.email || '',
            profilePictureUrl: profile.profilePicture,
          }
        : undefined,
      author: profile
        ? {
            id: profile.id,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            createdAt: new Date().toISOString(),
          }
        : undefined,
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), tempComment],
            }
          : post,
      ),
    );

    try {
      const response = await postService.commentOnPost(
        community.id,
        selectedWorkspaceId,
        postId,
        {
          content: content.trim(),
        },
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments?.map((comment) =>
                  comment.id === tempComment.id ? response.data : comment,
                ),
              }
            : post,
        ),
      );

      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to add comment',
        message,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments?.filter((c) => c.id !== tempComment.id),
              }
            : post,
        ),
      );
      return false;
    }
  };

  // Update comment
  const handleUpdateComment = async (
    postId: string,
    commentId: string,
    content: string,
  ) => {
    if (
      !community?.id ||
      !selectedWorkspaceId ||
      !postId ||
      !commentId ||
      !content.trim()
    ) {
      showToast({
        type: 'default-error',
        title: 'Cannot update comment. Missing required fields.',
      });
      return false;
    }
    const trimmed = content.trim();
    if (!trimmed) return false;
    let previousPostsSnapshot: Post[] | null = null;
    setPosts((prevPosts) => {
      previousPostsSnapshot = prevPosts;
      return prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      content: trimmed,
                      updatedAt: new Date().toISOString(),
                    }
                  : comment,
              ),
            }
          : post,
      );
    });

    (async () => {
      try {
        await postService.updateComment(
          community.id,
          selectedWorkspaceId,
          postId,
          commentId,
          { content: trimmed },
        );
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to update comment',
          message,
        });
        if (previousPostsSnapshot) setPosts(previousPostsSnapshot);
      }
    })();
    return true;
  };

  // Delete comment
  const handleDeleteComment = async (
    postId: string,
    commentId: string,
  ): Promise<boolean> => {
    if (!community?.id || !selectedWorkspaceId || !postId || !commentId) {
      showToast({
        type: 'default-error',
        title: 'Cannot delete comment. Missing required fields.',
      });
      return false;
    }
    let previousPostsSnapshot: Post[] | null = null;
    setPosts((prevPosts) => {
      previousPostsSnapshot = prevPosts;
      return prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).filter((c) => c.id !== commentId),
            }
          : post,
      );
    });
    (async () => {
      try {
        await postService.deleteComment(
          community.id,
          selectedWorkspaceId,
          postId,
          commentId,
        );
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to delete comment',
          message,
        });
        if (previousPostsSnapshot) setPosts(previousPostsSnapshot);
      }
    })();

    return true;
  };

  // Like comment
  const handleLikeComment = async (postId: string, commentId: string) => {
    if (!community?.id || !postId || !commentId || !profile) {
      showToast({
        type: 'default-error',
        title: 'Cannot like comment. Missing required fields.',
      });
      return false;
    }

    const newLike = {
      id: `temp-${Date.now()}`,
      commentId,
      userId: profile.id,
      createdAt: new Date().toISOString(),
      user: {
        id: profile.id,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        username: profile.username || '',
        email: profile.email || '',
        profilePictureUrl: profile.profilePicture,
      },
    };

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments?.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likes: [...(comment.likes || []), newLike],
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );

    try {
      if (selectedWorkspaceId) {
        await postService.likeComment(
          community.id,
          selectedWorkspaceId,
          postId,
          commentId,
        );
      }
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to like comment',
        message,
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments?.map((comment) =>
                  comment.id === commentId
                    ? {
                        ...comment,
                        likes: (comment.likes || []).filter(
                          (like) => like.id !== newLike.id,
                        ),
                      }
                    : comment,
                ),
              }
            : post,
        ),
      );
      return false;
    }
  };

  // Dislike comment
  const handledisLikeComment = async (postId: string, commentId: string) => {
    if (!community?.id || !postId || !commentId || !profile) {
      showToast({
        type: 'default-error',
        title: 'Cannot unlike comment. Missing required fields.',
      });
      return false;
    }

    const currentPost = posts.find((p) => p.id === postId);
    const currentComment = currentPost?.comments?.find(
      (c) => c.id === commentId,
    );
    const likeToRemove = currentComment?.likes?.find(
      (like) => like.user?.username === profile.username,
    );

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: post.comments?.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      likes: (comment.likes || []).filter(
                        (like) => like.user?.username !== profile.username,
                      ),
                    }
                  : comment,
              ),
            }
          : post,
      ),
    );

    try {
      if (selectedWorkspaceId) {
        await postService.unlikeComment(
          community.id,
          selectedWorkspaceId,
          postId,
          commentId,
        );
      }
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to unlike comment',
        message,
      });
      if (likeToRemove) {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  comments: post.comments?.map((comment) =>
                    comment.id === commentId
                      ? {
                          ...comment,
                          likes: [...(comment.likes || []), likeToRemove],
                        }
                      : comment,
                  ),
                }
              : post,
          ),
        );
      }
      return false;
    }
  };

  // Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        if (!community?.id) return;
        const response = await eventsService.getEventsByStatus(
          community.id,
          EventStatus.UPCOMING,
          {
            sort: 'latest',
            limit: 10,
            page: 1,
          },
        );
        setUpcomingEvents(response.data.events);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to fetch upcoming events',
          message,
        });
      }
    };
    fetchUpcomingEvents();
  }, [community?.id, showToast]);

  // Convert workspaces to sidebar format
  const spacesForSidebar = workspaces.map((workspace) => `# ${workspace.name}`);

  const selectedSpace = activeIsAll
    ? '# All'
    : selectedWorkspaceId
      ? `# ${workspaces.find((w) => w.id === selectedWorkspaceId)?.name || ''}`
      : lastClickedSpace || `# ${workspaces[0]?.name}`;

  return {
    // State
    activeTab,
    isAddSpaceOpen,
    spaceName,
    posts,
    upcomingEvents,
    members,
    loading,
    postsLoading,
    allowClick,
    workspaces,
    selectedWorkspaceId,
    spacesForSidebar,
    selectedSpace,
    activeIsAll,
    community,
    // Setters
    setActiveTab,
    setIsAddSpaceOpen,
    setSpaceName,
    // Handlers
    handleWorkspaceChange,
    createNewSpace,
    handlePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost,
    handleDislikePost,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handledisLikeComment,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Community } from 'src/types/community.types';
import { Post } from 'src/types/post.types';
import { communityService } from 'src/axios/community/communityApi';
import razorpayApi from 'src/axios/razorpay/razorpayApi';
import { postService } from 'src/axios/post/postApi';
import { workspaceService } from 'src/axios/workspace/workspace';
import { useProfileStore } from 'src/store/profile.store';
import { useSubscriberRazorpayStore } from 'src/store/creator-subscriber-razorpay.store';
import { useAuthStore } from 'src/store/auth.store';
import { useToastStore } from 'src/store/toast.store';
import {
  useCommunityStore,
  useWorkspaceStore,
} from 'src/store/community.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import {
  RazorpayOptions,
  RazorpaySuccessResponse,
} from 'src/types/razorpay.types';
import { formatJoinedDate } from 'src/utils/formatDate';

export function useKlubProfile(communityId?: string) {
  const [community, setCommunity] = useState<Community | null>(null);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
  const [isMember, setIsMember] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { profile } = useProfileStore();
  const showToast = useToastStore((s) => s.showToast);
  const { setCommunityData } = useCommunityStore();
  const { setWorkspaces, setSelectedWorkspaceId } = useWorkspaceStore();
  const params = useParams();
  const router = useRouter();
  const {
    setInitalizeRazorpay,
    initalizeRazorpay,
    setCommunityIdForSubscriberStore,
  } = useSubscriberRazorpayStore();
  const { isAuthenticated } = useAuthStore();

  // Use passed communityId or get from params
  const id = communityId || (params?.id as string);

  // Fetch community data
  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const response = await communityService.getCommunityByIdPublic(id);
        setCommunity(response.data.community);
      } catch (err) {
        const message = getErrorMessage(err);
        setError('Failed to load community data');
        showToast({
          type: 'default-error',
          title: 'Failed to load community',
          message,
        });
        router.replace('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunity();
  }, [id, router, showToast]);

  // Check membership status
  useEffect(() => {
    const memberExists =
      community?.members?.some(
        (member) => member?.user?.username === profile?.username,
      ) || false;
    setIsMember(memberExists);
  }, [community, profile]);

  // Fetch featured posts
  // useEffect(() => {
  //   const fetchFeaturedPosts = async () => {
  //     if (!id) return;

  //     try {
  //       const response = await postService.getFeaturedPostsByCommunity(id, {
  //         limit: 3,
  //         page: 1,
  //       });
  //       setFeaturedPosts(response.data?.posts || []);
  //     } catch (err) {
  //       const message = getErrorMessage(err);
  //       showToast({
  //         type: 'default-error',
  //         title: 'Error fetching featured posts',
  //         message,
  //       });
  //       // Silently fail - featured posts are optional
  //     }
  //   };

  //   fetchFeaturedPosts();
  // }, [id]);

  // Create links array from community data
  const getProfileLinks = () => {
    const links = [];

    if (community?.website) {
      links.push({
        title: 'My Website',
        subtitle: community.website,
        img: '/map.jpg',
      });
    }

    if (community?.youtube) {
      links.push({
        title: 'YouTube',
        subtitle: community.youtube,
        img: '/thumbnail.jpg',
      });
    }

    if (community?.instagram) {
      links.push({
        title: 'Instagram',
        subtitle: community.instagram,
        img: '/thumbnail.jpg',
      });
    }

    if (community?.linkedin) {
      links.push({
        title: 'LinkedIn',
        subtitle: community.linkedin,
        img: '/thumbnail.jpg',
      });
    }

    if (community?.facebook) {
      links.push({
        title: 'Facebook',
        subtitle: community.facebook,
        img: '/thumbnail.jpg',
      });
    }

    return links;
  };

  // Convert YouTube URLs to embeddable format
  const getEmbedUrl = (url: string) => {
    const youtubeRegex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);

    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    return url;
  };

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Initialize Razorpay payment for joining a community
  const initializeRazorpayJoinCommunity = useCallback(async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        showToast({
          type: 'default-error',
          title: 'Payment failed',
          message:
            'Failed to load Razorpay SDK. Please check your internet connection.',
        });
        return;
      }
      if (!id) {
        showToast({
          type: 'default-error',
          title: 'Cannot start payment',
          message: 'Community ID not found.',
        });
        return;
      }
      if (!isAuthenticated) {
        setInitalizeRazorpay(true);
        setCommunityIdForSubscriberStore(id);
        router.push('/login');
        return;
      }

      const subscriptionResponse =
        await razorpayApi.createJoinCommunityOrder(id);
      const subscription = subscriptionResponse?.data?.data?.subscription;
      const plan = subscriptionResponse?.data?.data?.plan;
      const isPaid = subscriptionResponse?.data?.data?.isPaid;
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';

      // If community is free (isPaid = false), redirect directly to feed
      if (isPaid === false) {
        setIsMember(true);

        // Fetch updated community data and workspaces before routing
        try {
          const [communityResponse, workspacesResponse] = await Promise.all([
            communityService.getCommunityById(id),
            workspaceService.getWorkspacesMe(id),
          ]);

          if (communityResponse.success && workspacesResponse.success) {
            // Update community store with latest data
            setCommunityData({
              community: communityResponse.data.community,
              userCommunity: communityResponse.data.userCommunity,
            });

            setCommunity(communityResponse.data.community);

            setWorkspaces(workspacesResponse.data);

            if (workspacesResponse.data.length > 0) {
              setSelectedWorkspaceId(workspacesResponse.data[0].id);
            }

            showToast({
              type: 'default-success',
              title: 'Successfully joined community!',
              message: 'Welcome to the community.',
            });

            // Use window.location.href for full page reload to ensure HeaderBar gets fresh data
            // Pass community ID in URL to prevent loading default community
            window.location.href = `/feed?communityId=${id}`;
          }
        } catch (error) {
          const message = getErrorMessage(error);
          showToast({
            type: 'default-error',
            title: 'Error fetching community data, please refresh',
            message,
          });
          // Still route to feed even if fetch fails
        }
        return;
      }

      // For paid communities, continue with Razorpay flow
      if (!subscription || !subscription.id) {
        showToast({
          type: 'default-error',
          title: 'Failed to create payment',
          message: 'Failed to create subscription. Please try again.',
        });
        return;
      }

      const options: RazorpayOptions = {
        key,
        name: 'Klub',
        description: 'Join Community Subscription',
        subscription_id: subscription.id,
        handler: async function (response: RazorpaySuccessResponse) {
          try {
            const verifyResponse =
              await razorpayApi.verifyCreateJoinCommunityPayment(id, {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySubscriptionId: response.razorpay_subscription_id || '',
                razorpaySignature: response.razorpay_signature,
                planId: plan?.id || '',
              });
            if (verifyResponse.success) {
              setShowSuccessModal(true);
              setIsMember(true);

              // Fetch updated community data and workspaces before routing
              try {
                const [communityResponse, workspacesResponse] =
                  await Promise.all([
                    communityService.getCommunityById(id),
                    workspaceService.getWorkspacesMe(id),
                  ]);

                if (communityResponse.success && workspacesResponse.success) {
                  // Update community store with latest data
                  setCommunityData({
                    community: communityResponse.data.community,
                    userCommunity: communityResponse.data.userCommunity,
                  });

                  // Also set the community directly for immediate update
                  setCommunity(communityResponse.data.community);

                  // Update workspace store with latest workspaces
                  setWorkspaces(workspacesResponse.data);

                  // Set the first workspace as selected if available
                  if (workspacesResponse.data.length > 0) {
                    setSelectedWorkspaceId(workspacesResponse.data[0].id);
                  }
                }
              } catch (error) {
                const message = getErrorMessage(error);
                showToast({
                  type: 'default-error',
                  title: 'Error fetching community data',
                  message,
                });
                // Continue to routing even if fetch fails
              }

              // Use window.location.href for full page reload to ensure HeaderBar gets fresh data
              // Pass community ID in URL to prevent loading default community
              window.location.href = `/feed?communityId=${id}`;
            } else {
              showToast({
                type: 'default-error',
                title: 'Payment failed',
                message:
                  'Payment could not be verified. Please contact support or try again.',
              });
              setShowFailureModal(true);
            }
          } catch (error) {
            const message = getErrorMessage(error);
            showToast({
              type: 'default-error',
              title: 'Payment verification failed',
              message,
            });
            setShowFailureModal(true);
          } finally {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
          }
        },
        prefill: {
          name: profile?.firstName + ' ' + profile?.lastName,
          email: profile?.email,
          contact: profile?.phoneNumber,
        },
        theme: {
          color: '#0A5DBC',
        },
        modal: {
          ondismiss: function () {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
          },
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Payment initialization failed',
        message,
      });
      setShowFailureModal(true);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, [
    id,
    isAuthenticated,
    setInitalizeRazorpay,
    setCommunityIdForSubscriberStore,
    router,
    profile,
    showToast,
    setCommunityData,
    setWorkspaces,
    setSelectedWorkspaceId,
  ]);

  // Auto-trigger payment if coming from login
  useEffect(() => {
    if (initalizeRazorpay && isAuthenticated) {
      initializeRazorpayJoinCommunity();
      setInitalizeRazorpay(false);
    }
  }, [
    initalizeRazorpay,
    isAuthenticated,
    initializeRazorpayJoinCommunity,
    setInitalizeRazorpay,
  ]);

  // Copy handler
  const handleCopy = () => {
    const currentUrl =
      typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    setTimeout(() => setOpen(false), 500);
  };

  // Join handler
  const handleJoinNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    initializeRazorpayJoinCommunity();
  };

  // Post interaction handlers
  const handleLikePost = async (postId: string) => {
    if (!id) return false;

    // Optimistic update
    setFeaturedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: [
                ...(post.likes || []),
                {
                  id: `temp-${Date.now()}`,
                  postId,
                  userId: profile?.id || '',
                  createdAt: new Date().toISOString(),
                  user: profile
                    ? {
                        id: profile.id,
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        username: profile.username || '',
                        email: profile.email || '',
                        profilePicture: profile.profilePicture,
                      }
                    : undefined,
                },
              ],
            }
          : post,
      ),
    );

    try {
      // Find the post to get its workspace ID
      const post = featuredPosts.find((p) => p.id === postId);
      if (post?.workspaceId) {
        await postService.likePost(id, post.workspaceId, postId);
      }
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to like post',
        message,
      });
      // Revert on error
      setFeaturedPosts((prev) => prev); // Trigger re-fetch or revert
      return false;
    }
  };

  const handleUnlikePost = async (postId: string) => {
    if (!id) return false;

    // Optimistic update
    setFeaturedPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: (post.likes || []).filter(
                (like) => like.user?.username !== profile?.username,
              ),
            }
          : post,
      ),
    );

    try {
      const post = featuredPosts.find((p) => p.id === postId);
      if (post?.workspaceId) {
        await postService.unLikePost(id, post.workspaceId, postId);
      }
      return true;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to unlike post',
        message,
      });
      return false;
    }
  };

  const handleCommentOnPost = async (postId: string, content: string) => {
    if (!id) return false;

    try {
      const post = featuredPosts.find((p) => p.id === postId);
      if (post?.workspaceId) {
        const response = await postService.commentOnPost(
          id,
          post.workspaceId,
          postId,
          { content },
        );

        // Update posts with new comment
        setFeaturedPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: [...(p.comments || []), response.data],
                }
              : p,
          ),
        );
        return true;
      }
      return false;
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to comment on post',
        message,
      });
      return false;
    }
  };

  return {
    // State
    community,
    featuredPosts,
    loading,
    error,
    isMember,
    showSuccessModal,
    showFailureModal,
    open,
    copied,
    // Setters
    setShowSuccessModal,
    setShowFailureModal,
    setOpen,
    // Utilities
    getProfileLinks,
    formatJoinedDate,
    getEmbedUrl,
    // Handlers
    handleJoinNow,
    handleCopy,
    handleLikePost,
    handleUnlikePost,
    handleCommentOnPost,
  };
}

import axiosInstance from '../axios';
import {
  Post,
  Comment,
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
} from '../../types/post.types';

export const postService = {
  // Create a new post
  async createPost(
    communityId: string,
    workspaceId: string,
    data: CreatePostDto,
  ) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/workspaces/${workspaceId}/posts`,
      data,
    );
    return response.data;
  },

  // Update a post
  async updatePost(
    communityId: string,
    workspaceId: string,
    postId: string,
    data: UpdatePostDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}`,
      data,
    );
    return response.data;
  },

  // Get posts by workspace
  async getPostsByWorkspace(
    communityId: string,
    workspaceId: string,
    query?: { limit?: number; page?: number },
  ) {
    const params = new URLSearchParams();

    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/${communityId}/workspaces/${workspaceId}/posts?${params.toString()}`,
    );
    return response.data;
  },

  // Get all posts from community
  async getAllPosts(
    communityId: string,
    query?: { limit?: number; page?: number },
  ) {
    const params = new URLSearchParams();

    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/${communityId}/posts/all?${params.toString()}`,
    );
    return response.data;
  },

  // Get post by ID
  async getPostById(communityId: string, workspaceId: string, postId: string) {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}`,
    );
    return response.data;
  },

  // Delete a post
  async deletePost(communityId: string, workspaceId: string, postId: string) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}`,
    );
    return response.data;
  },

  // Like a post
  async likePost(communityId: string, workspaceId: string, postId: string) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/like`,
    );
    return response.data;
  },

  async unLikePost(communityId: string, workspaceId: string, postId: string) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/unlike`,
    );
    return response.data;
  },

  // Get featured posts by community
  async getFeaturedPostsByCommunity(
    communityId: string,
    query?: { limit?: number; page?: number },
  ) {
    const params = new URLSearchParams();

    if (query?.limit) params.append('limit', query.limit.toString());
    if (query?.page) params.append('page', query.page.toString());

    const response = await axiosInstance.private.get(
      `/community/${communityId}/featured-posts?${params.toString()}`,
    );
    return response.data;
  },

  // Comment on a post
  async commentOnPost(
    communityId: string,
    workspaceId: string,
    postId: string,
    data: CreateCommentDto,
  ) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/comment`,
      data,
    );
    return response.data;
  },

  // Update a comment
  async updateComment(
    communityId: string,
    workspaceId: string,
    postId: string,
    commentId: string,
    data: CreateCommentDto,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/comment/${commentId}`,
      data,
    );
    return response.data;
  },

  // Delete a comment
  async deleteComment(
    communityId: string,
    workspaceId: string,
    postId: string,
    commentId: string,
  ) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/comment/${commentId}`,
    );
    return response.data;
  },

  // Like a comment
  async likeComment(
    communityId: string,
    workspaceId: string,
    postId: string,
    commentId: string,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/comment/${commentId}/like`,
    );
    return response.data;
  },

  // Unlike a comment
  async unlikeComment(
    communityId: string,
    workspaceId: string,
    postId: string,
    commentId: string,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/posts/${postId}/comment/${commentId}/unlike`,
    );
    return response.data;
  },
};

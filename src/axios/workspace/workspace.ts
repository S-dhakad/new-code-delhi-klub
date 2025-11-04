import axiosInstance from '../axios';
import type { Workspace, WorkspaceDto } from '../../types/workspace.types';

export const workspaceService = {
  // Create a new workspace
  async createWorkspace(communityId: string, data: WorkspaceDto) {
    const response = await axiosInstance.private.post(
      `/community/${communityId}/workspaces`,
      data,
    );
    return response.data;
  },

  // Get user's workspaces in a community
  async getWorkspacesMe(communityId: string): Promise<{
    success: boolean;
    status: number;
    message: string;
    data: Workspace[];
    metadata: {
      timestamp: string;
      apiVersion: string;
      requestId: string;
      status: number;
      success: boolean;
    };
  }> {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/workspaces/me`,
    );
    return response.data;
  },

  // Get workspace by ID
  async getWorkspaceById(
    communityId: string,
    workspaceId: string,
  ): Promise<Workspace> {
    const response = await axiosInstance.private.get(
      `/community/${communityId}/workspaces/${workspaceId}`,
    );
    return response.data;
  },

  // Update workspace
  async updateWorkspace(
    communityId: string,
    workspaceId: string,
    data: Partial<WorkspaceDto>,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}`,
      data,
    );
    return response.data;
  },

  // Delete workspace
  async deleteWorkspace(communityId: string, workspaceId: string) {
    const response = await axiosInstance.private.delete(
      `/community/${communityId}/workspaces/${workspaceId}`,
    );
    return response.data;
  },

  // Add members to workspace
  async addMembersToWorkspace(
    communityId: string,
    workspaceId: string,
    memberIds: string[],
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/add-members`,
      { memberIds },
    );
    return response.data;
  },

  // Remove member from workspace
  async removeMemberFromWorkspace(
    communityId: string,
    workspaceId: string,
    memberId: string,
  ) {
    const response = await axiosInstance.private.put(
      `/community/${communityId}/workspaces/${workspaceId}/remove-members`,
      memberId,
    );
    return response.data;
  },
};

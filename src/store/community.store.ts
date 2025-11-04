import { Community } from 'src/types/community.types';
import { Workspace } from 'src/types/workspace.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Type for user's community membership details
interface UserCommunity {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
  };
}

interface CommunityStore {
  community: Community | null;
  userCommunity: UserCommunity | null;
  setCommunity: (community: Community) => void;
  setUserCommunity: (userCommunity: UserCommunity) => void;
  setCommunityData: (data: {
    community: Community;
    userCommunity: UserCommunity;
  }) => void;
  clearCommunity: () => void;
}

interface WorkspaceStore {
  workspace: Workspace | null;
  workspaces: Workspace[];
  selectedWorkspaceId: string | null;
  setWorkspace: (workspace: Workspace) => void;
  setWorkspaces: (workspaces: Workspace[]) => void;
  setSelectedWorkspaceId: (workspaceId: string | null) => void;
  clearWorkspaces: () => void;
}

export const useCommunityStore = create<CommunityStore>()(
  persist(
    (set) => ({
      community: null,
      userCommunity: null,
      setCommunity: (community: Community) => set({ community }),
      setUserCommunity: (userCommunity: UserCommunity) =>
        set({ userCommunity }),
      setCommunityData: (data: {
        community: Community;
        userCommunity: UserCommunity;
      }) =>
        set({ community: data.community, userCommunity: data.userCommunity }),
      clearCommunity: () => set({ community: null, userCommunity: null }),
    }),
    {
      name: 'community-storage',
      partialize: (state) => ({
        community: state.community,
        userCommunity: state.userCommunity,
      }),
    },
  ),
);

export const useWorkspaceStore = create<WorkspaceStore>()(
  persist(
    (set) => ({
      workspace: null,
      workspaces: [],
      selectedWorkspaceId: null,
      setWorkspace: (workspace: Workspace) => set({ workspace }),
      setWorkspaces: (workspaces: Workspace[]) => set({ workspaces }),
      setSelectedWorkspaceId: (workspaceId: string | null) =>
        set({ selectedWorkspaceId: workspaceId }),
      clearWorkspaces: () =>
        set({ workspaces: [], selectedWorkspaceId: null, workspace: null }),
    }),
    {
      name: 'workspace-storage',
      partialize: (state) => ({
        workspace: state.workspace,
        workspaces: state.workspaces,
        selectedWorkspaceId: state.selectedWorkspaceId,
      }),
    },
  ),
);

export type Workspace = {
  id: string;
  name: string;
  description?: string;
  isPrivate: boolean;
  communityId: string;
  createdAt: string;
  updatedAt: string;
  memberCount?: number;
  members?: unknown[];
  posts?: unknown[];
};

export interface WorkspaceDto {
  name: string;
  isPrivate?: boolean;
  description?: string;
}

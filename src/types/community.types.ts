export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  profilePictures: {
    id: string;
    url: string;
    isDeleted: boolean;
  }[];
};

export type Member = {
  id: string;
  userId: string;
  communityId: string;
  role: 'ADMIN' | 'MEMBER' | 'MODERATOR';
  joinedAt: string;
  user: User;
};

export type Community = {
  id: string;
  name: string;
  bio?: string;
  about?: string;
  location?: string;
  description?: string;
  image?: string;
  banner?: string[];
  images?: string[];
  topics: string[];
  isActive: boolean;
  isPaid: boolean;
  subscriptionAmount?: number;
  website?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  createdAt: string;
  updatedAt: string;
  members: Member[];
  workspaces: unknown[];
  _count: {
    posts: number;
    workspaces: number;
    members: number;
  };
};

export interface CreateCommunityDto {
  name?: string;
  bio?: string;
  description?: string;
  location?: string;
  image?: import('./uploads.types').FileUploadPayload;
  images?: import('./uploads.types').FileUploadPayload[];
  banner?: import('./uploads.types').FileUploadPayload[];
  isActive?: boolean;
  isPaid?: boolean;
  subscriptionAmount?: number;
  website?: string;
  youtube?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
}

export type UpdateCommunityDto = CreateCommunityDto;

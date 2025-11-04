export type Post = {
  id: string;
  userId: string;
  content?: string;
  urls?: Array<{ url: string; mimetype: string }>;
  communityId: string;
  workspaceId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  commentsCount?: number;
  isLiked?: boolean;
  author?: User;
  comments?: Comment[];
  likes?: PostLike[];
};

export interface CreatePostDto {
  content?: string;
  urls?: import('./uploads.types').FileUploadPayload[];
}

export type UpdatePostDto = CreatePostDto;

export type Comment = {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  likesCount?: number;
  isLiked?: boolean;
  user?: User;
  likes?: CommentLike[];
  author?: CommentAuthor;
};

export interface CreateCommentDto {
  content: string;
}

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  profilePicture?: string;
  bio?: string;
};

export type PostLike = {
  id: string;
  postId: string;
  userId: string;
  createdAt: string;
  user?: User;
};

export type CommentLike = {
  id: string;
  commentId: string;
  userId: string;
  createdAt: string;
  user?: User;
};

export type CommentAuthor = {
  id?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  createdAt: string;
};

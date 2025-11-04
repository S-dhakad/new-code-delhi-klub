import React from 'react';
import FeedPost from '../common/FeedPost';
import { Post } from 'src/types/post.types';

interface PostsProps {
  posts?: Post[];
  onLike?: (postId: string) => Promise<boolean | void>;
  onUnlike?: (postId: string) => Promise<boolean | void>;
  onComment?: (postId: string, content: string) => Promise<boolean | void>;
  onUpdate?: (postId: string, content: string) => Promise<boolean>;
  onDelete?: (postId: string) => Promise<boolean>;
  onUpdateComment?: (
    postId: string,
    commentId: string,
    content: string,
  ) => Promise<boolean | void>;
  onDeleteComment?: (postId: string, commentId: string) => Promise<boolean>;
  onLikeComment?: (
    postId: string,
    commentId: string,
  ) => Promise<boolean | void>;
  onUnlikeComment?: (
    postId: string,
    commentId: string,
  ) => Promise<boolean | void>;
}

const Posts = ({
  posts = [],
  onLike,
  onUnlike,
  onComment,
  onUpdate,
  onDelete,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
  onUnlikeComment,
}: PostsProps) => {
  if (posts.length === 0) {
    return null; // Don't show the section if no posts
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-text-secondary">Featured Post</h2>
        {posts.length > 1 && (
          <div className="font-medium text-primary cursor-pointer hover:underline">
            View all
          </div>
        )}
      </div>
      <div className="space-y-6">
        {posts.map((post) => (
          <FeedPost
            key={post.id}
            post={post}
            onLike={onLike}
            onUnlike={onUnlike}
            onComment={onComment}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onUpdateComment={onUpdateComment}
            onDeleteComment={onDeleteComment}
            onLikeComment={onLikeComment}
            onUnlikeComment={onUnlikeComment}
          />
        ))}
      </div>
    </section>
  );
};

export default Posts;

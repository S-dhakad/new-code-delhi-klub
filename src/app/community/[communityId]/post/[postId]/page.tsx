'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { Fragment } from 'react';
import FeedCard from 'src/components/feed/FeedCard';
import PostCardSkeleton from 'src/components/skeletons/PostCardSkeleton';
import { useFeedData } from 'src/hooks/useFeedData';

const PostPage = () => {
  const params = useParams<{ communityId: string; postId: string }>();
  const communityId = params?.communityId;
  const postId = params?.postId;

  const {
    posts,
    community,
    spacesForSidebar,
    selectedSpace,
    handleWorkspaceChange,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost,
    handleDislikePost,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handledisLikeComment,
    postsLoading,
  } = useFeedData();

  const post = posts?.find((p) => p.id === postId);

  return (
    <Fragment>
      <div className="border-b border-[#ECECEC]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:pt-[30px] sm:pb-[15px]">
            <h1 className="w-full sm:w-auto text-xl sm:text-xl font-semibold leading-tight text-[#000000]">
              My Feed
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-[677px] mx-auto mt-[30px]">
        <Link
          href="/feed"
          className="px-[10px] py-3 bg-[#0A5DBC] text-sm font-semibold text-[#FFFFFF] h-[42px] rounded-[15px] mb-[18px] flex gap-1 max-w-max transition-colors duration-300 hover:bg-[#053875]"
        >
          <Image
            src="/arrow-left-white.svg"
            alt="back arrow icon"
            width={18}
            height={18}
          />
          Back to Feed
        </Link>
        <div>
          {postsLoading ? (
            <PostCardSkeleton />
          ) : post ? (
            <FeedCard
              key={post.id}
              post={post}
              community={community}
              spaces={spacesForSidebar}
              selectedSpace={selectedSpace}
              setSelectedSpace={handleWorkspaceChange}
              handleUpdatePost={handleUpdatePost}
              handleDeletePost={handleDeletePost}
              handleLikePost={handleLikePost}
              handleDislikePost={handleDislikePost}
              handleCreateComment={handleCreateComment}
              handleUpdateComment={handleUpdateComment}
              handleLikeComment={handleLikeComment}
              handledisLikeComment={handledisLikeComment}
              handleDeleteComment={handleDeleteComment}
            />
          ) : (
            <div className="text-center text-gray-500 py-10 font-medium">
              Post Not Found
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default PostPage;

'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Separator } from 'src/components/ui/separator';
import { Textarea } from 'src/components/ui/textarea';
import { Post } from 'src/types/post.types';
import { formatRelativeDate } from 'src/utils/formatDate';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import PostComposerModal from './PostComposerModal';
import UpdateCommentModal from './UpdateCommentModal';
import { useProfileStore } from 'src/store/profile.store';
import { useCommunityStore } from 'src/store/community.store';
import checkUrlType from 'src/utils/checkUrlType';
import { Community } from 'src/types/community.types';
import VideoPlayer from '../VideoPlayer';
import Button from '../mobile/common/ui/Button';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';

export default function FeedCard({
  post,
  spaces,
  selectedSpace,
  community,
  setSelectedSpace,
  handleUpdatePost,
  handleDeletePost,
  handleLikePost,
  handleDislikePost,
  handleCreateComment,
  handleUpdateComment,
  handleLikeComment,
  handledisLikeComment,
  handleDeleteComment,
}: {
  post: Post;
  spaces: string[];
  selectedSpace: string;
  community: Community | null;
  setSelectedSpace: (s: string) => void;
  handleUpdatePost: (
    postId: string,
    content: string,
  ) => Promise<boolean> | void;
  handleDeletePost: (postId: string) => Promise<boolean> | void;
  handleLikePost: (postId: string) => Promise<boolean> | void;
  handleDislikePost: (postId: string) => Promise<boolean> | void;
  handleCreateComment: (
    postId: string,
    content: string,
  ) => Promise<boolean> | void;
  handleUpdateComment: (
    postId: string,
    commentId: string,
    content: string,
  ) => Promise<boolean> | void;
  handleLikeComment: (
    postId: string,
    commentId: string,
  ) => Promise<boolean> | void;
  handledisLikeComment: (
    postId: string,
    commentId: string,
  ) => Promise<boolean> | void;
  handleDeleteComment: (
    postId: string,
    commentId: string,
  ) => Promise<boolean> | void;
}) {
  const [showCommentSection, setshowCommentSection] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openUpdateCommentModal, setOpenUpdateCommentModal] = useState(false);
  const [content, setContent] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [source, setSource] = useState<string | null>(null);
  const [editCommentId, setEditCommentId] = useState<string>('');
  const { profile } = useProfileStore();
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [],
  );
  const { userCommunity } = useCommunityStore();

  const isPostLiked =
    post.likes?.some((like) => like.user?.username === profile?.username) ||
    false;
  const postLikesCount = post.likes?.length || 0;
  return (
    <>
      <article className="bg-white rounded-[20px] border border-#ECECEC overflow-hidden mb-6">
        <div className="p-5">
          <div className="flex items-start gap-3">
            {post.author?.profilePicture &&
            typeof post.author.profilePicture === 'string' &&
            post.author.profilePicture.trim() !== '' ? (
              <Image
                src={`${post.author?.profilePicture}`}
                alt="profile photo"
                width={44}
                height={44}
                className="object-cover h-11 w-11 rounded-[10px]"
              />
            ) : (
              <div className="h-11 w-11 rounded-[10px] bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {post.author?.firstName?.charAt(0) || 'U'}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium text-[#000000]">
                    {post.author?.firstName} {post.author?.lastName}
                  </div>
                  <div className="text-sm font-medium text-[#B5B5B5]">
                    {formatRelativeDate(post.createdAt)}
                  </div>
                </div>
                <div className="text-gray-500 cursor-pointer relative">
                  {(post.author?.username === profile?.username ||
                    userCommunity?.role === 'ADMIN') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-0 cursor-pointer">
                        <Image
                          src="/threeDot.svg"
                          alt="more"
                          width={6}
                          height={22}
                        />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="p-3 rounded-2xl left-auto"
                        align="start"
                        side="left"
                      >
                        {post.author?.username === profile?.username && (
                          <DropdownMenuItem
                            className="p-2 font-medium text-sm text-black"
                            onClick={() => {
                              setOpenModal(true);
                              setSource('updatePost');
                            }}
                          >
                            <span>Edit Post</span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuItem
                          className="p-2 font-medium text-sm text-red-500 focus:text-red-500"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <span>Delete Post</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[#000000] text-base font-normal mt-2 ">
              {post.content}
            </p>

            <div className="mt-4 flex gap-3 w-full overflow-auto scrollbar-hide">
              {post.urls?.map((item, index) => {
                const urlType = checkUrlType(item.mimetype);

                return (
                  <div
                    key={index}
                    className="w-[311px] h-[189px] flex-shrink-0 rounded-[10px] overflow-hidden flex items-center justify-center bg-[#f9f9f9]"
                  >
                    {urlType && urlType == 'image' ? (
                      <Image
                        src={item.url}
                        alt="Post image"
                        width={311}
                        height={189}
                        className="object-cover w-full h-full rounded-[10px]"
                      />
                    ) : urlType && urlType == 'video' ? (
                      <VideoPlayer src={item.url} width="311" height="189" />
                    ) : urlType && urlType == 'file' ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center w-full h-full text-sm text-gray-700 bg-gray-100"
                      >
                        <Image
                          src="/pdfIcon.svg"
                          alt="pdf"
                          width={32}
                          height={32}
                        />
                        Open PDF
                      </a>
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
                        Unsupported file
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <Image
                    src={isPostLiked ? '/heartBlue.svg' : '/heart-black.svg'}
                    alt="like"
                    width={22}
                    height={22}
                    onClick={
                      isPostLiked
                        ? () => handleDislikePost(post.id)
                        : () => handleLikePost(post.id)
                    }
                    className="cursor-pointer"
                  />
                  <span>{postLikesCount}</span>
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={() => setshowCommentSection((prev) => !prev)}
                >
                  <Image
                    src="/chat.svg"
                    alt="comment"
                    width={22}
                    height={22}
                    className="cursor-pointer"
                  />
                  <span>{post.comments?.length ?? 0}</span>
                </div>
                <div
                  className="flex items-center gap-2"
                  onClick={() =>
                    copyToClipboardWithToast(
                      `/community/${community?.id}/post/${post.id}`,
                    )
                  }
                >
                  <Image
                    src="/ShareIconBlack.svg"
                    alt="share"
                    width={22}
                    height={22}
                    className="cursor-pointer"
                  />
                  <span>0</span>
                </div>
              </div>
              {/* {fullcard && (
                <div>
                  <Image
                    src="/bookmark.svg"
                    alt="bookmark"
                    width={24}
                    height={24}
                  />
                </div>
              )} */}
            </div>

            {showCommentSection && (
              <>
                <Separator className="my-5 border-t" />
                <div className="space-y-5">
                  {post?.comments?.length
                    ? post.comments.map((comment, index) => {
                        // Check if current user has liked this comment
                        const isCommentLiked =
                          comment.likes?.some(
                            (like) => like.user?.username === profile?.username,
                          ) || false;

                        // Get comment likes count
                        const commentLikesCount = comment.likes?.length || 0;

                        return (
                          <div
                            key={index}
                            className="flex items-start justify-between"
                          >
                            <div className="flex items-start gap-3">
                              {profile?.profilePicture &&
                              typeof profile.profilePicture === 'string' &&
                              profile.profilePicture.trim() !== '' ? (
                                <Image
                                  src={`${profile?.profilePicture}`}
                                  alt="profile icon"
                                  width={36}
                                  height={36}
                                  className="w-9 h-9 flex-shrink-0 rounded-xl object-cover"
                                />
                              ) : (
                                <div className="w-9 h-9 flex-shrink-0 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                                  <span className="text-white text-xs font-semibold">
                                    {profile?.firstName?.charAt(0) || 'U'}
                                  </span>
                                </div>
                              )}
                              <div>
                                <h5 className="text-sm font-semibold text-black">
                                  {comment.author?.firstName}{' '}
                                  {comment.author?.lastName}
                                </h5>
                                <p className="text-sm font-medium text-gray-500">
                                  {formatRelativeDate(comment.updatedAt)}
                                </p>
                                <p className="text-sm font-medium text-black mt-3">
                                  {comment.content}
                                </p>
                                <div className="flex gap-1 items-center mt-3">
                                  <Image
                                    src={
                                      isCommentLiked
                                        ? '/heartBlue.svg'
                                        : '/heart-black.svg'
                                    }
                                    alt="like icon"
                                    width={16}
                                    height={16}
                                    onClick={
                                      isCommentLiked
                                        ? () =>
                                            handledisLikeComment(
                                              post.id,
                                              comment.id,
                                            )
                                        : () =>
                                            handleLikeComment(
                                              post.id,
                                              comment.id,
                                            )
                                    }
                                    className="cursor-pointer"
                                  />
                                  <span className="text-sm font-medium text-gray-500">
                                    {commentLikesCount}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger className="p-0 cursor-pointer">
                                <Image
                                  src="/threeDot.svg"
                                  alt="more"
                                  width={6}
                                  height={41}
                                />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                className="p-3 rounded-2xl left-auto"
                                align="start"
                                side="left"
                              >
                                <DropdownMenuItem
                                  className="p-2 font-medium text-sm text-black"
                                  onClick={() => {
                                    setOpenUpdateCommentModal(true);
                                    setEditCommentId(comment.id);
                                    setCommentContent(comment.content);
                                  }}
                                >
                                  <span>Edit Comment</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="p-2 font-medium text-sm text-red-500 focus:text-red-500"
                                  onClick={() =>
                                    handleDeleteComment(post.id, comment.id)
                                  }
                                >
                                  <span>Delete Comment</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        );
                      })
                    : null}
                </div>
                <div className="relative flex items-center gap-3 mt-5">
                  <div className="absolute top-1/2 -translate-y-1/2 left-[10px]">
                    {profile?.profilePicture &&
                    typeof profile.profilePicture === 'string' &&
                    profile.profilePicture.trim() !== '' ? (
                      <Image
                        src={`${profile.profilePicture}`}
                        alt="profile photo"
                        width={36}
                        height={36}
                        className="object-cover rounded-[10px]"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {profile?.firstName?.charAt(0) || 'U'}
                        </span>
                      </div>
                    )}
                  </div>
                  <Textarea
                    rows={1}
                    placeholder="Write a comment.."
                    className="resize-none border border-[#ECECEC] rounded-[15px] pl-16 pr-3 py-2"
                    onChange={handleChange}
                    value={content}
                  />
                  <Button
                    className="bg-[#0A5DBC] text-white hover:text-white rounded-[15px] px-3 text-sm font-medium h-[34px] hover:bg-[#053875] transition-colors duration-300"
                    onClick={async () => {
                      {
                        await handleCreateComment(post.id, content);
                      }
                      setContent('');
                    }}
                  >
                    Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </article>
      <PostComposerModal
        post={post}
        open={openModal}
        spaces={spaces}
        source={source}
        onOpenChange={setOpenModal}
        handleUpdatePost={handleUpdatePost}
        selectedSpace={selectedSpace}
        setSelectedSpace={setSelectedSpace}
      />
      <UpdateCommentModal
        openUpdateCommentModal={openUpdateCommentModal}
        setOpenUpdateCommentModal={setOpenUpdateCommentModal}
        handleUpdateComment={handleUpdateComment}
        post={post}
        editCommentId={editCommentId}
        commentContent={commentContent}
      />
    </>
  );
}

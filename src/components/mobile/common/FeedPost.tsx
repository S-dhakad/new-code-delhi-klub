'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Bookmark,
  Heart,
  MessageSquare,
  MoreVertical,
  Share2,
  X,
  Play,
  Pause,
  Edit2,
  Trash2,
} from 'lucide-react';
import { Input } from 'src/components/ui/input';
import { Post } from 'src/types/post.types';
import { useProfileStore } from 'src/store/profile.store';
import { useCommunityStore } from 'src/store/community.store';
import checkUrlType from 'src/utils/checkUrlType';
import { formatRelativeDate } from 'src/utils/formatDate';
import { Textarea } from 'src/components/ui/textarea';
import { Button } from 'src/components/ui/button';
import EditPostCard from '../feed/EditPostCard';
import { useToastStore } from 'src/store/toast.store';
interface FeedPostProps {
  post: Post;
  onUpdate?: (postId: string, content: string) => Promise<boolean>;
  onDelete?: (postId: string) => Promise<boolean>;
  onLike?: (postId: string) => Promise<boolean | void>;
  onUnlike?: (postId: string) => Promise<boolean | void>;
  onComment?: (postId: string, content: string) => Promise<boolean | void>;
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
  spaces?: string[];
  selectedSpace?: string;
  setSelectedSpace?: (space: string) => void;
}

export default function FeedPost({
  post,
  onUpdate,
  onDelete,
  onLike,
  onUnlike,
  onComment,
  onUpdateComment,
  onDeleteComment,
  onLikeComment,
  onUnlikeComment,
  spaces,
  selectedSpace,
  setSelectedSpace,
}: FeedPostProps) {
  const { profile } = useProfileStore();
  const { userCommunity } = useCommunityStore();
  const { showToast } = useToastStore();
  const slides = post?.urls || [];

  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const PEEK = 48;
  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showComment, setShowComment] = useState(false);
  const [fullScreenMedia, setFullScreenMedia] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [isPlaying, setIsPlaying] = useState<Record<number, boolean>>({});
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState<string | null>(null);
  const [showEditPostModal, setShowEditPostModal] = useState(false);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editCommentContent, setEditCommentContent] = useState('');

  const userHasLiked = post?.likes?.some(
    (like) => like.user?.username === profile?.username,
  );
  const likesCount = post?.likes?.length || 0;
  const commentsCount = post?.comments?.length || 0;

  // Keep index in sync on manual swipe
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const slideWidth = el.clientWidth - PEEK;
    const i = Math.round(el.scrollLeft / slideWidth);
    setIndex(Math.max(0, Math.min(slides.length - 1, i)));
  };

  // Interactions
  const toggleLike = async () => {
    if (userHasLiked) {
      await onUnlike?.(post.id);
    } else {
      await onLike?.(post.id);
    }
  };

  const onCommentClick = () => {
    setShowComment((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => commentInputRef.current?.focus());
      }
      return next;
    });
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !onComment) return;

    const success = await onComment(post.id, commentText);
    if (success !== false) {
      setCommentText('');
    }
  };

  const handleUpdatePost = async (postId: string, content: string) => {
    if (!content.trim() || !onUpdate) return;
    const success = await onUpdate(postId, content);
    if (success !== false) {
      setShowEditPostModal(false);
      setShowPostMenu(false);
    }
  };

  const handleDeletePost = async () => {
    if (!onDelete) return;
    await onDelete(post.id);
    setShowPostMenu(false);
  };

  const handleUpdateCommentSubmit = async (commentId: string) => {
    if (!editCommentContent.trim() || !onUpdateComment) return;
    const success = await onUpdateComment(
      post.id,
      commentId,
      editCommentContent,
    );
    if (success !== false) {
      setEditingComment(null);
      setShowCommentMenu(null);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!onDeleteComment) return;
    await onDeleteComment(post.id, commentId);
    setShowCommentMenu(null);
  };

  const toggleCommentLike = async (commentId: string, isLiked: boolean) => {
    if (isLiked) {
      await onUnlikeComment?.(post.id, commentId);
    } else {
      await onLikeComment?.(post.id, commentId);
    }
  };

  const onShareClick = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: 'success', title: 'URL copied to clipboard' });
    } catch (error) {
      showToast({ type: 'error', title: 'Failed to copy URL' });
    }
  };

  const pauseAllVideos = () => {
    videoRefs.current.forEach((v, idx) => {
      if (v && !v.paused) v.pause();
      setIsPlaying((prev) => ({ ...prev, [idx]: false }));
    });
  };

  const openFullScreen = (url: string, type: 'image' | 'video') => {
    if (type === 'video') pauseAllVideos();
    setFullScreenMedia({ url, type });
  };

  const closeFullScreen = () => {
    setFullScreenMedia(null);
  };

  // Programmatic slide (optional)
  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(slides.length - 1, i));
    const slideWidth = el.clientWidth - PEEK;
    el.scrollTo({ left: clamped * slideWidth, behavior: 'smooth' });
  };

  useEffect(() => {
    // Pause videos that are not in view when index changes
    videoRefs.current.forEach((v, j) => {
      if (!v) return;
      if (j !== index && !v.paused) {
        v.pause();
        setIsPlaying((prev) => ({ ...prev, [j]: false }));
      }
    });
  }, [index]);

  useEffect(() => {
    if (showEditPostModal) {
      setFadeIn(false);
      requestAnimationFrame(() => setFadeIn(true));
    } else {
      setFadeIn(false);
    }
  }, [showEditPostModal]);

  return (
    <article className="border-y px-4 py-5 bg-white">
      {/* Author row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/feedImage.jpg"
            alt="author"
            width={44}
            height={44}
            className="rounded-[10px] object-cover aspect-square"
          />
          <div>
            <div className="text-base font-medium leading-tight">
              {post.author?.firstName} {post.author?.lastName}
            </div>
            <div className="mt-1.5 text-sm text-text-secondary font-medium">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
        <div className="relative">
          {(post.author?.username === profile?.username ||
            userCommunity?.role === 'ADMIN') && (
            <>
              <button
                onClick={() => setShowPostMenu(!showPostMenu)}
                className="p-1"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {showPostMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowPostMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-50 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                    {post.author?.username === profile?.username && (
                      <button
                        onClick={() => {
                          setShowEditPostModal(true);
                          setShowPostMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Post
                      </button>
                    )}
                    <button
                      onClick={handleDeletePost}
                      className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Post
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Title & excerpt */}
      <p className="mt-5 text-base">{post.content}</p>

      {/* Media carousel */}
      {slides.length > 0 && (
        <div className="mt-5">
          <div
            ref={trackRef}
            onScroll={onScroll}
            className="carousel-scroll relative flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth pr-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {slides.map((s: { url: string; mimetype: string }, i: number) => {
              const urlType = checkUrlType(s.mimetype);
              return (
                <div
                  key={i}
                  className="slide shrink-0 snap-start mr-3"
                  style={{ width: `calc(100% - ${PEEK}px)` }}
                >
                  {urlType === 'image' ? (
                    <div
                      className="overflow-hidden rounded-2xl cursor-pointer"
                      onClick={() => openFullScreen(s.url, 'image')}
                    >
                      <Image
                        src={s.url}
                        alt={`post image ${i + 1}`}
                        width={1000}
                        height={600}
                        className="h-52 w-full object-cover"
                      />
                    </div>
                  ) : urlType === 'video' ? (
                    <div
                      className="overflow-hidden rounded-2xl cursor-pointer relative"
                      onClick={() => openFullScreen(s.url, 'video')}
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[i] = el;
                        }}
                        src={s.url}
                        autoPlay
                        className="h-52 w-full object-cover"
                        onPlay={() =>
                          setIsPlaying((prev) => ({ ...prev, [i]: true }))
                        }
                        onPause={() =>
                          setIsPlaying((prev) => ({ ...prev, [i]: false }))
                        }
                      />
                      <button
                        type="button"
                        aria-label={isPlaying[i] ? 'Pause video' : 'Play video'}
                        onClick={(e) => {
                          e.stopPropagation();
                          const v = videoRefs.current[i];
                          if (!v) return;
                          if (v.paused) {
                            v.play();
                            setIsPlaying((prev) => ({ ...prev, [i]: true }));
                          } else {
                            v.pause();
                            setIsPlaying((prev) => ({ ...prev, [i]: false }));
                          }
                        }}
                        className="absolute bottom-2 right-2 z-10 bg-black/60 text-white p-2 rounded-full"
                      >
                        {isPlaying[i] ? (
                          <Pause className="h-5 w-5" />
                        ) : (
                          <Play className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  ) : urlType === 'file' ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center w-full h-full text-sm text-gray-700 bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-10 h-10 mb-2 text-red-500"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m0 0L8.25 15m3.75 4.5l3.75-4.5M4.5 12h15"
                        />
                      </svg>
                      Open PDF
                    </a>
                  ) : null}
                </div>
              );
            })}
          </div>
          {slides.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-1.5">
              {slides.map((_: { url: string; mimetype: string }, i: number) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${i === index ? 'bg-primary w-4' : 'bg-gray-300 w-1.5'}`}
                />
              ))}
            </div>
          )}
          <style jsx>{`
            .carousel-scroll::-webkit-scrollbar {
              display: none;
            }
          `}</style>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={toggleLike}
            className="flex items-center gap-1.5"
          >
            <Heart
              className={`h-6 w-6 ${userHasLiked ? 'text-primary' : ''}`}
              fill={userHasLiked ? 'currentColor' : 'none'}
            />
            <span>{likesCount}</span>
          </button>
          <button
            type="button"
            onClick={onCommentClick}
            className="flex items-center gap-1.5"
          >
            <MessageSquare
              className={`h-6 w-6 ${showComment ? 'text-primary' : ''}`}
            />
            <span>{commentsCount}</span>
          </button>
          <button onClick={onShareClick} className="flex items-center gap-1.5">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div
        className={`mt-5 overflow-hidden transition-all duration-300 ${
          showComment ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        aria-hidden={!showComment}
      >
        <div className="space-y-4">
          {/* Render existing comments */}
          {post?.comments && post.comments.length > 0 && (
            <div className="space-y-5 pt-5 border-t border-gray-200">
              {post.comments.map((comment) => {
                const isCommentLiked =
                  comment.likes?.some(
                    (like) => like.user?.username === profile?.username,
                  ) || false;
                const commentLikesCount = comment.likes?.length || 0;
                console.log(comment);

                return (
                  <div key={comment.id} className="flex gap-3">
                    <div className="flex-shrink-0">
                      {comment.author?.profilePicture ? (
                        <Image
                          src={comment.author?.profilePicture}
                          alt="author"
                          width={36}
                          height={36}
                          className="rounded-[10px] object-cover aspect-square"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {comment.author?.firstName?.charAt(0) ||
                              comment.user?.firstName?.charAt(0) ||
                              'U'}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">
                            {comment.author?.firstName}{' '}
                            {comment.author?.lastName}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {formatRelativeDate(comment.updatedAt)}
                          </div>
                          {editingComment === comment.id ? (
                            <div className="mt-2 space-y-2">
                              <Textarea
                                value={editCommentContent}
                                onChange={(e) =>
                                  setEditCommentContent(e.target.value)
                                }
                                className="text-sm min-h-[60px]"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() =>
                                    handleUpdateCommentSubmit(comment.id)
                                  }
                                  size="sm"
                                  className="bg-primary text-white h-7 text-xs"
                                >
                                  Save
                                </Button>
                                <Button
                                  onClick={() => {
                                    setEditingComment(null);
                                    setEditCommentContent('');
                                  }}
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm mt-2">{comment.content}</p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <button
                              onClick={() =>
                                toggleCommentLike(comment.id, isCommentLiked)
                              }
                              className="flex items-center gap-1"
                            >
                              <Heart
                                className={`h-4 w-4 ${
                                  isCommentLiked
                                    ? 'text-primary'
                                    : 'text-gray-500'
                                }`}
                                fill={isCommentLiked ? 'currentColor' : 'none'}
                              />
                              <span className="text-xs text-gray-500">
                                {commentLikesCount}
                              </span>
                            </button>
                          </div>
                        </div>
                        <div className="relative">
                          {(comment.user?.username === profile?.username ||
                            userCommunity?.role === 'ADMIN') && (
                            <>
                              <button
                                onClick={() =>
                                  setShowCommentMenu(
                                    showCommentMenu === comment.id
                                      ? null
                                      : comment.id,
                                  )
                                }
                                className="p-1"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              {showCommentMenu === comment.id && (
                                <>
                                  <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowCommentMenu(null)}
                                  />
                                  <div className="absolute right-0 top-6 z-50 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2">
                                    {(comment.user?.username ===
                                      profile?.username ||
                                      comment.user?.id === profile?.id ||
                                      comment.userId === profile?.id) && (
                                      <button
                                        onClick={() => {
                                          setEditingComment(comment.id);
                                          setEditCommentContent(
                                            comment.content,
                                          );
                                          setShowCommentMenu(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                                      >
                                        <Edit2 className="h-3 w-3" />
                                        Edit
                                      </button>
                                    )}
                                    <button
                                      onClick={() =>
                                        handleDeleteComment(comment.id)
                                      }
                                      className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-gray-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Comment input bar */}
          <form
            onSubmit={handleCommentSubmit}
            className="flex items-center gap-2 px-[10px] py-2 border border-border-stroke-regular rounded-[10px]"
          >
            <Image
              src={profile?.profilePicture || '/feedImage.jpg'}
              alt="author"
              width={36}
              height={36}
              className="rounded-[10px] object-cover aspect-square"
            />
            <Input
              ref={commentInputRef}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment"
              className="rounded-[10px] h-auto bg-white text-sm font-medium text-text-secondary border-none"
            />
            <Button
              type="submit"
              size="sm"
              className="bg-primary text-white h-8 px-3 text-xs"
            >
              Send
            </Button>
          </form>
        </div>
      </div>

      {/* Full Screen Media Modal */}
      {fullScreenMedia && (
        <div
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
          onClick={closeFullScreen}
        >
          <button
            onClick={closeFullScreen}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Close full screen"
          >
            <X className="h-6 w-6" />
          </button>
          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {fullScreenMedia.type === 'image' ? (
              <Image
                src={fullScreenMedia.url}
                alt="Full screen image"
                fill
                className="object-contain"
                onClick={closeFullScreen}
              />
            ) : (
              <video
                src={fullScreenMedia.url}
                controls
                autoPlay
                className="max-w-full max-h-full w-auto h-auto"
              />
            )}
          </div>
        </div>
      )}

      {/* Edit Post Modal */}
      {showEditPostModal && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-200 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-[#F6F6F6]">
            <EditPostCard
              post={post}
              onClose={() => setShowEditPostModal(false)}
              onUpdate={handleUpdatePost}
              spaces={spaces}
              selectedSpace={selectedSpace}
              setSelectedSpace={setSelectedSpace}
            />
          </div>
        </div>
      )}
    </article>
  );
}

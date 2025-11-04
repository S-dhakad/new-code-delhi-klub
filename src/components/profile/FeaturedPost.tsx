'use client';

import React, { Fragment, useState } from 'react';
import Image from 'next/image';
import { Profile } from 'src/types/profile.types';
import { Post } from 'src/types/post.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import checkUrlType from 'src/utils/checkUrlType';
import { formatRelativeDate } from 'src/utils/formatDate';

export default function FeaturedPost({
  post,
  profile,
}: {
  post: Post;
  profile: Profile;
}) {
  const isPostLiked =
    post.likes?.some((like) => like.user?.username === profile.username) ||
    false;
  const postLikesCount = post.likes?.length || 0;
  return (
    <>
      <article className="bg-white rounded-xl border-0 overflow-hidden mb-6">
        <div className="p-5">
          <div className="flex items-start gap-3">
            {profile.profilePicture && (
              <Image
                src={`${profile.profilePicture}`}
                alt="profile icon"
                width={44}
                height={44}
                className="rounded-[10px]"
              />
            )}

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-medium text-[#000000]">
                    {profile.firstName} {profile.lastName}
                  </div>
                  <div className="text-sm font-medium text-[#B5B5B5]">
                    {formatRelativeDate(post.createdAt)}
                  </div>
                </div>
                <div className="text-gray-500 cursor-pointer relative">
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
                      <DropdownMenuItem className="p-2 font-medium text-sm text-black">
                        <span>Edit Post</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-2 font-medium text-sm text-red-500 focus:text-red-500">
                        <span>Delete Post</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="mt-2 text-[#000000] text-base font-normal">
              {post.content}
            </p>
            <div className="mt-4 flex gap-3 w-full overflow-auto scrollbar-hide">
              {post.urls?.map((item, index) => {
                const urlType = checkUrlType(item.mimetype);
                return (
                  <Fragment key={index}>
                    {item.url && (
                      <div className="w-[311px] h-[189px] flex-shrink-0 rounded-[10px] overflow-hidden flex items-center justify-center bg-[#f9f9f9]">
                        {urlType && urlType == 'image' ? (
                          <Image
                            src={item.url}
                            alt="Post image"
                            width={311}
                            height={189}
                            className="object-cover w-full h-full rounded-[10px]"
                          />
                        ) : urlType && urlType == 'video' ? (
                          <video
                            src={item.url}
                            autoPlay
                            className="object-cover w-full h-full rounded-[10px]"
                          />
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
                    )}
                  </Fragment>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm font-medium text-[#000000]">
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <Image
                    src={isPostLiked ? '/heartBlue.svg' : '/heart-black.svg'}
                    alt="like"
                    width={22}
                    height={22}
                    className="cursor-pointer"
                  />
                  <span>{postLikesCount}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image
                    src="/chat.svg"
                    alt="comment"
                    width={22}
                    height={22}
                    className="cursor-pointer"
                  />
                  <span>{post.comments?.length ?? 0}</span>
                </div>
                <div className="flex items-center gap-2">
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
            </div>
          </div>
        </div>
      </article>
    </>
  );
}

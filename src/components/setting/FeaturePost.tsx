'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'src/components/ui/accordion';
import Image from 'next/image';
import { Button } from '../ui/button';
import useFeaturedPosts from 'src/hooks/useFeaturedPosts';
import { useCommunityStore } from 'src/store/community.store';
import { useProfileStore } from 'src/store/profile.store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export default function FeaturePost() {
  const [open, setOpen] = useState(false);
  const { community } = useCommunityStore();
  const { profile } = useProfileStore();
  const {
    data: featuredPosts,
    loading,
    error,
    refetch,
  } = useFeaturedPosts(community?.id);

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="feature" className="overflow-hidden">
        <AccordionTrigger
          className={`px-6 py-4 hover:no-underline bg-white flex justify-between items-center ${
            open ? 'rounded-b-none rounded-t-[20px]' : 'rounded-[20px]'
          } [&>svg]:hidden`}
          onClick={() => setOpen(!open)}
        >
          <div className="text-base font-semibold text-[#000000]">
            Feature posts
          </div>
          <Image
            src="/downArrow.svg"
            width={24}
            height={24}
            alt="down arrow icon"
            className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </AccordionTrigger>

        <AccordionContent className="mt-4 bg-white border-t-2 border-[#0A5DBC] pb-0 rounded-b-[20px]">
          {/* responsive padding */}
          <div className="py-8 px-4 sm:px-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h4 className="text-sm sm:text-base font-medium text-[#000000]">
                Highlight posts that you want other to see first
              </h4>

              {/* actions: stacked on mobile, inline on sm+ */}
              <div className="flex w-full sm:w-auto flex-col sm:flex-row gap-2 sm:gap-4 mt-2 sm:mt-0">
                <Button
                  variant="ghost"
                  className="rounded-[10px] px-4 py-2 w-full sm:w-20 border border-[#ECECEC] h-[34px] text-sm font-medium text-[#000000]"
                >
                  <Image
                    src="/edit-2.svg"
                    alt="edit icon"
                    width={16}
                    height={16}
                  />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="rounded-[10px] bg-[#0A5DBC] px-4 py-2 border border-[#0A5DBC] text-white w-full sm:w-auto h-[34px] text-sm font-medium hover:bg-[#053875] transition-colors duration-300"
                >
                  Add new
                </Button>
              </div>
            </div>

            {/* posts grid: 1 column on xs, 2 on md+ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredPosts.length > 0 &&
                profile &&
                featuredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-[20px] border border-[#ECECEC] bg-white p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* header: stack on xs, inline on sm+ */}
                      <div className="flex sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start sm:items-center gap-3 min-w-0">
                          {profile?.profilePicture && (
                            <div className="w-11 h-11 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                              <Image
                                src={profile.profilePicture}
                                alt="Profile pic"
                                width={44}
                                height={44}
                                className="object-cover rounded-xl w-11 h-11"
                              />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="text-base font-medium text-[#000000]">
                              {profile?.firstName} {profile.lastName}
                            </div>
                            <div className="text-sm font-medium text-[#B5B5B5]">
                              {post.createdAt}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 sm:mt-0 flex items-start sm:items-center">
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
                              className="p-3 rounded-2xl"
                              align="start"
                              side="left"
                            >
                              <DropdownMenuItem className="p-2 font-medium text-sm text-black">
                                <span>Edit Post</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="p-2 font-medium text-sm text-red-500 hover:text-red-500">
                                <span>Delete Post</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="mt-4">
                        {/* <h3 className={`text-base font-semibold mb-3`}></h3> */}
                        <p className="text-base font-normal text-[#000000]">
                          {post.content}
                        </p>
                        {/* {post.image && (
                        <div className="mt-4">
                          <div className="rounded-lg overflow-hidden">
                            <Image
                              src={post.image}
                              alt={post.title}
                              width={600}
                              height={260}
                              className="w-full h-auto object-cover"
                            />
                          </div>
                        </div>
                      )} */}
                      </div>
                    </div>

                    {/* footer actions: wrap on small, align end on sm+ */}
                    <footer className="mt-4 flex flex-wrap sm:flex-nowrap items-center sm:justify-start gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Image
                          src={
                            post.likes?.some(
                              (like) =>
                                like.user?.username === profile?.username,
                            )
                              ? '/heartBlue.svg'
                              : '/heart-black.svg'
                          }
                          alt="likes"
                          width={20}
                          height={20}
                        />
                        <span className="text-base font-medium text-[#000000]">
                          {post.likes?.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/chat.svg"
                          alt="comments"
                          width={20}
                          height={20}
                        />
                        <span className="text-base font-medium text-[#000000]">
                          {post.comments?.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Image
                          src="/ShareIconBlack.svg"
                          alt="shares"
                          width={20}
                          height={20}
                        />
                        <span className="text-base font-medium text-[#000000]">
                          0
                        </span>
                      </div>
                    </footer>
                  </article>
                ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

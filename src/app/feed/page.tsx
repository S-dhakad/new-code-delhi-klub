'use client';

import React from 'react';
import Image from 'next/image';
import FeedComposer from 'src/components/feed/FeedComposer';
import FeedCard from 'src/components/feed/FeedCard';
import MembersList from 'src/components/feed/MembersList';
import EventsSidebar from 'src/components/feed/EventsSidebar';
import AddSpaceModal from 'src/components/feed/AddSpaceModal';
import SpacesSidebar from 'src/components/feed/SpacesSidebar';
import { Input } from 'src/components/ui/input';
import { useFeedData } from 'src/hooks/useFeedData';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileFeedPage from 'src/mobile-pages/MobileFeedPage';
import PostCardSkeleton from 'src/components/skeletons/PostCardSkeleton';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'src/components/ui/tabs';

function DesktopFeedScreen() {
  const {
    activeTab,
    isAddSpaceOpen,
    spaceName,
    posts,
    upcomingEvents,
    members,
    loading,
    postsLoading,
    allowClick,
    spacesForSidebar,
    selectedSpace,
    activeIsAll,
    community,
    setActiveTab,
    setIsAddSpaceOpen,
    setSpaceName,
    handleWorkspaceChange,
    createNewSpace,
    handlePost,
    handleUpdatePost,
    handleDeletePost,
    handleLikePost,
    handleDislikePost,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    handleLikeComment,
    handledisLikeComment,
  } = useFeedData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="sticky top-0 z-40 bg-[#F6F6F6] border-b border-[#ECECEC] flex items-center">
        <div className="container mx-auto">
          <div className="w-full flex items-center justify-between pt-[30px] pb-[15px]">
            <h1 className="text-[20px] md:text-2xl font-semibold text-[#000000]">
              My Feed
            </h1>

            <div className="block w-40 sm:w-64 lg:w-80 relative">
              <Image
                src="/Search.svg"
                alt="Search"
                width={22}
                height={22}
                className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
              />
              <Input
                placeholder="Find a post, topic.."
                className="pl-12 rounded-[15px] h-[40px] bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      <main className="container">
        <div className="flex gap-[30px]">
          <div className="w-[317px] flex-shrink-0">
            <aside className="sticky top-[130px]">
              <SpacesSidebar
                onAddClick={() => setIsAddSpaceOpen(true)}
                spaces={spacesForSidebar}
                selectedSpace={selectedSpace}
                onSpaceSelect={handleWorkspaceChange}
                activeIsAll={activeIsAll}
              />
            </aside>
          </div>

          <section className="flex-1 min-w-0">
            <Tabs defaultValue="feed" className="gap-0">
              <div className="pt-11 bg-[#F6F6F6] z-10">
                <TabsList className="border-b bg-transparent flex gap-[47px] justify-start w-full rounded-none px-0">
                  <TabsTrigger
                    value="feed"
                    className="tabs-trigger relative text-base font-medium px-0 text-[#787878] max-w-max gap-[10px] data-[state=active]:text-[#0A5DBC] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-[#0A5DBC] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:origin-left"
                  >
                    Feed{' '}
                    <span className="tab-count inline-block text-xs px-2 py-[2px] rounded-[5px] bg-white text-[#787878]">
                      {posts.length}
                    </span>
                  </TabsTrigger>

                  <TabsTrigger
                    value="members"
                    className="tabs-trigger relative text-base font-medium px-0 text-[#787878] max-w-max gap-[10px] data-[state=active]:text-[#0A5DBC] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-[#0A5DBC] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:origin-left"
                  >
                    Members{' '}
                    <span className="tab-count inline-block text-xs px-2 py-[2px] rounded-[5px] bg-white text-[#787878]">
                      {members.length}
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="feed">
                <FeedComposer
                  spaces={spacesForSidebar}
                  selectedSpace={selectedSpace}
                  setSelectedSpace={handleWorkspaceChange}
                  handlePost={handlePost}
                />

                {postsLoading ? (
                  <PostCardSkeleton />
                ) : posts && posts.length > 0 ? (
                  posts.map((post) => (
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
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No posts yet. Be the first to share something!
                  </div>
                )}
              </TabsContent>

              <TabsContent value="members">
                <MembersList
                  members={members.map((member) => ({
                    name: `${member.user?.firstName} ${member.user?.lastName}`.trim(),
                    handle: member.user?.username || '',
                    avatar: member.user?.profilePicture || '',
                    meta: member.joinedAt
                      ? new Date(member.joinedAt).toLocaleDateString()
                      : '',
                  }))}
                  owner={
                    community?.members?.find((m) => m.role === 'ADMIN')?.user
                      ?.firstName
                  }
                  username={
                    community?.members?.find((m) => m.role === 'ADMIN')?.user
                      ?.username
                  }
                  communityId={community?.id || ''}
                />
              </TabsContent>
            </Tabs>
          </section>

          <div className="w-[288px] flex-shrink-0">
            <aside className="sticky top-[130px]">
              <EventsSidebar upcomingEvents={upcomingEvents} />
            </aside>
          </div>
        </div>
      </main>

      <AddSpaceModal
        isOpen={isAddSpaceOpen}
        onClose={() => setIsAddSpaceOpen(false)}
        value={spaceName}
        onChange={setSpaceName}
        onSave={createNewSpace}
        loading={allowClick}
      />
    </>
  );
}

export default function MyFeedPage() {
  const isMobile = useIsMobile();

  // Mobile layout
  if (isMobile) {
    return <MobileFeedPage />;
  }
  return <DesktopFeedScreen />;
}

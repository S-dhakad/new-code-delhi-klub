'use client';

import React from 'react';
import TabsSwitcher from 'src/components/mobile/feed/TabsSwitcher';
import FilterChips from 'src/components/mobile/feed/FilterChips';
import ComposerCard from 'src/components/mobile/feed/ComposerCard';
import FeedPost from 'src/components/mobile/common/FeedPost';
import MembersList from 'src/components/mobile/feed/MembersList';
import { useFeedData } from 'src/hooks/useFeedData';
import TopBar from 'src/components/mobile/feed/TopBar';
import CreatePostCard from 'src/components/mobile/feed/CreatePostCard';

const MobileFeedPage: React.FC = () => {
  const {
    posts,
    members,
    loading,
    postsLoading,
    spacesForSidebar,
    selectedSpace,
    community,
    handleWorkspaceChange,
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
    setSpaceName,
    createNewSpace,
  } = useFeedData();

  const [showCreate, setShowCreate] = React.useState(false);
  const [fadeIn, setFadeIn] = React.useState(false);

  React.useEffect(() => {
    if (showCreate) {
      setFadeIn(false);
      requestAnimationFrame(() => setFadeIn(true));
    } else {
      setFadeIn(false);
    }
  }, [showCreate]);

  if (loading) {
    return (
      <main className="mx-auto max-w-[480px] min-h-dvh bg-white pb-24 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[480px] min-h-dvh bg-[#F6F6F6] pb-24">
      <TopBar />
      <TabsSwitcher
        items={[
          {
            title: 'Feed',
            number: posts.length,
            component: (
              <>
                <FilterChips
                  spaces={spacesForSidebar}
                  selectedSpace={selectedSpace}
                  onSpaceSelect={handleWorkspaceChange}
                  onAddSpace={async (name) => {
                    setSpaceName(name);
                    await createNewSpace();
                  }}
                />
                <ComposerCard
                  onPost={handlePost}
                  selectedSpace={selectedSpace}
                  onOpenCreate={() => setShowCreate(true)}
                />
                <div className="space-y-6 bg-[#F6F6F6]">
                  {postsLoading ? (
                    <div className="text-center py-8">Loading posts...</div>
                  ) : posts && posts.length > 0 ? (
                    posts.map((post) => (
                      <FeedPost
                        key={post.id}
                        post={post}
                        spaces={spacesForSidebar}
                        selectedSpace={selectedSpace}
                        setSelectedSpace={handleWorkspaceChange}
                        onUpdate={handleUpdatePost}
                        onDelete={handleDeletePost}
                        onLike={handleLikePost}
                        onUnlike={handleDislikePost}
                        onComment={handleCreateComment}
                        onUpdateComment={handleUpdateComment}
                        onDeleteComment={handleDeleteComment}
                        onLikeComment={handleLikeComment}
                        onUnlikeComment={handledisLikeComment}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No posts yet. Be the first to share something!
                    </div>
                  )}
                </div>
                {/* <ProfileCard /> */}
                {/* <AddSpace /> */}
              </>
            ),
          },
          {
            title: 'Members',
            number: members.length,
            component: (
              <MembersList
                members={members.map((member) => ({
                  name: `${member.user?.firstName} ${member.user?.lastName}`.trim(),
                  handle: member.user?.username || '',
                  avatar: member.user?.profilePicture || '/feedProfileIcon.jpg',
                  meta: member.joinedAt
                    ? new Date(member.joinedAt).toLocaleDateString()
                    : '',
                }))}
                owner={
                  community?.members?.find((m) => m.role === 'ADMIN')?.user
                    ?.firstName || 'Community Owner'
                }
              />
            ),
          },
        ]}
      />
      {/* Overlay Create Post Card */}
      {showCreate && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-200 ${
            fadeIn ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0 bg-[#F6F6F6]">
            <CreatePostCard
              spaces={spacesForSidebar}
              selectedSpace={selectedSpace}
              setSelectedSpace={handleWorkspaceChange}
              onPost={handlePost}
              onClose={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}
      {/* <BottomNav /> */}
    </main>
  );
};

export default MobileFeedPage;

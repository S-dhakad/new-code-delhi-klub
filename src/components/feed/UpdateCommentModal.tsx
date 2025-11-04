import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from 'src/components/ui/dialog';
import { useProfileStore } from 'src/store/profile.store';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Post } from 'src/types/post.types';

const UpdateCommentModal = ({
  openUpdateCommentModal,
  setOpenUpdateCommentModal,
  handleUpdateComment,
  post,
  editCommentId,
  commentContent,
}: {
  openUpdateCommentModal: boolean;
  setOpenUpdateCommentModal: (open: boolean) => void;
  handleUpdateComment: (
    postId: string,
    commentId: string,
    content: string,
  ) => void;
  post: Post;
  editCommentId: string;
  commentContent: string;
}) => {
  const { profile } = useProfileStore();
  const [content, setContent] = useState(commentContent);
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [],
  );
  useEffect(() => {
    setContent(commentContent ?? '');
  }, [commentContent]);
  const onUpdateClick = () => {
    handleUpdateComment(post.id, editCommentId, content);
    setOpenUpdateCommentModal(false);
  };
  return (
    <Dialog
      open={openUpdateCommentModal}
      onOpenChange={setOpenUpdateCommentModal}
    >
      <DialogContent
        className="sm:max-w-xl rounded-[20px] p-[20px]"
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex gap-2 flex-row">
            {profile?.profilePicture && (
              <Image
                src={`${profile?.profilePicture}`}
                alt="profile pic"
                width={44}
                height={44}
                className="object-cover rounded-[10px] h-[44px] w-[44px]"
              />
            )}
            <div className="flex flex-col">
              <DialogTitle className="text-base font-semibold text-[#000000]">
                {profile?.firstName} {profile?.lastName}
              </DialogTitle>
              <span className="text-sm font-medium text-[#000000]">
                {profile?.username}
              </span>
            </div>
          </div>
          <DialogClose asChild>
            <button
              className="rounded-full focus:outline-none p-0"
              aria-label="Close"
            >
              <Image src="/plus.svg" alt="plus icon" width={32} height={32} />
            </button>
          </DialogClose>
        </DialogHeader>

        <Textarea
          className="mt-3 text-base text-gray-800 border-0 p-0 resize-none h-[180px]"
          value={content}
          placeholder="Write your thoughts..."
          onChange={handleChange}
        />
        <DialogFooter className="flex flex-col gap-3 mt-4">
          <Button
            className="bg-[#0A5DBC] text-white hover:text-white rounded-[15px] text-sm font-medium h-[34px] hover:bg-[#053875] transition-colors duration-300"
            onClick={() => onUpdateClick()}
          >
            Update Comment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateCommentModal;

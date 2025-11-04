'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Textarea } from 'src/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'src/components/ui/dropdown-menu';
import PostComposerModal from './PostComposerModal';
import { useProfileStore } from 'src/store/profile.store';
import { Profile } from 'src/types/profile.types';
import { FileUploadPayload } from 'src/types/uploads.types';

type Props = {
  spaces: string[];
  selectedSpace: string;
  setSelectedSpace: (s: string) => void;
  handlePost: (content: string, urls?: FileUploadPayload[]) => void;
};

export default function FeedComposer({
  spaces,
  selectedSpace,
  setSelectedSpace,
  handlePost,
}: Props) {
  const [content, setContent] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const { profile } = useProfileStore();
  const [source, setSource] = useState<string | null>(null);

  return (
    <>
      <div className="flex items-center gap-3 mt-[30px] mb-7">
        {profile?.profilePicture && (
          <Image
            src={profile?.profilePicture}
            alt="profile icon"
            width={44}
            height={44}
            className="rounded-xl h-[44] object-cover"
          />
        )}

        <div className="flex-1">
          <div
            className="rounded-[20px] border border-[#ECECEC] p-5  bg-white cursor-pointer"
            onClick={() => {
              setOpenModal(true);
              setSource('createPost');
            }}
          >
            <textarea
              value={content}
              readOnly
              rows={1}
              placeholder="Write your thoughts..."
              className="w-full border-0 p-0 resize-none"
            />
          </div>
        </div>
      </div>
      <PostComposerModal
        open={openModal}
        source={source}
        onOpenChange={setOpenModal}
        handlePost={handlePost}
        spaces={spaces}
        selectedSpace={selectedSpace}
        setSelectedSpace={setSelectedSpace}
      />
    </>
  );
}

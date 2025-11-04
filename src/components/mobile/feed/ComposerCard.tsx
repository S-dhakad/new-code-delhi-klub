'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from 'src/components/ui/input';
import { useProfileStore } from 'src/store/profile.store';
import { FileUploadPayload } from 'src/types/uploads.types';

interface ComposerCardProps {
  onPost?: (content: string, urls?: FileUploadPayload[]) => Promise<boolean>;
  selectedSpace?: string;
  onOpenCreate?: () => void;
}

export default function ComposerCard({
  onPost,
  selectedSpace,
  onOpenCreate,
}: ComposerCardProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useProfileStore();

  const handleSubmit = async () => {
    if (!content.trim() || !onPost || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const success = await onPost(content);
      if (success) {
        setContent('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      // Delegate composing to the full-screen CreatePostCard
      onOpenCreate?.();
    }
  };

  return (
    <section className="px-4 py-[30px] bg-[#F6F6F6]">
      <form onSubmit={handleFormSubmit} className="flex gap-3">
        <Image
          src={profile?.profilePicture || '/profile.jpg'}
          alt="avatar"
          width={44}
          height={44}
          className="w-11 h-11 rounded-[10px] object-cover"
        />
        <Input
          value={content}
          readOnly
          onClick={() => onOpenCreate?.()}
          onFocus={() => onOpenCreate?.()}
          onKeyDown={handleKeyDown}
          placeholder="Write your thoughts..."
          disabled={isSubmitting || !selectedSpace}
          className="rounded-[10px] h-auto bg-white text-sm font-medium text-text-secondary disabled:opacity-50 cursor-text"
        />
      </form>
    </section>
  );
}

'use client';

import { ChevronDown, Link2, Video, Image as ImageIcon, X } from 'lucide-react';
import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Button from '../common/ui/Button';
import FileUploader, { MediaItem } from 'src/components/FileUploader';
import { useProfileStore } from 'src/store/profile.store';
import { FileUploadPayload } from 'src/types/uploads.types';
import { Post } from 'src/types/post.types';

type Props = {
  post: Post;
  spaces?: string[];
  selectedSpace?: string;
  onClose: () => void;
  onUpdate?: (
    postId: string,
    content: string,
    urls?: FileUploadPayload[],
  ) => void;
  setSelectedSpace?: (space: string) => void;
};

const EditPostCard = ({
  post,
  spaces = ['General'],
  selectedSpace = 'General',
  onClose,
  onUpdate,
  setSelectedSpace,
}: Props) => {
  const { profile } = useProfileStore();
  const [content, setContent] = useState(post.content || '');
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSpaceDropdown, setShowSpaceDropdown] = useState(false);

  // Initialize media from existing post URLs
  useEffect(() => {
    if (post.urls && post.urls.length > 0) {
      const existingMedia: MediaItem[] = post.urls.map((urlItem, index) => {
        const type = urlItem.mimetype.startsWith('image/')
          ? 'image'
          : urlItem.mimetype.startsWith('video/')
            ? 'video'
            : 'pdf';

        return {
          id: `existing-${index}`,
          name: `media-${index}`,
          type,
          url: urlItem.url,
          isObjectURL: false,
          s3Data: {
            fileKey: urlItem.url,
            mimetype: urlItem.mimetype,
            size: 0,
          },
        };
      });
      setMedia(existingMedia);
    }
  }, [post.urls]);

  const handleFilesAdded = useCallback((files: File[], items: MediaItem[]) => {
    setMedia((prev) => [...prev, ...items]);
  }, []);

  const removeMedia = useCallback((id: string) => {
    setMedia((prev) => {
      const found = prev.find((m) => m.id === id);
      if (found?.isObjectURL) {
        try {
          URL.revokeObjectURL(found.url);
        } catch {}
      }
      return prev.filter((m) => m.id !== id);
    });
  }, []);

  useEffect(() => {
    return () => {
      media.forEach((m) => {
        if (m.isObjectURL) {
          try {
            URL.revokeObjectURL(m.url);
          } catch {}
        }
      });
    };
  }, [media]);

  const handleUpdate = async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const urls: FileUploadPayload[] = media
        .map((m) =>
          m.s3Data
            ? {
                key: m.s3Data.fileKey,
                mimetype: m.s3Data.mimetype,
                size: m.s3Data.size,
              }
            : undefined,
        )
        .filter((v): v is FileUploadPayload => Boolean(v));

      await onUpdate?.(post.id, content, urls.length ? urls : undefined);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <header className="px-4 py-3 flex justify-between items-center border-b">
        <button
          onClick={onClose}
          className="h-11 w-11 bg-white rounded-[10px] flex items-center justify-center"
        >
          <X className="text-text-secondary h-5 w-5" />
        </button>
        <Button
          size="sm"
          onClick={handleUpdate}
          disabled={isUpdating || !content.trim()}
          className="rounded-full h-9 min-w-[60px]"
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </Button>
      </header>

      <div className="px-5 py-7 bg-white">
        {/* Profile Section */}
        <div className="flex items-start gap-2.5">
          <Image
            src={profile?.profilePicture || '/feedImage.jpg'}
            alt="profile"
            width={44}
            height={44}
            className="rounded-[10px] object-cover aspect-square"
          />
          <div className="flex flex-col">
            <div className="text-base font-semibold">
              {profile?.firstName} {profile?.lastName}
            </div>
            <div className="text-sm font-medium">{profile?.username}</div>
          </div>
        </div>

        {/* Content Input */}
        <div className="mt-5">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts..."
            className="p-0 w-full text-base font-medium text-black placeholder:text-text-secondary border-0 outline-none resize-none min-h-[150px] bg-transparent"
          />
        </div>

        {/* Media Preview */}
        {media.length > 0 && (
          <div className="mt-4 flex gap-3">
            {media.map((m) => (
              <div
                key={m.id}
                className="relative w-[155px] h-[94px] rounded-[10px]"
              >
                {m.type === 'image' ? (
                  <Image
                    src={m.url}
                    alt={m.name}
                    fill
                    className="object-cover w-full h-full rounded-[10px]"
                  />
                ) : m.type === 'video' ? (
                  <div className="relative w-full h-full">
                    <video
                      src={m.url}
                      className="object-cover w-full h-full rounded-[10px]"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Video className="w-6 h-6 text-black" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center rounded-[10px] bg-white border border-[#ECECEC]">
                    <Image
                      src="/pdfIcon.svg"
                      alt="pdf"
                      width={32}
                      height={32}
                    />
                  </div>
                )}

                <button
                  className="absolute top-[-8px] right-[-8px] w-[22px] h-[22px] bg-[#DE0000] rounded-full flex items-center justify-center"
                  type="button"
                  aria-label={`remove ${m.type}`}
                  onClick={() => removeMedia(m.id)}
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Seperator */}
        <div className="h-[1px] border my-5"></div>

        {/* Bottom Toolbar */}
        <div className="bg-white">
          <div className="flex items-center justify-between">
            {/* Left side - Upload buttons */}
            <div className="flex items-center gap-3">
              {/* Link/PDF uploader */}
              <FileUploader
                accept="application/pdf"
                multiple={false}
                onFilesAdded={handleFilesAdded}
                onError={(msg) => console.warn(msg)}
              >
                {(open) => (
                  <button
                    type="button"
                    onClick={open}
                    aria-label="attach pdf"
                    className="w-[30px] h-[30px] flex items-center justify-center"
                  >
                    <Link2 className="w-5 h-5 text-text-secondary" />
                  </button>
                )}
              </FileUploader>

              {/* Video uploader */}
              <FileUploader
                accept="video/*"
                multiple={false}
                onFilesAdded={handleFilesAdded}
                onError={(msg) => console.warn(msg)}
              >
                {(open) => (
                  <button
                    type="button"
                    onClick={open}
                    aria-label="add video"
                    className="w-[30px] h-[30px] flex items-center justify-center"
                  >
                    <Video className="w-5 h-5 text-text-secondary" />
                  </button>
                )}
              </FileUploader>

              {/* Image uploader */}
              <FileUploader
                accept="image/*"
                multiple={true}
                onFilesAdded={handleFilesAdded}
                onError={(msg) => console.warn(msg)}
              >
                {(open) => (
                  <button
                    type="button"
                    onClick={open}
                    aria-label="add image"
                    className="w-[30px] h-[30px] flex items-center justify-center"
                  >
                    <ImageIcon className="w-5 h-5 text-text-secondary" />
                  </button>
                )}
              </FileUploader>
            </div>

            {/* Right side - Space selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpaceDropdown(!showSpaceDropdown)}
                className="flex items-center gap-1 text-sm"
              >
                <span className="font-normal text-black">Posting in:</span>
                <span className="font-semibold text-black">
                  {selectedSpace}
                </span>
                <ChevronDown className="w-4 h-4 text-black" />
              </button>

              {/* Dropdown */}
              {showSpaceDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSpaceDropdown(false)}
                  />
                  <div className="absolute bottom-full right-0 mb-2 bg-white rounded-[20px] shadow-lg border py-2 min-w-[160px] z-20">
                    {spaces.map((space) => (
                      <button
                        key={space}
                        onClick={() => {
                          setSelectedSpace?.(space);
                          setShowSpaceDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${
                          space === selectedSpace
                            ? 'text-primary font-semibold'
                            : 'text-gray-700 font-normal'
                        }`}
                      >
                        {space}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostCard;

'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from 'src/components/ui/dialog';
import { Button } from 'src/components/ui/button';
import { Textarea } from '../ui/textarea';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from 'src/components/ui/dropdown-menu';
import FileUploader, { MediaItem } from 'src/components/FileUploader';
import { useProfileStore } from 'src/store/profile.store';
import { Post } from 'src/types/post.types';
import { FileUploadPayload } from 'src/types/uploads.types';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

type Props = {
  spaces: string[];
  selectedSpace: string;
  open: boolean;
  source: string | null;
  post?: Post;
  onOpenChange: (open: boolean) => void;
  handlePost?: (content: string, urls?: FileUploadPayload[]) => void;
  handleUpdatePost?: (postId: string, content: string) => void;
  setSelectedSpace: (s: string) => void;
};

export default function PostComposerModal({
  spaces,
  selectedSpace,
  open,
  source,
  post,
  onOpenChange,
  handlePost,
  handleUpdatePost,
  setSelectedSpace,
}: Props) {
  const { profile } = useProfileStore();
  const [content, setContent] = React.useState<string>(post?.content ?? '');
  const [isPosting, setIsPosting] = React.useState(false);
  const [media, setMedia] = React.useState<MediaItem[]>([]);
  const showToast = useToastStore((s) => s.showToast);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setContent(e.target.value);
    },
    [],
  );

  const handleFilesAdded = React.useCallback(
    (files: File[], items: MediaItem[]) => {
      setMedia((prev) => [...prev, ...items]);
    },
    [],
  );

  const removeMedia = React.useCallback((id: string) => {
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

  React.useEffect(() => {
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

  useEffect(() => {
    setContent(post?.content ?? '');
  }, [post?.content]);

  const onPostClick = React.useCallback(async () => {
    if (isPosting) return;
    setIsPosting(true);
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

      await handlePost?.(content, urls.length ? urls : undefined);
      showToast({
        type: 'default-success',
        title: 'Post created successfully',
      });
      setContent('');
      setMedia([]);
      onOpenChange(false);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to post',
        message,
      });
    } finally {
      setIsPosting(false);
    }
  }, [content, handlePost, isPosting, media, onOpenChange]);

  const onUpdateClick = React.useCallback(async () => {
    if (isPosting || !post) return;
    setIsPosting(true);
    try {
      await handleUpdatePost?.(post.id, content);
      onOpenChange(false);
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Error occurred in updating post.',
        message,
      });
    } finally {
      setIsPosting(false);
    }
  }, [content, handleUpdatePost, isPosting, onOpenChange]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-xl rounded-[20px] p-[20px]"
        showCloseButton={false}
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-start justify-between">
          <div className="flex gap-2 flex-row">
            {profile?.profilePicture && (
              <Image
                src={`${profile.profilePicture}`}
                alt="profile photo"
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
          className="mt-3 text-base text-[#000000] border-0 p-0 resize-none h-[180px]"
          value={content}
          placeholder="Write your thoughts..."
          onChange={handleChange}
        />

        <div className="mt-3 flex gap-3 flex-wrap">
          {media.map((m) => (
            <div
              key={m.id}
              className="relative w-[155px] h-[94px] rounded-[10px]"
            >
              {m.type === 'image' ? (
                m.isObjectURL ? (
                  <Image
                    src={m.url}
                    alt={m.name}
                    fill
                    className="object-cover w-full h-full rounded-[10px]"
                  />
                ) : (
                  <Image
                    src={m.url}
                    alt={m.name}
                    fill
                    className="object-cover w-full h-full rounded-[10px]"
                  />
                )
              ) : m.type === 'video' ? (
                m.isObjectURL ? (
                  <video
                    src={m.url}
                    className="object-cover w-full h-full rounded-[10px]"
                    controls
                  />
                ) : (
                  <Image
                    src={m.url}
                    alt={m.name}
                    fill
                    className="object-cover w-full h-full rounded-[10px]"
                  />
                )
              ) : (
                <div className="w-full h-full flex items-center justify-center rounded-[10px] bg-white border border-[#ECECEC]">
                  <Image src="/pdfIcon.svg" alt="pdf" width={32} height={32} />
                </div>
              )}

              <button
                className="absolute top-[-11px] right-[-11px]"
                type="button"
                aria-label={`remove ${m.type}`}
                onClick={() => removeMedia(m.id)}
              >
                <Image
                  src="/crossRed.svg"
                  alt="cross icon"
                  width={22}
                  height={22}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-col gap-3 mt-4">
          <div className="flex items-center justify-between pt-5 w-full border-t-[#ECECEC] border-t">
            <div className="flex items-center gap-3 text-gray-500">
              {/* PDF uploader (renders your identical button) */}
              <FileUploader
                accept="application/pdf"
                multiple={false}
                onFilesAdded={handleFilesAdded}
                onError={(msg) => console.warn(msg)}
              >
                {(open) => (
                  <span>
                    <button
                      type="button"
                      onClick={open}
                      aria-label="attach pdf"
                    >
                      <Image
                        src="/attachment.svg"
                        alt="attach"
                        width={30}
                        height={30}
                      />
                    </button>
                  </span>
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
                  <span>
                    <button type="button" onClick={open} aria-label="add video">
                      <Image
                        src="/video.svg"
                        alt="video"
                        width={30}
                        height={30}
                      />
                    </button>
                  </span>
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
                  <span>
                    <button type="button" onClick={open} aria-label="add image">
                      <Image
                        src="/gallery.svg"
                        alt="gallery"
                        width={30}
                        height={30}
                      />
                    </button>
                  </span>
                )}
              </FileUploader>
            </div>

            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="text-sm font-normal text-[#000000] flex items-center gap-1"
                    aria-haspopup="menu"
                  >
                    Posting in:
                    <span className="ml-1 text-sm font-medium text-[#000000]">
                      {selectedSpace.replace('# ', '# ')}
                    </span>
                    <Image
                      src="/downArrow.svg"
                      alt="arrow"
                      width={16}
                      height={16}
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-44 p-0 rounded-[20px]">
                  <div className="bg-white rounded-lg px-2 py-3">
                    {spaces.map((s) => (
                      <DropdownMenuItem
                        key={s}
                        onClick={() => setSelectedSpace(s)}
                        className={`px-3 py-2 text-sm cursor-pointer ${s === selectedSpace ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}
                      >
                        <span className="mr-2 text-gray-400 select-none">
                          #
                        </span>
                        <span>{s.replace('# ', '')}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              {source === 'updatePost' ? (
                <Button
                  className="bg-[#0A5DBC] text-white hover:text-white rounded-[15px] text-sm font-medium h-[34px] hover:bg-[#053875] transition-colors duration-300"
                  onClick={onUpdateClick}
                  disabled={isPosting}
                >
                  {isPosting ? 'Updating...' : 'Update'}
                </Button>
              ) : (
                <Button
                  className="bg-[#0A5DBC] text-white hover:text-white rounded-[15px] text-sm font-medium h-[34px] hover:bg-[#053875] transition-colors duration-300"
                  onClick={onPostClick}
                  disabled={isPosting}
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

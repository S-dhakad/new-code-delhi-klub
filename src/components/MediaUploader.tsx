'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';

type BannerType = {
  url: string;
  type: 'image' | 'video';
  name?: string;
  isObjectURL?: boolean;
};

interface MediaUploaderProps {
  banner: BannerType | null;
  onFilesAdded: (files: FileList | null) => void;
  onRemove: () => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  banner,
  onFilesAdded,
  onRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    onFilesAdded(files);

    // Reset the input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    // Revoke object URL to avoid memory leaks
    if (banner?.isObjectURL) {
      URL.revokeObjectURL(banner.url);
    }
    onRemove();

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Hidden File Input - Using native input to avoid controlled component issues */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Section - Only show when no banner exists */}
      {!banner && (
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="cursor-pointer border border-[#ECECEC] p-[10px] bg-[#FFFFFF] text-[#000000] rounded-[10px] text-sm font-medium hover:bg-[#FFFFFF] h-10 max-w-max"
            onClick={handleUploadClick}
          >
            + Upload new
          </button>
          <p className="text-xs font-medium text-[#787878]">
            JPG, PNG or video
          </p>
        </div>
      )}

      {/* Preview Section - Only show when banner exists */}
      {banner && (
        <div className="flex-1 w-full">
          <div className="flex flex-col md:flex-col md:items-start items-start lg:flex-row lg:items-center gap-4">
            {/* Preview */}
            <div className="relative rounded-[20px] w-full lg:w-[235px] h-[190px] flex-shrink-0">
              {banner.type === 'video' ? (
                banner.isObjectURL ? (
                  <video
                    src={banner.url}
                    className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                    controls
                  />
                ) : (
                  <div className="relative w-full h-full rounded-[20px] bg-[#F6F6F6]">
                    <Image
                      src={banner.url}
                      alt="Banner video thumbnail"
                      fill
                      className="object-cover rounded-[20px]"
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow">
                        <Image
                          src="/playIcon.svg"
                          alt="play icon"
                          width={28}
                          height={28}
                        />
                      </div>
                    </div>
                  </div>
                )
              ) : (
                <Image
                  src={banner.url}
                  alt={banner.name || 'Banner image'}
                  fill
                  className="object-cover rounded-[20px] bg-[#F6F6F6]"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="w-full">
              <div className="flex gap-2">
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2 rounded-[10px] border border-[#ECECEC] bg-transparent font-medium text-sm text-[#000000] h-[34px] flex items-center justify-center text-nowrap"
                  onClick={handleUploadClick}
                >
                  + Upload new
                </button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="px-4 py-2 rounded-[10px] text-[#DE0000] border border-[#ECECEC] bg-transparent font-medium text-sm h-[34px]"
                  onClick={handleRemove}
                >
                  Remove
                </Button>
              </div>
              <div className="text-xs text-[#787878] font-medium mt-2">
                JPG, PNG or video
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;

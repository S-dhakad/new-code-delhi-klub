'use client';

import React from 'react';
import awsS3Api from '../axios/aws-s3/awsS3Api';

export type MediaType = 'image' | 'video' | 'pdf';

export type MediaItem = {
  id: string;
  type: MediaType;
  file?: File | null;
  url: string; // object URL for uploads or static url for dummy items
  name: string;
  isObjectURL?: boolean;
  s3Data?: {
    fileKey: string;
    size: number;
    mimetype: string;
  };
};

type Props = {
  accept: string; // e.g. "image/*" | "video/*" | "application/pdf"
  multiple?: boolean;
  maxFiles?: number;
  onFilesAdded?: (files: File[], mediaItems: MediaItem[]) => void;
  onError?: (message: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  children?: (open: () => void) => React.ReactNode; // render-prop trigger
};

export default function FileUploader({
  accept,
  multiple = false,
  maxFiles,
  onFilesAdded,
  onError,
  onUploadStart,
  onUploadEnd,
  children,
}: Props) {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const open = React.useCallback(async () => {
    try {
      await awsS3Api.generateUploadUrl();
    } catch {}
    inputRef.current?.click();
  }, []);

  const getTypeFromFile = (file: File): MediaType | null => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type === 'application/pdf') return 'pdf';
    return null;
  };

  const handleChange = React.useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const list = e.target.files;
      if (!list || list.length === 0) return;

      const files = Array.from(list);

      if (typeof maxFiles === 'number' && files.length > maxFiles) {
        onError?.(`Select up to ${maxFiles} file(s).`);
        if (e.currentTarget) {
          e.currentTarget.value = '';
        }
        return;
      }

      const mediaItems: MediaItem[] = [];
      onUploadStart?.();

      for (const f of files) {
        const type = getTypeFromFile(f);
        if (!type) {
          onError?.(`Unsupported file type: ${f.type}`);
          continue;
        }

        // defensive checks vs accept string
        if (!accept.includes('image') && type === 'image') {
          onError?.('Image files not accepted here.');
          continue;
        }
        if (!accept.includes('video') && type === 'video') {
          onError?.('Video files not accepted here.');
          continue;
        }
        if (
          !accept.includes('pdf') &&
          type === 'pdf' &&
          !accept.includes('application/pdf')
        ) {
          onError?.('PDF files not accepted here.');
          continue;
        }

        try {
          const uploaded = await awsS3Api.uploadFile(f);
          const objectUrl = URL.createObjectURL(f);
          mediaItems.push({
            id: uploaded.fileKey,
            type,
            file: f,
            url: objectUrl,
            name: f.name,
            isObjectURL: true,
            s3Data: {
              fileKey: uploaded.fileKey,
              size: uploaded.size,
              mimetype: uploaded.mimetype,
            },
          });
        } catch {
          onError?.('Failed to upload to S3');
        }
      }

      if (mediaItems.length > 0) onFilesAdded?.(files, mediaItems);
      onUploadEnd?.();

      // Clear the input value safely
      if (e.currentTarget) {
        e.currentTarget.value = '';
      }
    },
    [accept, maxFiles, onFilesAdded, onError, onUploadStart, onUploadEnd],
  );

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
      {children ? (
        children(open)
      ) : (
        <button type="button" onClick={open}>
          Upload
        </button>
      )}
    </>
  );
}

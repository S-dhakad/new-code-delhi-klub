'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import FileUploader, { MediaItem } from 'src/components/FileUploader';
import { FileUploadPayload } from 'src/types/uploads.types';

type Chapter = {
  id: string;
  name: string;
  media: string[];
  videoEmbedUrl: string;
  mediaData?: FileUploadPayload[];
};

type ChapterBlockProps = {
  chapter: Chapter;
  index: number;
  onRemove: (id: string) => void;
  onNameChange?: (chapterId: string, name: string) => void;
  onMediaChange?: (
    chapterId: string,
    media: string[],
    mediaData: FileUploadPayload[],
  ) => void;
  onEmbedUrlChange?: (chapterId: string, embedUrl: string) => void;
};

export default function ChapterBlock({
  chapter,
  index,
  onRemove,
  onNameChange,
  onMediaChange,
  onEmbedUrlChange,
}: ChapterBlockProps) {
  const [showDetails, setShowDetails] = useState(true); // toggle state
  const [mode, setMode] = useState<'upload' | 'embed' | null>('upload');
  const [embedUrl, setEmbedUrl] = useState(chapter.videoEmbedUrl || '');
  const [savedEmbedUrl, setSavedEmbedUrl] = useState(
    chapter.videoEmbedUrl || '',
  );

  // Media state with S3 data (includes embed URL if saved)
  const [mediaList, setMediaList] = useState<string[]>(() => {
    const media = [...chapter.media];
    // Add embed URL to media list if it exists
    if (chapter.videoEmbedUrl && chapter.videoEmbedUrl.trim()) {
      media.push(chapter.videoEmbedUrl);
    }
    return media;
  });
  const [mediaDataList, setMediaDataList] = useState<FileUploadPayload[]>(
    () => [...(chapter.mediaData || [])],
  );

  const objectUrlsRef = useRef<Set<string>>(new Set());

  // Helper to check if URL is an embed URL (YouTube/Loom)
  const isEmbedUrl = (url: string): boolean => {
    return (
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('loom.com')
    );
  };

  // Convert YouTube URL to embed format
  const getYouTubeEmbedUrl = (url: string): string | null => {
    if (!url) return null;

    // Handle youtube.com/watch?v=VIDEO_ID
    const youtubeRegex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(youtubeRegex);

    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }

    // If already an embed URL, return as is
    if (url.includes('youtube.com/embed/')) {
      return url;
    }

    return null;
  };

  const removeMedia = (indexToRemove: number) => {
    setMediaList((prev) => {
      const url = prev[indexToRemove];

      // If removing the saved embed URL
      if (url === savedEmbedUrl) {
        setSavedEmbedUrl('');
        setEmbedUrl('');
        if (onEmbedUrlChange) {
          onEmbedUrlChange(chapter.id, '');
        }
      }

      if (url && objectUrlsRef.current.has(url)) {
        try {
          URL.revokeObjectURL(url);
        } catch {}
        objectUrlsRef.current.delete(url);
      }
      const nextDisplayList = prev.filter((_, i) => i !== indexToRemove);

      // Notify parent with a media list that excludes temporary blob URLs
      if (onMediaChange) {
        setTimeout(() => {
          const parentMedia = nextDisplayList.filter(
            (m) => !m.startsWith('blob:'),
          );
          onMediaChange(chapter.id, parentMedia, mediaDataList);
        }, 0);
      }

      return nextDisplayList;
    });

    // Do not modify mediaDataList when removing previews or embed URLs
    setMediaDataList((prevData) => prevData);
  };

  // File upload handler
  const handleVideoFilesAdded = (files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;

    const newMediaUrls: string[] = [];
    const newMediaData: FileUploadPayload[] = [];

    const newPreviewBlobs: string[] = [];

    items.forEach((item) => {
      if (item?.url && item.url.startsWith('blob:')) {
        newPreviewBlobs.push(item.url);
        objectUrlsRef.current.add(item.url);
      }
      if (item?.s3Data?.fileKey) {
        newMediaUrls.push(item.s3Data.fileKey);
        newMediaData.push({
          key: item.s3Data.fileKey,
          mimetype: item.s3Data.mimetype,
          size: item.s3Data.size,
        });
      }
    });

    setMediaList((prev) => {
      // Display list: include existing items plus new blob previews for UI
      const updatedDisplay = [...prev, ...newPreviewBlobs];

      // Notify parent with only persistent media keys (and any existing non-blob entries like embeds)
      if (onMediaChange) {
        setTimeout(() => {
          const prevNonBlob = prev.filter((m) => !m.startsWith('blob:'));
          const parentMedia = [...prevNonBlob, ...newMediaUrls];
          onMediaChange(chapter.id, parentMedia, [
            ...mediaDataList,
            ...newMediaData,
          ]);
        }, 0);
      }

      return updatedDisplay;
    });

    setMediaDataList((prev) => [...prev, ...newMediaData]);
  };

  useEffect(() => {
    const urls = objectUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      });
      urls.clear();
    };
  }, []);

  return (
    <div className="border border-[#ECECEC] rounded-[20px] py-[30px] px-[20px] bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Toggle button */}
          <Button
            className="px-3 rounded-[10px] bg-[#F6F6F6] h-10 flex items-center justify-center"
            onClick={() => setShowDetails((prev) => !prev)}
            aria-label={`Toggle chapter ${index + 1} details`}
          >
            <Image src="/menu.svg" alt="menu icon" width={16} height={16} />
          </Button>

          <div className="px-4 rounded-[10px] bg-[#F6F6F6] text-base font-medium text-[#000000] h-10 flex items-center justify-center">
            Chapter {index + 1}
          </div>
        </div>

        <div className="ml-auto">
          <button
            className="p-2 rounded-xl bg-[#F6F6F6] w-10 h-10 flex items-center justify-center"
            title="Remove chapter"
            onClick={() => onRemove(chapter.id)}
          >
            <Image src="/delete.svg" alt="delete icon" width={16} height={16} />
          </button>
        </div>
      </div>

      {/* Details section - shown/hidden */}
      {showDetails && (
        <div className="mt-6 flex flex-col lg:flex-row gap-4 lg:gap-20">
          <div className="flex-1 text-sm text-gray-600 space-y-5">
            <div>
              <div className="text-base font-semibold text-[#000000]">
                Add a Chapter
              </div>
              <div className="text-sm font-medium text-gray-400 mt-1">
                Add all your content & videos here
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[495px] space-y-5">
            <div>
              <div className="text-sm font-medium text-[#787878] mb-2">
                Chapter name
              </div>
              <Input
                value={chapter.name}
                onChange={(e) =>
                  onNameChange
                    ? onNameChange(chapter.id, e.target.value)
                    : undefined
                }
                className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
              />
            </div>

            <div>
              <div className="text-sm font-medium text-[#787878] mb-[14px]">
                Upload Videos
              </div>
              <div className="flex gap-3 items-center flex-wrap">
                {mediaList
                  .filter((m) => m && m.trim() !== '' && m !== '')
                  .map((m, i) => (
                    <div
                      key={i}
                      className="relative w-[128px] h-[104px] rounded-[20px] overflow-hidden flex-shrink-0"
                    >
                      {/* Check if it's an embed URL (YouTube/Loom) */}
                      {isEmbedUrl(m) ? (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex flex-col items-center justify-center">
                          <Image
                            src="/playIconBlue.svg"
                            alt="embed icon"
                            width={32}
                            height={32}
                            className="mb-2 brightness-0 invert"
                          />
                          <span className="text-white text-xs font-semibold">
                            Embed URL
                          </span>
                        </div>
                      ) : /\.(jpe?g|png|webp|gif)$/i.test(m) ? (
                        <Image
                          src={m || '/cardImage1.jpg'}
                          alt={`cardImage${i}`}
                          width={128}
                          height={104}
                          className="w-full h-full object-cover"
                        />
                      ) : m.startsWith('blob:') && m ? (
                        // uploaded video preview — use video element
                        <video
                          src={m}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                        />
                      ) : (
                        // fallback: try to render as image (static video poster) using next/image
                        <Image
                          src={m || '/cardImage1.jpg'}
                          alt={`cardImage${i}`}
                          width={128}
                          height={104}
                          className="w-full h-full object-cover"
                        />
                      )}

                      <div className="absolute right-4 bottom-2">
                        {/* DELETE BUTTON: removes the item from mediaList */}
                        <button
                          onClick={() => removeMedia(i)}
                          aria-label="Remove media"
                          className="w-6 h-6"
                        >
                          <Image
                            src="/deleteIcon.svg"
                            alt="delete icon"
                            width={26}
                            height={26}
                          />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              {/* Tabs */}
              <div className="w-full lg:w-[334px] space-y-5 mt-4">
                <div className="inline-flex rounded-[20px] bg-[#F6F6F6] p-2">
                  <button
                    type="button"
                    className={`px-[18px] py-2 rounded-[15px] flex gap-2 items-center  text-sm font-medium ${
                      mode === 'upload'
                        ? 'bg-white text-[#000000]'
                        : 'text-[#787878]'
                    }`}
                    onClick={() =>
                      setMode((prev) => (prev === 'upload' ? null : 'upload'))
                    }
                    aria-pressed={mode === 'upload'}
                  >
                    <Image
                      src="/document-upload.svg"
                      alt="attachment icon"
                      width={16}
                      height={16}
                    />
                    Upload video
                  </button>

                  <button
                    type="button"
                    className={`px-[18px] py-2 rounded-[15px] flex gap-2 items-center  text-sm font-medium ${
                      mode === 'embed'
                        ? 'bg-white text-[#000000]'
                        : 'text-[#787878]'
                    }`}
                    onClick={() =>
                      setMode((prev) => (prev === 'embed' ? null : 'embed'))
                    }
                    aria-pressed={mode === 'embed'}
                  >
                    <Image
                      src="/attachment 2.svg"
                      alt="attachment icon"
                      width={16}
                      height={16}
                    />
                    Embed URL
                  </button>
                </div>

                {/* upload tab content */}
                {mode === 'upload' && (
                  <FileUploader
                    accept="video/*"
                    multiple={true}
                    onFilesAdded={handleVideoFilesAdded}
                    onError={(msg) => console.warn(msg)}
                  >
                    {(open) => (
                      <div
                        className="border border-[#ECECEC] p-4 flex items-center  justify-center gap-3 rounded-[20px] cursor-pointer"
                        onClick={open}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') open();
                        }}
                      >
                        <Image
                          src="/document-upload.svg"
                          alt="attachment icon"
                          width={16}
                          height={16}
                        />
                        <div>
                          <h4 className="text-sm font-medium text-[#000000]">
                            Upload video
                          </h4>
                          <p className="text-xs font-medium text-[#787878]">
                            MP4 or MOV upto 0.5 GB max
                          </p>
                        </div>
                      </div>
                    )}
                  </FileUploader>
                )}

                {/* embed tab content */}
                {mode === 'embed' && (
                  <div className="space-y-5">
                    <div className="rounded-[20px] overflow-hidden">
                      <div className="w-full h-[176px] rounded-[20px]">
                        {embedUrl.trim() && getYouTubeEmbedUrl(embedUrl) ? (
                          <iframe
                            src={getYouTubeEmbedUrl(embedUrl) || ''}
                            className="w-full h-[176px] rounded-[20px]"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <Image
                            src="/feedVideoImage.jpg"
                            alt="video preview"
                            width={400}
                            height={176}
                            className="w-full h-[176px] object-cover rounded-[20px]"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <Input
                        value={embedUrl}
                        onChange={(e) => setEmbedUrl(e.target.value)}
                        placeholder="Enter YouTube or Loom embed URL"
                        className="flex-1 rounded-full px-4 py-2 border"
                      />

                      {/* Show URL as tag when pasted */}
                      {embedUrl.trim() && (
                        <div className="mt-3 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <Image
                            src="/playIconBlue.svg"
                            alt="video icon"
                            width={16}
                            height={16}
                          />
                          <span className="text-sm text-blue-700 font-medium truncate flex-1">
                            {embedUrl}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-end mt-4">
                        <Button
                          onClick={() => {
                            if (embedUrl.trim()) {
                              const trimmedUrl = embedUrl.trim();

                              // Check if this URL is already in the media list
                              if (mediaList.includes(trimmedUrl)) {
                                // Don't add duplicates
                                setEmbedUrl('');
                                return;
                              }

                              setSavedEmbedUrl(trimmedUrl);

                              // Add embed URL to media list (allow multiple URLs)
                              setMediaList((prev) => {
                                const updated = [...prev, trimmedUrl];

                                // Notify parent of changes
                                if (onMediaChange) {
                                  setTimeout(() => {
                                    onMediaChange(
                                      chapter.id,
                                      updated,
                                      mediaDataList,
                                    );
                                  }, 0);
                                }

                                return updated;
                              });

                              if (onEmbedUrlChange) {
                                onEmbedUrlChange(chapter.id, trimmedUrl);
                              }

                              // Clear the input box after saving
                              setEmbedUrl('');
                            }
                          }}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                    <div className="rounded-lg bg-gray-50 border p-4 text-sm text-gray-700">
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Embedded videos load faster</li>
                        <li>Only YouTube &amp; Loom embeds are supported</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

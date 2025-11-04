'use client';

import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Button } from 'src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import FileUploader, { MediaItem } from 'src/components/FileUploader';
import { FileUploadPayload } from 'src/types/uploads.types';
import AddCourseTagModal from './AddCourseTagModal';
import { TagFailureModal } from '../modals/TagFailureModal';
import AddPointsModal from './AddPointsModal';

interface CourseBasicDetailsProps {
  data: {
    title: string;
    bio: string;
    description: string;
    difficulty: string;
    duration: string;
    tags: string[];
    learnPoints: string[];
    thumbnail: string;
    banner: string;
    thumbnailData?: FileUploadPayload | null;
    bannerData?: FileUploadPayload | null;
  };
  onDataChange: (data: Partial<CourseBasicDetailsProps['data']>) => void;
}

export default function CourseBasicDetails({
  data,
  onDataChange,
}: CourseBasicDetailsProps) {
  const [title, setTitle] = useState(data.title);
  const [bio, setBio] = useState(data.bio);
  const [description, setDescription] = useState(data.description);
  const [difficulty, setDifficulty] = useState(data.difficulty);
  const [duration, setDuration] = useState(data.duration);
  const [tags, setTags] = useState(data.tags);
  const [learnPoints, setLearnPoints] = useState(data.learnPoints);
  const [showTagModal, setShowTagModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [showFailureModal, setShowFailureModal] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);

  // File upload state - using local object URLs for preview
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    data.thumbnail || null,
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    data.banner || null,
  );
  const [thumbnailData, setThumbnailData] = useState<FileUploadPayload | null>(
    data.thumbnailData || null,
  );
  const [bannerData, setBannerData] = useState<FileUploadPayload | null>(
    data.bannerData || null,
  );
  const [selectedThumbnailFile, setSelectedThumbnailFile] =
    useState<File | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null,
  );

  React.useEffect(() => {
    setTitle(data.title);
    setBio(data.bio);
    setDescription(data.description);
    setDifficulty(data.difficulty);
    setDuration(data.duration);
    setTags(data.tags);
    setLearnPoints(data.learnPoints);
    setThumbnailData(data.thumbnailData || null);
    setBannerData(data.bannerData || null);

    if (data.thumbnail && !data.thumbnail.startsWith('blob:')) {
      setThumbnailPreview(data.thumbnail);
    }
    if (data.banner && !data.banner.startsWith('blob:')) {
      setBannerPreview(data.banner);
    }
  }, [data]);

  React.useEffect(() => {
    onDataChange({
      title,
      bio,
      description,
      difficulty,
      duration,
      tags,
      learnPoints,
      thumbnail: thumbnailPreview || data.thumbnail,
      banner: bannerPreview || data.banner,
      thumbnailData,
      bannerData,
    });
  }, [
    title,
    bio,
    description,
    difficulty,
    duration,
    tags,
    learnPoints,
    thumbnailPreview,
    bannerPreview,
    thumbnailData,
    bannerData,
    onDataChange,
    data.thumbnail,
    data.banner,
  ]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
        URL.revokeObjectURL(thumbnailPreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, []);

  const handleThumbnailFilesAdded = (files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;
    const first = items[0];

    if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbnailPreview);
    }

    if (first.file) {
      const objectUrl = URL.createObjectURL(first.file);
      setThumbnailPreview(objectUrl);
      setSelectedThumbnailFile(first.file);
    } else if (first.url) {
      setThumbnailPreview(first.url);
      setSelectedThumbnailFile(null);
    }

    if (first.s3Data) {
      setThumbnailData({
        key: first.s3Data.fileKey,
        mimetype: first.s3Data.mimetype,
        size: first.s3Data.size,
      });
    }
  };

  const handleBannerFilesAdded = (files: File[], items: MediaItem[]) => {
    if (!items || items.length === 0) return;
    const first = items[0];

    if (bannerPreview && bannerPreview.startsWith('blob:')) {
      URL.revokeObjectURL(bannerPreview);
    }

    if (first.file) {
      const objectUrl = URL.createObjectURL(first.file);
      setBannerPreview(objectUrl);
      setSelectedBannerFile(first.file);
    } else if (first.url) {
      // Fallback to the URL from MediaItem if file object is not available
      setBannerPreview(first.url);
      setSelectedBannerFile(null);
    }

    if (first.s3Data) {
      setBannerData({
        key: first.s3Data.fileKey,
        mimetype: first.s3Data.mimetype,
        size: first.s3Data.size,
      });
    }
  };

  const handleRemoveThumbnail = () => {
    // Clean up blob URL if it exists
    if (thumbnailPreview && thumbnailPreview.startsWith('blob:')) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnailPreview(null);
    setSelectedThumbnailFile(null);
    setThumbnailData(null);
  };

  const handleRemoveBanner = () => {
    if (bannerPreview && bannerPreview.startsWith('blob:')) {
      URL.revokeObjectURL(bannerPreview);
    }
    setBannerPreview(null);
    setSelectedBannerFile(null);
    setBannerData(null);
  };

  const getThumbnailSrc = () => {
    return thumbnailPreview || data.thumbnail || '/dummyProfile.png';
  };

  const getBannerSrc = () => {
    return bannerPreview || data.banner || '/dummyVideoThumbnail.png';
  };

  const isBannerVideo = () => {
    const src = getBannerSrc();
    return src.startsWith('blob:')
      ? selectedBannerFile?.type.startsWith('video/')
      : src.includes('.mp4') || src.includes('.webm') || src.includes('.mov');
  };

  return (
    <>
      <Card className="rounded-[20px] py-0 border-0">
        <CardContent className="py-[30px] px-[40px]">
          <div className="space-y-6">
            {/* Course Title */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Course Title
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Display name for the course
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <div className="relative w-full">
                  <Image
                    src="/info-circle.svg"
                    alt="info"
                    width={16}
                    height={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pr-[40px]"
                    placeholder="Automation on Autopilot"
                  />
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="ftext-base font-semibold text-[#000000]">
                  Bio
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Single liner about the course
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <Input
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                  placeholder="Short one-liner"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Description
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Detailed overlook of the course
                </div>
              </div>

              <div className="w-full lg:w-[495px] relative">
                <Textarea
                  rows={10}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-[15px] pb-11 resize-none border-[#ECECEC] rounded-[15px] font-medium text-sm text-[#000000]"
                />
                <div className="text-right text-sm font-medium text-[#787878] mt-2 absolute right-4 bottom-4 bg-white">
                  {Math.min(description.length, 1500)}/1500
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Course Difficulty
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Choose level
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger
                    className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                    style={{ height: '40px' }}
                  >
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">
                      Beginner (no prior knowledge needed)
                    </SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Duration */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Course Duration
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  How long is the course?
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <Input
                  value={duration}
                  type="number"
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Tags
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Make it easier to look for your course (upto 3)
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <div className="flex flex-wrap gap-2 items-center border p-[15px] rounded-[20px] border-[#ECECEC]">
                  {tags.map((tag, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center gap-1 rounded-[10px] border border-[border-[#ECECEC] px-3 py-1 h-[34px] ${isEditing ? 'bg-white' : 'bg-[#F6F6F6]'}`}
                    >
                      <span className="text-[#0A5DBC]">#</span>
                      <input
                        value={tag}
                        readOnly={!isEditing}
                        className="bg-transparent border-none focus:outline-none text-sm font-medium text-[#000000] px-1"
                        style={{ width: `${tag.length}ch` }}
                      />
                      {isEditing && (
                        <Image
                          src="/cross.svg"
                          alt="remove"
                          width={12}
                          height={12}
                          className="cursor-pointer"
                          onClick={() => {
                            const newTags = tags.filter(
                              (_, index) => index !== idx,
                            );
                            setTags(newTags);
                          }}
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    className="rounded-[10px] border bg-[#0A5DBC] text-white text-sm font-medium px-3 py-1 w-1/2 lg:w-auto flex items-center h-[34px] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 hover:bg-[#053875]"
                    onClick={() => setShowTagModal(true)}
                    disabled={tags.length >= 3}
                  >
                    + Add new
                  </Button>
                  {tags.length > 0 && (
                    <Button
                      className="rounded-[10px] border border-[#ECECEC] bg-white text-sm font-medium text-[#000000] px-3 py-1 w-1/2 lg:w-auto h-[34px]"
                      onClick={() => setIsEditing((prev) => !prev)}
                    >
                      {isEditing ? 'Done' : 'Edit'}
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* What will subscribers learn */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  What will your subscribers learn?
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Shown under the What you will learn section
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <div className="space-y-3 border  border-[#ECECEC] p-[15px] rounded-[15px]">
                  {learnPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center bg-[#F6F6F6] rounded-[15px] border border-[#ECECEC] py-2 px-3 gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Image
                          src="/Check.svg"
                          alt="check"
                          width={18}
                          height={18}
                          className="flex-shrink-0"
                        />
                        <span className="text-sm font-medium text-[#000000] p-0">
                          {point}
                        </span>
                      </div>
                      <Image
                        src="/cross.svg"
                        alt="remove"
                        width={12}
                        height={12}
                        className="cursor-pointer"
                        onClick={() => {
                          const newPoints = learnPoints.filter(
                            (_, index) => index !== idx,
                          );
                          setLearnPoints(newPoints);
                        }}
                      />
                    </div>
                  ))}
                  <div>
                    <Button
                      className="rounded-[10px] border bg-[#0A5DBC] text-white text-sm font-semibold px-3 py-1 w-1/2 lg:w-auto flex items-center h-[34px] transition-colors duration-300 hover:bg-[#053875]"
                      onClick={() => setShowPointModal(true)}
                    >
                      + Add new
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Course Thumbnail
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  Your display picture
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <div className="flex flex-col md:flex-col md:items-center lg:flex-row items-center sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    <Image
                      src={getThumbnailSrc()}
                      alt="Course Thumbnail"
                      width={104}
                      height={104}
                      className="h-[104px] w-[104px] rounded-[20px] object-cover flex-shrink-0 bg-[#F6F6F6]"
                    />
                  </div>

                  <div className="w-full">
                    <div className="flex gap-2">
                      <FileUploader
                        accept="image/*"
                        multiple={false}
                        maxFiles={1}
                        onFilesAdded={handleThumbnailFilesAdded}
                        onError={(msg) => console.warn(msg)}
                      >
                        {(open) => (
                          <Button
                            size="sm"
                            className="px-4 py-2 rounded-[10px] border border-[#ECECEC] bg-transparent font-medium text-sm text-[#000000] h-[34px]"
                            onClick={open}
                          >
                            + Upload new
                          </Button>
                        )}
                      </FileUploader>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-4 py-2 rounded-[10px] text-[#DE0000] border border-[#ECECEC] bg-transparent font-medium text-sm h-[34px]"
                        onClick={handleRemoveThumbnail}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-xs text-[#787878] font-medium  mt-2">
                      <div>200 × 200 px size recommended</div>
                      <div>JPG or PNG</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner image/video */}
            <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-20">
              <div className="flex-1">
                <div className="text-base font-semibold text-[#000000]">
                  Banner image/video
                </div>
                <div className="text-sm font-medium text-[#787878]">
                  A brief intro to your course
                </div>
              </div>

              <div className="w-full lg:w-[495px]">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="relative rounded-xl w-full lg:w-[235px] h-[190px] flex-shrink-0">
                    {isBannerVideo() ? (
                      <video
                        src={getBannerSrc()}
                        className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                        controls
                      />
                    ) : (
                      <img
                        src={getBannerSrc()}
                        alt="Course Banner"
                        width={235}
                        height={190}
                        className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                      />
                    )}

                    {isBannerVideo() && (
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
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex gap-2">
                      <FileUploader
                        accept="image/*,video/*"
                        multiple={false}
                        maxFiles={1}
                        onFilesAdded={handleBannerFilesAdded}
                        onError={(msg) => console.warn(msg)}
                      >
                        {(open) => (
                          <Button
                            size="sm"
                            className="px-4 py-2 rounded-[10px] border border-[#ECECEC] bg-transparent font-medium text-sm text-[#000000] h-[34px]"
                            onClick={open}
                          >
                            + Upload new
                          </Button>
                        )}
                      </FileUploader>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-4 py-2 text-red-600 border bg-transparent"
                        onClick={handleRemoveBanner}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-xs mt-2">JPG, PNG or video</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <AddCourseTagModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        onSave={(newTag) => {
          if (tags.length < 3 && !tags.includes(newTag)) {
            setTags([...tags, newTag]);
          }
        }}
      />
      <AddPointsModal
        isOpen={showPointModal}
        onClose={() => setShowPointModal(false)}
        onSave={(newPoint) => {
          if (!learnPoints.includes(newPoint)) {
            setLearnPoints([...learnPoints, newPoint]);
          }
        }}
      />
      <TagFailureModal
        open={showFailureModal}
        setOpen={setShowFailureModal}
        title="Are you sure?"
        subTitle="This action cannot be undone"
        message="Deleting a space will delete all posts in it. You cannot recover it later"
        onOpenChange={(open) => {
          setShowFailureModal(open);
        }}
      />
    </>
  );
}

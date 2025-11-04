'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FileUploadPayload } from 'src/types/uploads.types';
import Button from 'src/components/mobile/common/ui/Button';
import Input, { TextArea } from 'src/components/mobile/common/ui/Input';
import FieldSection from 'src/components/mobile/create-course/FieldSection';
import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import FileUploader, { MediaItem } from 'src/components/FileUploader';
import AddCourseTagModal from 'src/components/courses/AddCourseTagModal';
import AddPointsModal from 'src/components/courses/AddPointsModal';
interface BasicDetailsData {
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
}

interface MobileCourseBasicDetailsProps {
  data: BasicDetailsData;
  onDataChange: (data: BasicDetailsData) => void;
  onNext: () => void;
  isLoading: boolean;
}

export default function MobileCourseBasicDetails({
  data,
  onDataChange,
  onNext,
  isLoading,
}: MobileCourseBasicDetailsProps) {
  const [showTagModal, setShowTagModal] = useState(false);
  const [showPointModal, setShowPointModal] = useState(false);
  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [bannerPreviewType, setBannerPreviewType] = useState<
    'image' | 'video' | null
  >(null);

  // Infer banner type from mimetype if available and not set yet
  React.useEffect(() => {
    const mime: string | undefined = data.bannerData?.mimetype;
    if (mime && !bannerPreviewType) {
      setBannerPreviewType(mime.startsWith('video') ? 'video' : 'image');
    }
  }, [data, bannerPreviewType]);

  const updateField = <K extends keyof BasicDetailsData>(
    field: K,
    value: BasicDetailsData[K],
  ) => {
    onDataChange({ ...data, [field]: value });
  };

  const addTag = (newTag: string) => {
    if (newTag?.trim()) {
      updateField('tags', [...(data.tags || []), newTag.trim()]);
    }
  };

  const removeTag = (index: number) => {
    const newTags = data.tags?.filter((_, i) => i !== index) || [];
    updateField('tags', newTags);
  };

  const addLearnPoint = (newPoint: string) => {
    if (newPoint?.trim()) {
      updateField('learnPoints', [
        ...(data.learnPoints || []),
        newPoint.trim(),
      ]);
    }
  };

  const removeLearnPoint = (index: number) => {
    const newPoints = data.learnPoints?.filter((_, i) => i !== index) || [];
    updateField('learnPoints', newPoints);
  };

  return (
    <>
      {/* Step name */}
      <div>
        <h1 className="text-2xl font-semibold">Step 1: Basic Details</h1>
        <p className="text-sm font-medium text-text-secondary mt-4">
          Mention all info needed to describe your course
        </p>
      </div>

      {/* Main Content */}
      <div className="mt-7">
        <div className="px-4 py-5 space-y-5 bg-white rounded-[20px]">
          {/* Course Title */}
          <FieldSection
            title="Course Title"
            description="Display name for the course"
          >
            <Input
              type="text"
              placeholder="Enter course title"
              value={data.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
            />
          </FieldSection>

          {/* Bio */}
          <FieldSection title="Bio" description="One-liner about the course">
            <TextArea
              placeholder="Enter bio"
              rows={2}
              value={data.bio || ''}
              onChange={(e) => updateField('bio', e.target.value)}
            />
          </FieldSection>

          {/* Description */}
          <FieldSection
            title="Description"
            description="Detailed overlook of the course"
          >
            <TextArea
              placeholder="Enter description"
              rows={4}
              value={data.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
            />
          </FieldSection>

          {/* Course Difficulty */}
          <FieldSection
            title="Course Difficulty"
            description="Select course difficulty level"
          >
            <Select
              value={data.difficulty || ''}
              onValueChange={(val) => updateField('difficulty', val)}
            >
              <SelectTrigger className="rounded-2xl w-full justify-between font-medium text-sm">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  Beginner{' '}
                  <span className="text-text-secondary">
                    (No prior knowledge needed)
                  </span>
                </SelectItem>
                <SelectItem value="intermediate">
                  Intermediate{' '}
                  <span className="text-text-secondary">
                    (Some prior knowledge needed)
                  </span>
                </SelectItem>
                <SelectItem value="advanced">
                  Advanced{' '}
                  <span className="text-text-secondary">
                    (Advanced knowledge needed)
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </FieldSection>

          {/* Duration */}
          <FieldSection
            title="Duration"
            description="Estimated time to complete the course"
          >
            <Input
              type="text"
              placeholder="e.g., 4 weeks, 20 hours"
              value={data.duration || ''}
              onChange={(e) => updateField('duration', e.target.value)}
            />
          </FieldSection>

          {/* Tags */}
          <FieldSection
            title="Tags"
            description="Make it easier to look for your course"
          >
            <div className="rounded-[20px] border p-4 flex flex-col gap-3">
              {data.tags && data.tags.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  {data.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="text-sm font-medium px-2 py-1.5 bg-[#F6F6F6] rounded-[10px] border whitespace-nowrap flex items-center gap-2"
                    >
                      <span className="text-primary"># </span>
                      <span>{tag}</span>
                      <button onClick={() => removeTag(index)} className="ml-1">
                        <X className="w-3 h-3 text-[#DE0000]" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-secondary">No tags added yet</p>
              )}
              <Button
                variant="primary"
                size="sm"
                className="w-fit px-2.5 py-1.5 text-sm font-medium"
                onClick={() => setShowTagModal(true)}
              >
                + Add new
              </Button>
            </div>
          </FieldSection>

          {/* What you'll learn */}
          <FieldSection
            title="What will your subscribers learn?"
            description={"Show under the &quot;What you'll learn&quot; section"}
          >
            <div className="flex flex-col gap-3 rounded-2xl border p-4">
              {data.learnPoints && data.learnPoints.length > 0 ? (
                data.learnPoints.map((point, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 rounded-2xl bg-[#F6F6F6] border"
                  >
                    <Image
                      src="/Check.svg"
                      alt="tick"
                      width={18}
                      height={18}
                      className="flex-shrink-0"
                    />
                    <span className="text-sm font-medium flex-1">{point}</span>
                    <button onClick={() => removeLearnPoint(index)}>
                      <X className="w-4 h-4 text-[#DE0000] flex-shrink-0" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-text-secondary">
                  No learning points added yet
                </p>
              )}
              <Button
                variant="primary"
                size="sm"
                className="w-fit px-2.5 py-1.5 text-sm font-medium"
                onClick={() => setShowPointModal(true)}
              >
                + Add new
              </Button>
            </div>
          </FieldSection>

          {/* Thumbnail */}
          <FieldSection
            title="Course Thumbnail"
            description="Your display picture (Optional)"
          >
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink h-[130px] w-[130px] rounded-2xl overflow-hidden bg-[#F6F6F6]">
                {data.thumbnail ? (
                  <img
                    src={data.thumbnail}
                    alt="Thumbnail"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-text-secondary px-2 text-center">
                    No thumbnail selected
                  </div>
                )}
                {isUploadingThumb && (
                  <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <FileUploader
                    accept="image/*"
                    multiple={false}
                    maxFiles={1}
                    onUploadStart={() => setIsUploadingThumb(true)}
                    onUploadEnd={() => setIsUploadingThumb(false)}
                    onFilesAdded={(_files: File[], items: MediaItem[]) => {
                      if (!items || items.length === 0) return;
                      const first = items[0];
                      updateField('thumbnail', first.url);
                      if (first.s3Data) {
                        updateField('thumbnailData', {
                          key: first.s3Data.fileKey,
                          mimetype: first.s3Data.mimetype,
                          size: first.s3Data.size,
                        });
                      }
                    }}
                    onError={() => {}}
                  >
                    {(open) => (
                      <Button size="sm" variant="outline" onClick={open}>
                        + Upload new
                      </Button>
                    )}
                  </FileUploader>
                  {data.thumbnail && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-[#DE0000]"
                      onClick={() => {
                        updateField('thumbnail', '');
                        updateField('thumbnailData', null);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="text-xs font-medium text-text-secondary">
                  200 x 200 px size recommended JPG or PNG
                </div>
              </div>
            </div>
          </FieldSection>

          {/* Banner */}
          <FieldSection
            title="Banner Image/Video"
            description="A brief intro to your course (Optional)"
          >
            <div>
              {/* Banner preview / placeholder */}
              <div className="relative w-full h-[180px] rounded-2xl overflow-hidden bg-[#F6F6F6]">
                {data.banner ? (
                  bannerPreviewType === 'video' ? (
                    <video
                      src={data.banner}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={data.banner}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-text-secondary">
                    No banner selected
                  </div>
                )}
                {isUploadingBanner && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </div>
                )}
              </div>
              <div className="mt-5 flex items-center gap-2">
                <FileUploader
                  accept="image/*,video/*"
                  multiple={false}
                  maxFiles={1}
                  onUploadStart={() => setIsUploadingBanner(true)}
                  onUploadEnd={() => setIsUploadingBanner(false)}
                  onFilesAdded={(_files: File[], items: MediaItem[]) => {
                    if (!items || items.length === 0) return;
                    const first = items[0];
                    setBannerPreviewType(
                      first.type === 'video' ? 'video' : 'image',
                    );
                    updateField('banner', first.url);
                    if (first.s3Data) {
                      updateField('bannerData', {
                        key: first.s3Data.fileKey,
                        mimetype: first.s3Data.mimetype,
                        size: first.s3Data.size,
                      });
                    }
                  }}
                  onError={() => {}}
                >
                  {(open) => (
                    <Button size="sm" variant="outline" onClick={open}>
                      + Upload new
                    </Button>
                  )}
                </FileUploader>
                {data.banner && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[#DE0000]"
                    onClick={() => {
                      updateField('banner', '');
                      updateField('bannerData', null);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <div className="mt-2 text-xs font-medium text-text-secondary">
                JPG, PNG or video
              </div>
            </div>
          </FieldSection>
        </div>

        {/* Footer actions */}
        <div className="flex justify-end items-center mt-7 mb-8">
          <Button
            size="sm"
            className="font-semibold"
            onClick={onNext}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save & Next'}
          </Button>
        </div>
      </div>

      {/* Modals for tags and learning points */}
      <AddCourseTagModal
        isOpen={showTagModal}
        onClose={() => setShowTagModal(false)}
        onSave={(newTag) => {
          addTag(newTag);
          setShowTagModal(false);
        }}
      />
      <AddPointsModal
        isOpen={showPointModal}
        onClose={() => setShowPointModal(false)}
        onSave={(newPoint) => {
          addLearnPoint(newPoint);
          setShowPointModal(false);
        }}
      />
    </>
  );
}

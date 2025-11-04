'use client';

import Image from 'next/image';
import React from 'react';
import { FileUploadPayload } from 'src/types/uploads.types';
import Button from 'src/components/mobile/common/ui/Button';
import Input, { TextArea } from 'src/components/mobile/common/ui/Input';
import FieldSection from 'src/components/mobile/create-course/FieldSection';

interface ChapterData {
  id: string;
  name: string;
  media: string[];
  videoEmbedUrl: string;
  savedEmbed: string | null;
  mediaData?: FileUploadPayload[];
}

interface ModuleData {
  id: string;
  name: string;
  description: string;
  duration: string;
  chapters: ChapterData[];
}

interface ModulesData {
  modules: ModuleData[];
}

interface MobileCourseModulesContentProps {
  data: ModulesData;
  onDataChange: (data: ModulesData) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function MobileCourseModulesContent({
  data,
  onDataChange,
  onNext,
  onBack,
  isLoading,
}: MobileCourseModulesContentProps) {
  const addModule = () => {
    const newModule = {
      id: `module-${Date.now()}`,
      name: '',
      description: '',
      duration: '',
      chapters: [],
    };
    onDataChange({
      modules: [...data.modules, newModule],
    });
  };

  const updateModule = (index: number, field: string, value: string) => {
    const updatedModules = [...data.modules];
    updatedModules[index] = { ...updatedModules[index], [field]: value };
    onDataChange({ modules: updatedModules });
  };

  const removeModule = (index: number) => {
    const updatedModules = data.modules.filter((_, i) => i !== index);
    onDataChange({ modules: updatedModules });
  };

  const addChapter = (moduleIndex: number) => {
    const newChapter = {
      id: `chapter-${Date.now()}`,
      name: '',
      media: [],
      videoEmbedUrl: '',
      savedEmbed: null,
    };
    const updatedModules = [...data.modules];
    updatedModules[moduleIndex].chapters.push(newChapter);
    onDataChange({ modules: updatedModules });
  };

  const updateChapter = (
    moduleIndex: number,
    chapterIndex: number,
    field: string,
    value: string,
  ) => {
    const updatedModules = [...data.modules];
    updatedModules[moduleIndex].chapters[chapterIndex] = {
      ...updatedModules[moduleIndex].chapters[chapterIndex],
      [field]: value,
    };
    onDataChange({ modules: updatedModules });
  };

  const removeChapter = (moduleIndex: number, chapterIndex: number) => {
    const updatedModules = [...data.modules];
    updatedModules[moduleIndex].chapters = updatedModules[
      moduleIndex
    ].chapters.filter((_, i) => i !== chapterIndex);
    onDataChange({ modules: updatedModules });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Step 2: Modules & Content</h1>
        <p className="text-sm font-medium text-text-secondary mt-4">
          Lets setup & structure all modules and content for your Subscribers
        </p>
      </div>

      <div className="mt-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">
            Course Modules ({data.modules.length})
          </h2>
          <Button
            size="sm"
            className="font-semibold rounded-2xl"
            onClick={addModule}
          >
            + Add Module
          </Button>
        </div>

        {data.modules.length === 0 ? (
          <div className="bg-white rounded-[20px] p-8 text-center">
            <p className="text-text-secondary">
              No modules added yet. Click &quot;+ Add Module&quot; to create
              your first module.
            </p>
          </div>
        ) : (
          data.modules.map((module, moduleIndex) => (
            <div key={module.id} className="mb-5">
              <div className="px-4 py-5 space-y-5 bg-white rounded-[20px]">
                {/* Module Header */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-2.5 items-center">
                    <Button variant="secondary" size="sm">
                      <Image
                        src="/menu.svg"
                        alt="menu"
                        width={16}
                        height={16}
                      />
                    </Button>
                    <Button variant="secondary" size="sm">
                      Module {moduleIndex + 1}
                    </Button>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => removeModule(moduleIndex)}
                  >
                    <Image
                      src="/delete.svg"
                      alt="delete"
                      width={16}
                      height={16}
                    />
                  </Button>
                </div>

                {/* Name of Module */}
                <FieldSection
                  title="Name of Module"
                  description="Used to define your course module"
                >
                  <Input
                    type="text"
                    placeholder="Enter module name"
                    value={module.name}
                    onChange={(e) =>
                      updateModule(moduleIndex, 'name', e.target.value)
                    }
                  />
                </FieldSection>

                {/* Description of Module */}
                <FieldSection
                  title="Description of Module"
                  description="What will the students learn in this module"
                >
                  <TextArea
                    placeholder="Enter module description"
                    rows={4}
                    value={module.description}
                    onChange={(e) =>
                      updateModule(moduleIndex, 'description', e.target.value)
                    }
                  />
                </FieldSection>

                {/* Duration */}
                <FieldSection
                  title="Duration"
                  description="Estimated time to complete"
                >
                  <Input
                    type="text"
                    placeholder="e.g., 2 hours"
                    value={module.duration}
                    onChange={(e) =>
                      updateModule(moduleIndex, 'duration', e.target.value)
                    }
                  />
                </FieldSection>
              </div>

              {/* Chapters Section */}
              <div className="mt-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Chapters ({module.chapters.length})
                </h3>
                <Button
                  size="sm"
                  className="font-semibold rounded-2xl"
                  onClick={() => addChapter(moduleIndex)}
                >
                  + Add Chapter
                </Button>
              </div>

              {module.chapters.length === 0 ? (
                <div className="mt-5 bg-white rounded-[20px] p-6 text-center">
                  <p className="text-sm text-text-secondary">
                    No chapters added yet. Click &quot;+ Add Chapter&quot; to
                    add content.
                  </p>
                </div>
              ) : (
                module.chapters.map((chapter, chapterIndex) => (
                  <div
                    key={chapter.id}
                    className="mt-5 px-4 py-5 space-y-5 bg-white rounded-[20px]"
                  >
                    {/* Chapter Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2.5 items-center">
                        <Button variant="secondary" size="sm">
                          <Image
                            src="/menu.svg"
                            alt="menu"
                            width={16}
                            height={16}
                          />
                        </Button>
                        <Button variant="secondary" size="sm">
                          Chapter {chapterIndex + 1}
                        </Button>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => removeChapter(moduleIndex, chapterIndex)}
                      >
                        <Image
                          src="/delete.svg"
                          alt="delete"
                          width={16}
                          height={16}
                        />
                      </Button>
                    </div>

                    {/* Chapter Name */}
                    <FieldSection
                      title="Chapter Name"
                      description="Name of this chapter"
                    >
                      <Input
                        type="text"
                        placeholder="Enter chapter name"
                        value={chapter.name}
                        onChange={(e) =>
                          updateChapter(
                            moduleIndex,
                            chapterIndex,
                            'name',
                            e.target.value,
                          )
                        }
                      />
                    </FieldSection>

                    {/* Video URL (simplified for now) */}
                    <FieldSection
                      title="Video Content"
                      description="Add video URL or upload"
                    >
                      <Input
                        type="text"
                        placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                        value={chapter.videoEmbedUrl}
                        onChange={(e) =>
                          updateChapter(
                            moduleIndex,
                            chapterIndex,
                            'videoEmbedUrl',
                            e.target.value,
                          )
                        }
                      />
                      <div className="mt-2">
                        <Button size="sm" variant="outline">
                          + Upload Video
                        </Button>
                      </div>
                    </FieldSection>
                  </div>
                ))
              )}
            </div>
          ))
        )}

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-7 mb-8">
          <Button
            variant="secondary"
            size="sm"
            className="font-semibold bg-white"
            onClick={onBack}
          >
            Go Back
          </Button>
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
    </>
  );
}

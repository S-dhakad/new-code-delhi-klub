'use client';
import React, { useState, useRef } from 'react';
import { Card, CardContent } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import ChapterBlock from './ChapterBlock';
import { FileUploadPayload } from 'src/types/uploads.types';

interface ModuleContentsDetailsProps {
  data: {
    modules: Array<{
      id: string;
      name: string;
      description: string;
      duration: string;
      chapters: Array<{
        id: string;
        name: string;
        media: string[];
        videoEmbedUrl: string;
        savedEmbed: string | null;
        mediaData?: FileUploadPayload[];
      }>;
      isOpen?: boolean;
    }>;
  };
  onDataChange: (data: Partial<ModuleContentsDetailsProps['data']>) => void;
}

export default function ModuleContentsDetails({
  data,
  onDataChange,
}: ModuleContentsDetailsProps) {
  const chapterTemplate = {
    name: '',
    media: [],
    videoEmbedUrl: '',
    savedEmbed: null,
  };

  const createChapter = (index = 1) => ({
    ...chapterTemplate,
    id: `chap-${Date.now()}-${Math.floor(Math.random() * 10000)}-${index}`,
    name: `Chapter ${index}`,
  });

  const createModule = (index = 1) => ({
    id: `mod-${Date.now()}-${Math.floor(Math.random() * 10000)}-${index}`,
    name: `Module ${index}`,
    description: '',
    duration: '',
    isOpen: true,
    chapters: [createChapter(1)],
  });

  const [modules, setModules] = useState(() =>
    data.modules.length > 0 ? data.modules : [createModule(1)],
  );
  const isUpdatingFromParent = useRef(false);

  // Sync with store data only when data changes from parent
  React.useEffect(() => {
    if (data.modules.length > 0) {
      isUpdatingFromParent.current = true;
      setModules(data.modules);
      // Reset the flag after state update
      setTimeout(() => {
        isUpdatingFromParent.current = false;
      }, 0);
    }
  }, [data.modules]);

  // Update store when modules change (but not when syncing from parent)
  React.useEffect(() => {
    // Only call onDataChange if modules changed from user interaction, not from parent sync
    if (!isUpdatingFromParent.current && modules.length > 0) {
      onDataChange({ modules });
    }
  }, [modules, onDataChange]);

  const handleAddModule = () => {
    setModules((prev) => {
      const nextIndex = prev.length + 1;
      return [...prev, createModule(nextIndex)];
    });
  };

  const handleRemoveModule = (moduleId: string) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const toggleModule = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === moduleId ? { ...m, isOpen: !m.isOpen } : m)),
    );
  };

  const handleAddChapter = (moduleId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        const nextIndex = m.chapters.length + 1;
        const newChapter = createChapter(nextIndex);
        return { ...m, chapters: [...m.chapters, newChapter] };
      }),
    );
  };

  const handleChapterNameChange = (chapterId: string, name: string) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        chapters: m.chapters.map((c) =>
          c.id === chapterId ? { ...c, name } : c,
        ),
      })),
    );
  };

  const handleRemoveChapter = (moduleId: string, chapterId: string) => {
    setModules((prev) =>
      prev.map((m) => {
        if (m.id !== moduleId) return m;
        return { ...m, chapters: m.chapters.filter((c) => c.id !== chapterId) };
      }),
    );
  };

  const handleChapterMediaChange = (
    chapterId: string,
    media: string[],
    mediaData: FileUploadPayload[],
  ) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        chapters: m.chapters.map((c) =>
          c.id === chapterId ? { ...c, media, mediaData } : c,
        ),
      })),
    );
  };

  const handleEmbedUrlChange = (chapterId: string, embedUrl: string) => {
    setModules((prev) =>
      prev.map((m) => ({
        ...m,
        chapters: m.chapters.map((c) =>
          c.id === chapterId ? { ...c, videoEmbedUrl: embedUrl } : c,
        ),
      })),
    );
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-semibold text-base text-[#000000]">
            Course Modules ({modules.length})
          </div>
        </div>
        <div>
          <Button
            className="bg-[#0A5DBC] text-white rounded-[15px] text-sm font-semibold h-10 transition-colors duration-300 hover:bg-[#053875]"
            variant="default"
            onClick={handleAddModule}
          >
            + Add Modules
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <Card className="rounded-[20px] py-0 border-0" key={module.id}>
            <CardContent className="py-8 lg:py-8 px-4 lg:px-10">
              <div className="space-y-5">
                {/* Header with toggle button */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Button
                      className="px-3 rounded-[10px] bg-[#F6F6F6] h-10 flex items-center justify-center"
                      onClick={() => toggleModule(module.id)}
                    >
                      <Image
                        src="/menu.svg"
                        alt="menu icon"
                        width={16}
                        height={16}
                      />
                    </Button>
                    <div className="px-4 rounded-[10px] bg-[#F6F6F6] text-base font-medium text-[#000000] h-10 flex items-center justify-center">
                      {module.name}
                    </div>
                  </div>

                  <div className="ml-auto">
                    <button
                      className="p-2 rounded-xl bg-[#F6F6F6] w-10 h-10 flex items-center justify-center"
                      title="Remove module"
                      onClick={() => handleRemoveModule(module.id)}
                    >
                      <Image
                        src="/delete.svg"
                        alt="delete icon"
                        width={16}
                        height={16}
                      />
                    </button>
                  </div>
                </div>

                {/* Toggleable content */}
                {module.isOpen && (
                  <div className="space-y-5">
                    {/* Module details */}
                    <div className="p-5 space-y-5">
                      {/* Module name */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
                        <div className="flex-1">
                          <div className="text-base font-semibold text-[#000000]">
                            Name the Module
                          </div>
                          <div className="text-sm font-medium text-[#787878] mt-1">
                            Used to define your course content
                          </div>
                        </div>

                        <div className="w-full lg:w-[495px]">
                          <div className="relative flex-1 w-full">
                            <Image
                              src="/info-circle.svg"
                              alt="info"
                              width={16}
                              height={16}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            />
                            <Input
                              value={module.name}
                              onChange={(e) =>
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === module.id
                                      ? { ...m, name: e.target.value }
                                      : m,
                                  ),
                                )
                              }
                              className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-20">
                        <div className="flex-1">
                          <div className="text-base font-semibold text-[#000000]">
                            Describe the Module
                          </div>
                          <div className="text-sm font-medium text-[#787878] mt-1">
                            What will the students learn in the course
                          </div>
                        </div>

                        <div className="w-full lg:w-[495px] relative">
                          <Textarea
                            value={module.description}
                            onChange={(e) =>
                              setModules((prev) =>
                                prev.map((m) =>
                                  m.id === module.id
                                    ? { ...m, description: e.target.value }
                                    : m,
                                ),
                              )
                            }
                            rows={10}
                            className="p-[15px] pb-11 resize-none border-[#ECECEC] rounded-[15px] font-medium text-sm text-[#000000]"
                          />
                          <div className="text-right text-sm text-gray-400 mt-2 absolute right-4 bottom-4 bg-white">
                            453/500
                          </div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
                        <div className="flex-1">
                          <div className="text-base font-semibold text-[#000000]">
                            Module duration
                          </div>
                          <div className="text-sm font-medium text-[#787878] mt-1">
                            How long is the module?
                          </div>
                        </div>

                        <div className="w-full lg:w-[495px]">
                          <Input
                            value={module.duration}
                            onChange={(e) =>
                              setModules((prev) =>
                                prev.map((m) =>
                                  m.id === module.id
                                    ? { ...m, duration: e.target.value }
                                    : m,
                                ),
                              )
                            }
                            className="w-full h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Chapters header + add button */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-base text-[#000000]">
                          Chapters ({module.chapters.length})
                        </div>
                      </div>
                      <div>
                        <Button
                          className="bg-[#0A5DBC] text-white rounded-[15px] text-sm font-semibold h-10 transition-colors duration-300 hover:bg-[#053875]"
                          variant="default"
                          onClick={() => handleAddChapter(module.id)}
                        >
                          + Add Chapter
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {module.chapters.map((chapter, idx) => (
                        <ChapterBlock
                          key={chapter.id}
                          chapter={chapter}
                          index={idx}
                          onRemove={(chapterId: string) =>
                            handleRemoveChapter(module.id, chapterId)
                          }
                          onNameChange={handleChapterNameChange}
                          onMediaChange={handleChapterMediaChange}
                          onEmbedUrlChange={handleEmbedUrlChange}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}

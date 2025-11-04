'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import ModuleSidebar from 'src/components/courses/ModuleSidebar';
import { useRouter, useParams } from 'next/navigation';
import { coursesService } from 'src/axios/courses';
import { useCommunityStore } from 'src/store/community.store';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileCourseProgressPage } from 'src/mobile-pages';
import { Course } from 'src/types/courses.types';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

type LessonMediaItem = { url: string; fileType?: string | null };
type SidebarLesson = {
  id: string;
  title: string;
  completed?: boolean;
  media?: LessonMediaItem[];
};
type SidebarModule = {
  id: string;
  label: string;
  title: string;
  completed?: boolean;
  open?: boolean;
  lessons?: SidebarLesson[];
};

export default function MyCourseProgress() {
  const router = useRouter();
  const params = useParams();
  const { community } = useCommunityStore();
  const isMobile = useIsMobile();
  const showToast = useToastStore((s) => s.showToast);
  const [modules, setModules] = useState<SidebarModule[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openModuleId, setOpenModuleId] = useState<string | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState<boolean>(false);
  const [course, setCourse] = useState<Course | null>(null);
  const totalModules = useMemo(() => modules.length || 0, [modules]);

  useEffect(() => {
    const fetchModulesAndLessons = async () => {
      if (!community?.id || !params?.slug) return;
      try {
        setLoading(true);
        const courseId = String(params.slug);

        // 1) Fetch modules
        const [modulesRes, courseData] = await Promise.all([
          await coursesService.getModules(community.id, courseId),
          await coursesService.getCourseById(community.id, courseId),
        ]);
        setCourse(courseData.data.courses);
        const apiModules: Array<{ id: string; name: string; order?: number }> =
          modulesRes?.data?.modules || [];

        // 2) For each module, fetch lessons in parallel
        const modulesWithLessons = await Promise.all(
          apiModules.map(async (m) => {
            try {
              const lessonsRes = await coursesService.getLessons(
                community.id,
                courseId,
                m.id,
              );
              const apiLessons: Array<{
                id: string;
                name: string;
                progress?: Array<{ isCompleted?: boolean }>;
                videoUrls?: string[];
                urls?: string[];
                content?: string | null;
                videoFiles?: Array<{ url: string; fileType?: string | null }>;
              }> = lessonsRes?.data?.lessons || [];
              const lessons: SidebarLesson[] = apiLessons.map((l) => {
                const items: LessonMediaItem[] = [];
                if (Array.isArray(l.videoFiles) && l.videoFiles.length) {
                  l.videoFiles.forEach((vf) => {
                    if (vf?.url)
                      items.push({
                        url: vf.url,
                        fileType: vf.fileType ?? null,
                      });
                  });
                }
                const fallbackUrls = Array.isArray(l.videoUrls)
                  ? l.videoUrls
                  : Array.isArray(l.urls)
                    ? l.urls
                    : [];
                if (fallbackUrls.length) {
                  fallbackUrls.forEach((u) => {
                    if (u) items.push({ url: u, fileType: null });
                  });
                }
                if (l.content && typeof l.content === 'string') {
                  items.push({ url: l.content, fileType: null });
                }
                return {
                  id: l.id,
                  title: l.name,
                  completed: Array.isArray(l.progress)
                    ? Boolean(l.progress[0]?.isCompleted)
                    : false,
                  media: items,
                } as SidebarLesson;
              });

              const completed =
                lessons.length > 0 && lessons.every((ls) => !!ls.completed);

              const label = m.order ? `Module ${m.order}` : 'Module';

              const mod: SidebarModule = {
                id: m.id,
                label,
                title: m.name,
                completed,
                lessons,
              };
              return mod;
            } catch {
              return {
                id: m.id,
                label: m.order ? `Module ${m.order}` : 'Module',
                title: m.name,
                completed: false,
                lessons: [],
              } as SidebarModule;
            }
          }),
        );
        setModules(modulesWithLessons);
        // default open first module and select its first lesson when data loads
        const defaultOpen = modulesWithLessons[0]?.id ?? null;
        setOpenModuleId((prev) => prev ?? defaultOpen);
        const firstLesson = modulesWithLessons[0]?.lessons?.[0]?.id ?? null;
        setSelectedLessonId((prev) => prev ?? firstLesson);
      } catch (error) {
        const message = getErrorMessage(error);
        showToast({
          type: 'default-error',
          title: 'Failed to load modules/lessons',
          message,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchModulesAndLessons();
  }, [community?.id, params?.slug]);

  // When open module changes, ensure a lesson from it is selected
  useEffect(() => {
    if (!openModuleId) return;
    const mod = modules.find((m) => m.id === openModuleId);
    if (!mod) return;
    const hasSelectedInModule = mod.lessons?.some(
      (l) => l.id === selectedLessonId,
    );
    if (!hasSelectedInModule) {
      setSelectedLessonId(mod.lessons?.[0]?.id ?? null);
    }
  }, [openModuleId, modules, selectedLessonId]);

  if (isMobile) {
    return <MobileCourseProgressPage />;
  }

  return (
    <>
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-6 pb-4 lg:pt-9 lg:pb-5 gap-4">
            <div className="flex items-center gap-3">
              <button
                aria-label="go back"
                className="-ml-2 lg:ml-0"
                onClick={() => router.back()}
              >
                <Image
                  src="/arrow-left.svg"
                  alt="back icon"
                  width={22}
                  height={22}
                />
              </button>
              <h2 className="text-lg lg:text-xl font-semibold">Back</h2>
            </div>

            {/* Buttons section - full width on mobile/tablet, auto on desktop */}
            <div className="flex w-full lg:w-auto gap-2">
              <Button
                className="rounded-2xl border bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1 w-full lg:w-auto"
                disabled={isUpdatingProgress}
                onClick={async () => {
                  if (
                    !community?.id ||
                    !params?.slug ||
                    !openModuleId ||
                    !selectedLessonId
                  )
                    return;
                  try {
                    setIsUpdatingProgress(true);
                    await coursesService.updateLessonProgress(
                      community.id,
                      String(params.slug),
                      openModuleId,
                      selectedLessonId,
                    );
                    // Optimistically mark lesson as completed and advance to next if available
                    setModules((prev) =>
                      prev.map((m) => {
                        if (m.id !== openModuleId) return m;
                        const updatedLessons = (m.lessons || []).map((l) =>
                          l.id === selectedLessonId
                            ? { ...l, completed: true }
                            : l,
                        );
                        const allDone =
                          updatedLessons.length > 0 &&
                          updatedLessons.every((l) => !!l.completed);
                        return {
                          ...m,
                          lessons: updatedLessons,
                          completed: allDone,
                        };
                      }),
                    );
                    // Move to next incomplete lesson within the open module
                    const currentModule = modules.find(
                      (m) => m.id === openModuleId,
                    );
                    const lessons = currentModule?.lessons || [];
                    const currentIdx = lessons.findIndex(
                      (l) => l.id === selectedLessonId,
                    );
                    if (currentIdx >= 0) {
                      const next =
                        lessons
                          .slice(currentIdx + 1)
                          .find((l) => !l.completed) || lessons[currentIdx + 1];
                      if (next) setSelectedLessonId(next.id);
                    }
                  } catch (error) {
                    const message = getErrorMessage(error);
                    showToast({
                      type: 'default-error',
                      title: 'Failed to update lesson progress',
                      message,
                    });
                  } finally {
                    setIsUpdatingProgress(false);
                  }
                }}
              >
                {isUpdatingProgress ? 'Updating…' : 'Next'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-28 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:block lg:w-[390px]">
            <ModuleSidebar
              total={totalModules}
              modules={modules}
              title={course?.name ?? ''}
              author={course?.user?.firstName ?? ''}
              openModuleId={openModuleId}
              onOpenChange={setOpenModuleId}
              selectedLessonId={selectedLessonId}
              onLessonClick={(moduleId, lessonId) => {
                setOpenModuleId(moduleId);
                setSelectedLessonId(lessonId);
              }}
            />
          </div>

          <div className="flex-1 space-y-6 w-full">
            <h2 className="text-lg font-semibold">
              {loading ? 'Loading…' : 'Lessons'}
            </h2>
            {!loading && modules.length > 0 && openModuleId
              ? (() => {
                  const mod = modules.find((m) => m.id === openModuleId);
                  const ls = mod?.lessons?.find(
                    (l) => l.id === selectedLessonId,
                  );
                  if (!mod || !ls) return null;
                  return (
                    <div className="space-y-4">
                      <div className="bg-white rounded-2xl p-5 border border-gray-100">
                        <h3 className="text-base font-semibold mb-3">
                          {ls.title}
                        </h3>
                        {(ls.media || []).length ? (
                          (ls.media as LessonMediaItem[]).map((item, idx) => {
                            const u = item.url;
                            const t = item.fileType || '';
                            const isYouTube =
                              u.includes('youtube.com') ||
                              u.includes('youtu.be');
                            const isLoom = u.includes('loom.com');
                            const isBlob = u.startsWith('blob:');
                            const isVideoFile =
                              t.startsWith('video/') || isBlob;

                            // derive yt embed
                            const toYouTubeEmbed = (
                              url: string,
                            ): string | null => {
                              const m = url.match(
                                /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
                              );
                              return m && m[1]
                                ? `https://www.youtube.com/embed/${m[1]}`
                                : null;
                            };

                            return (
                              <div
                                key={`${ls.id}-${idx}`}
                                className="rounded-xl overflow-hidden border border-gray-100 bg-black"
                              >
                                {isVideoFile ? (
                                  <video
                                    src={u}
                                    controls
                                    className="w-full h-auto"
                                    preload="metadata"
                                  />
                                ) : isYouTube ? (
                                  <iframe
                                    src={toYouTubeEmbed(u) || u}
                                    className="w-full aspect-video"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                ) : isLoom ? (
                                  <iframe
                                    src={u}
                                    className="w-full aspect-video"
                                    allowFullScreen
                                  />
                                ) : (
                                  <a
                                    href={u}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-4 text-white"
                                  >
                                    Open resource
                                  </a>
                                )}
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-sm text-gray-500">
                            No video available
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

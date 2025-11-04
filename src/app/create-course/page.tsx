'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import CourseBasicDetails from 'src/components/courses/CourseBasicDetails';
import CoursePriceDetail from 'src/components/courses/CoursePriceDetail';
import ModuleContentsDetails from 'src/components/courses/ModuleContentsDetails';
import StepperAside from 'src/components/courses/StepperAside';
import { Button } from 'src/components/ui/button';
import { useCourseCreationStore } from 'src/store/course-creation.store';
import { useCommunityStore } from 'src/store/community.store';
import { coursesService } from 'src/axios/courses/coursesApi';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { MobileCreateCoursePage } from 'src/mobile-pages';
import { FileUploadPayload } from 'src/types/uploads.types';

export default function CreateCoursePage() {
  const steps = [
    { id: 'basic', label: 'Basic info' },
    { id: 'modules', label: 'Modules & Content' },
    { id: 'pricing', label: 'Pricing' },
  ];
  const router = useRouter();
  const isMobile = useIsMobile();

  // Store hooks
  const { community } = useCommunityStore();
  const { showToast } = useToastStore();
  const {
    courseId,
    setCourseId,
    setCourseData,
    basicDetails,
    modulesData,
    pricingData,
    setBasicDetails,
    setModulesData,
    setPricingData,
    resetCourseCreation,
  } = useCourseCreationStore();

  const [stepIndex, setStepIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);
  const progressMap = [40, 70, 100];
  const progress = progressMap[Math.min(stepIndex, progressMap.length - 1)];

  // Render mobile single-page flow
  if (isMobile) {
    return <MobileCreateCoursePage />;
  }

  const validateBasicDetails = (): boolean => {
    if (!basicDetails.title?.trim()) {
      showToast({ title: 'Course title is required', type: 'default-error' });
      return false;
    }
    if (!basicDetails.bio?.trim()) {
      showToast({ title: 'Course bio is required', type: 'default-error' });
      return false;
    }
    if (!basicDetails.description?.trim()) {
      showToast({
        title: 'Course description is required',
        type: 'default-error',
      });
      return false;
    }
    if (!basicDetails.difficulty?.trim()) {
      showToast({
        title: 'Course difficulty is required',
        type: 'default-error',
      });
      return false;
    }
    if (!basicDetails.duration?.trim()) {
      showToast({
        title: 'Course duration is required',
        type: 'default-error',
      });
      return false;
    }
    // if (!basicDetails.tags?.length) {
    //   showToast({ title: 'Add at least one tag', type: 'default-error' });
    //   return false;
    // }
    // if (!basicDetails.learnPoints?.length) {
    //   showToast({ title: 'Add at least one learning outcome', type: 'default-error' });
    //   return false;
    // }
    // if (!basicDetails.thumbnailData) {
    //   showToast({ title: 'Course thumbnail is required', type: 'default-error' });
    //   return false;
    // }
    // if (!basicDetails.bannerData) {
    //   showToast({ title: 'Course banner is required', type: 'default-error' });
    //   return false;
    // }
    return true;
  };

  const validateModules = (): boolean => {
    if (!modulesData.modules.length) {
      showToast({ title: 'Add at least one module', type: 'default-error' });
      return false;
    }

    // for (let i = 0; i < modulesData.modules.length; i++) {
    //   const mod = modulesData.modules[i];
    //   if (!mod.name?.trim()) {
    //     showToast({ title: `Module ${i + 1} name is required`, type: 'default-error' });
    //     return false;
    //   }
    //   if (!mod.chapters.length) {
    //     showToast({ title: `Add at least one chapter in Module ${i + 1}`, type: 'default-error' });
    //     return false;
    //   }
    //   for (let j = 0; j < mod.chapters.length; j++) {
    //     const chap = mod.chapters[j];
    //     if (!chap.name?.trim()) {
    //       showToast({ title: `Chapter ${j + 1} in Module ${i + 1} needs a name`, type: 'default-error' });
    //       return false;
    //     }
    //     if (!chap.media?.length && !chap.videoEmbedUrl?.trim()) {
    //       showToast({ title: `Chapter ${j + 1} in Module ${i + 1} requires media or a video URL`, type: 'default-error' });
    //       return false;
    //     }
    //   }
    // }

    return true;
  };

  const validatePricing = (): boolean => {
    if (!pricingData.courseType) {
      showToast({ title: 'Select course type', type: 'default-error' });
      return false;
    }
    if (pricingData.courseType === 'paid' && !pricingData.price) {
      showToast({ title: 'Enter course price', type: 'default-error' });
      return false;
    }
    return true;
  };

  const goNext = async () => {
    if (stepIndex === 0) {
      if (!validateBasicDetails()) return;
      const success = await handleCreateCourse();
      if (!success) return;
    } else if (stepIndex === 1) {
      if (!validateModules()) return;
      await handleCreateModules();
    } else if (stepIndex === 2) {
      if (!validatePricing()) return;
      await handleUpdatePricing();
    }
    if (stepIndex < steps.length - 1) {
      setStepIndex((s) => Math.min(s + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    setStepIndex((s) => Math.max(s - 1, 0));
  };
  const goTo = (index: number) => {
    setStepIndex(() => Math.max(0, Math.min(index, steps.length - 1)));
  };

  const handleCreateCourse = async (): Promise<boolean> => {
    if (!community?.id) {
      showToast({
        title: 'Please select a community.',
        type: 'default-error',
      });
      return false;
    }
    setIsLoading(true);
    try {
      const courseData = {
        name: basicDetails.title,
        description: basicDetails.description,
        level: basicDetails.difficulty,
        duration: basicDetails.duration,
        tags: basicDetails.tags,
        learningOutcomes: basicDetails.learnPoints,
        isActive: false, // Draft course
        banner: basicDetails.bannerData ? [basicDetails.bannerData] : undefined,
        images: basicDetails.thumbnailData
          ? [basicDetails.thumbnailData]
          : undefined,
      };

      const response = await coursesService.createCourse(
        community.id,
        courseData,
      );

      if (
        response &&
        response.data &&
        response.data.course &&
        response.data.course.id
      ) {
        setCourseId(response.data.course.id);
        setCourseData(response.data.course);
        return true;
      } else {
        showToast({
          title: 'Course creation failed.',
          type: 'default-error',
        });
        return false;
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to create course. Please try again.',
        message,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateModules = async () => {
    if (!community?.id) {
      showToast({
        title: 'Please select a community.',
        type: 'default-error',
      });
      return;
    }
    if (!courseId) {
      showToast({
        title: 'Please complete the basic details step first',
        type: 'default-error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const createdModuleIds: string[] = [];

      // First, create all modules and collect their IDs
      for (
        let moduleIndex = 0;
        moduleIndex < modulesData.modules.length;
        moduleIndex++
      ) {
        const moduleItem = modulesData.modules[moduleIndex];
        const moduleData = {
          name: moduleItem.name,
          description: moduleItem.description,
          duration: moduleItem.duration,
          order: moduleIndex + 1, // Module number (1-based)
          isActive: true,
        };

        const response = await coursesService.createModule(
          community.id,
          courseId,
          moduleData,
        );
        // Extract module ID from response (adjust based on your API response structure)
        const moduleId = response.data?.module?.id || response.id;
        if (moduleId) {
          createdModuleIds.push(moduleId);
        }
      }

      // Now create lessons for each module
      for (let i = 0; i < modulesData.modules.length; i++) {
        const moduleItem = modulesData.modules[i];
        const moduleId = createdModuleIds[i];

        if (!moduleId) {
          showToast({
            title: `No module ID found for module ${i}`,
            type: 'default-error',
          });
          continue;
        }

        // Create lessons for each chapter in the module
        for (
          let chapterIndex = 0;
          chapterIndex < moduleItem.chapters.length;
          chapterIndex++
        ) {
          const chapter = moduleItem.chapters[chapterIndex];

          // chapter.media already includes embed URL if it was saved

          const lessonData = {
            name: chapter.name,
            description: chapter.name, // Using name as description for now
            // Only send actual uploaded files (S3). Do not include local previews or keys as URLs.
            videoFiles: [
              ...(((chapter.mediaData || []) as FileUploadPayload[]) || []),
              ...(chapter.videoEmbedUrl && chapter.videoEmbedUrl.trim()
                ? [{ url: chapter.videoEmbedUrl.trim() }]
                : []),
            ] as Array<FileUploadPayload | { url: string }>,

            order: chapterIndex + 1, // Chapter number (1-based)
            isActive: true,
          };
          await coursesService.createLesson(
            community.id,
            courseId,
            moduleId,
            lessonData,
          );
        }
      }
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to create modules. Please try again.',
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePricing = async () => {
    if (!community?.id) {
      showToast({
        title: 'Please select a community.',
        type: 'default-error',
      });
      return;
    }
    if (!courseId) {
      showToast({
        title: 'No course ID available',
        message: 'Please complete the previous steps first',
        type: 'default-error',
      });
      return;
    }
    setIsLoading(true);
    try {
      const updateData = {
        price:
          pricingData.courseType === 'paid' ? parseFloat(pricingData.price) : 0,
        currency: 'INR',
        isActive: true, // Publish the course
      };

      await coursesService.updateCourse(community.id, courseId, updateData);
      // Reset the form to default values
      resetCourseCreation();
      setStepIndex(0); // Reset to first step
      showToast({
        title: 'Course created success',
        type: 'default-success',
      });
      router.push('/courses');
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Failed to publish course. Please try again.',
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pt-6 pb-4 lg:pt-[30px] lg:pb-[15px] gap-4">
            {/* Left section */}
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
              <h2 className="text-lg lg:text-xl font-semibold text-[#000000]">
                Create a course
              </h2>
            </div>

            {/* Buttons section */}
            <div className="flex w-full lg:w-auto gap-2">
              <Button
                className="rounded-[15px] border border-[#ECECEC] bg-white text-sm font-semibold text-[#000000] px-3 py-1 w-1/2 lg:w-auto h-10"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb + Progress (responsive) */}
      <div className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between py-4 gap-3">
            <div className="text-sm text-[#787878] font-semibold w-full lg:w-auto">
              All Courses &gt; My Drafts &gt;{' '}
              <span className="text-[#000000] font-bold">AI Tools 101</span>
            </div>

            <div className="w-full lg:w-48">
              <div className="text-sm text-[#787878] font-medium flex items-center">
                <div>Progress:</div>
                <div className="text-black ml-2">{progress}%</div>
              </div>

              <div
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
                className="w-full bg-[#E6E6E6] rounded-[10px] h-[9px] mt-[6px] overflow-hidden"
              >
                <div
                  className="h-full rounded-[10px] transition-all duration-300"
                  style={{
                    width: `${Math.max(0, Math.min(100, progress))}%`,
                    backgroundColor: '#13B184',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-6  pt-6 lg:pt-8 pb-12">
            <div className="w-full lg:hidden">
              <div className="flex items-center justify-between mb-4 gap-2 overflow-x-auto">
                {steps.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => goTo(i)}
                    className={`flex-1 min-w-[100px] text-xs py-2 rounded-2xl border ${i === stepIndex ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'}`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <aside className="hidden lg:block lg:w-72">
              <div>
                <StepperAside steps={steps} stepIndex={stepIndex} />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <h1 className="text-xl lg:text-2xl font-semibold text-[#000000]">
                    {stepIndex === 0
                      ? 'Step 1: Basic Details'
                      : stepIndex === 1
                        ? 'Step 2: Modules & Content'
                        : 'Step 3: Pricing'}
                  </h1>
                  <p className="text-sm font-medium text-[#787878] mt-1 max-w-[700px]">
                    {stepIndex === 0
                      ? 'Mention all info needed to describe your course'
                      : stepIndex === 1
                        ? 'Lets setup & structure all modules and content for your Subscribers'
                        : 'Lets setup the price for your course'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 w-full lg:w-auto">
                  <Button
                    onClick={goBack}
                    className={`rounded-[15px] border border-[#ECECEC] bg-white text-sm font-semibold text-[#000000] px-3 py-1 w-1/2 lg:w-auto h-10 ${stepIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={stepIndex === 0}
                  >
                    Go back
                  </Button>
                  <Button
                    onClick={
                      stepIndex < steps.length - 1
                        ? goNext
                        : handleUpdatePricing
                    }
                    disabled={isLoading}
                    className="rounded-[15px] border bg-[#0A5DBC] text-white text-sm font-semibold px-3 py-1 w-1/2 lg:w-auto flex items-center h-10 transition-colors duration-300 hover:bg-[#053875]"
                  >
                    {isLoading
                      ? 'Saving...'
                      : stepIndex < steps.length - 1
                        ? 'Save & Next'
                        : 'Publish Course'}
                  </Button>
                </div>
              </div>

              <div>
                {stepIndex === 0 && (
                  <CourseBasicDetails
                    data={basicDetails}
                    onDataChange={setBasicDetails}
                  />
                )}
                {stepIndex === 1 && (
                  <ModuleContentsDetails
                    data={modulesData}
                    onDataChange={setModulesData}
                  />
                )}
                {stepIndex === 2 && (
                  <CoursePriceDetail
                    data={pricingData}
                    onDataChange={setPricingData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCourseCreationStore } from 'src/store/course-creation.store';
import { useCommunityStore } from 'src/store/community.store';
import { useToastStore } from 'src/store/toast.store';
import { coursesService } from 'src/axios/courses/coursesApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import MobileCourseHeader from 'src/components/mobile/create-course/MobileCourseHeader';
import MobileCourseBasicDetails from 'src/components/mobile/create-course/MobileCourseBasicDetails';
import MobileCourseModulesContent from 'src/components/mobile/create-course/MobileCourseModulesContent';
import MobileCoursePricing from 'src/components/mobile/create-course/MobileCoursePricing';
import { FileUploadPayload } from 'src/types/uploads.types';

const steps = [
  { id: 'basic', label: 'Basic info' },
  { id: 'modules', label: 'Modules & Content' },
  { id: 'pricing', label: 'Pricing' },
];

export default function MobileCreateCoursePage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  // Validation functions
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
    return true;
  };

  const validateModules = (): boolean => {
    if (!modulesData.modules.length) {
      showToast({ title: 'Add at least one module', type: 'default-error' });
      return false;
    }
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

  // API handlers
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
        isActive: false,
        banner: basicDetails.bannerData ? [basicDetails.bannerData] : undefined,
        images: basicDetails.thumbnailData
          ? [basicDetails.thumbnailData]
          : undefined,
      };

      const response = await coursesService.createCourse(
        community.id,
        courseData,
      );

      if (response?.data?.course?.id) {
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
    if (!community?.id || !courseId) {
      showToast({
        title: 'Please complete the basic details step first',
        type: 'default-error',
      });
      return;
    }

    setIsLoading(true);
    try {
      const createdModuleIds: string[] = [];

      // Create all modules
      for (let i = 0; i < modulesData.modules.length; i++) {
        const moduleItem = modulesData.modules[i];
        const moduleData = {
          name: moduleItem.name,
          description: moduleItem.description,
          duration: moduleItem.duration,
          order: i + 1,
          isActive: true,
        };

        const response = await coursesService.createModule(
          community.id,
          courseId,
          moduleData,
        );
        const moduleId = response.data?.module?.id || response.id;
        if (moduleId) {
          createdModuleIds.push(moduleId);
        }
      }

      // Create lessons for each module
      for (let i = 0; i < modulesData.modules.length; i++) {
        const moduleItem = modulesData.modules[i];
        const moduleId = createdModuleIds[i];

        if (!moduleId) continue;

        for (let j = 0; j < moduleItem.chapters.length; j++) {
          const chapter = moduleItem.chapters[j];
          const lessonData = {
            name: chapter.name,
            description: chapter.name,
            videoFiles: [
              ...((chapter.mediaData || []) as FileUploadPayload[]),
              ...(chapter.videoEmbedUrl?.trim()
                ? [{ url: chapter.videoEmbedUrl.trim() }]
                : []),
            ] as Array<FileUploadPayload | { url: string }>,
            order: j + 1,
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
    if (!community?.id || !courseId) {
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
        isActive: true,
      };

      await coursesService.updateCourse(community.id, courseId, updateData);
      resetCourseCreation();
      setStepIndex(0);
      showToast({
        title: 'Course created successfully',
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

  // Navigation handlers
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
      return; // Don't increment step after publishing
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const goToStep = (index: number) => {
    setStepIndex(Math.max(0, Math.min(index, steps.length - 1)));
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="max-w-[500px] mx-auto min-h-screen bg-[#F6F6F6] pb-24">
      <MobileCourseHeader
        stepIndex={stepIndex}
        steps={steps}
        onStepClick={goToStep}
        onCancel={handleCancel}
      />

      <main className="mt-7 px-4">
        {stepIndex === 0 && (
          <MobileCourseBasicDetails
            data={basicDetails}
            onDataChange={setBasicDetails}
            onNext={goNext}
            isLoading={isLoading}
          />
        )}
        {stepIndex === 1 && (
          <MobileCourseModulesContent
            data={modulesData}
            onDataChange={setModulesData}
            onNext={goNext}
            onBack={goBack}
            isLoading={isLoading}
          />
        )}
        {stepIndex === 2 && (
          <MobileCoursePricing
            data={pricingData}
            onDataChange={setPricingData}
            onPublish={goNext}
            onBack={goBack}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}

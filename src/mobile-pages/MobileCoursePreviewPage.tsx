'use client';
import React from 'react';
import CoursePreviewHero from 'src/components/mobile/course-preview/Hero';
import CoursePreviewHeader from 'src/components/mobile/course-preview/Header';
import MetaChips from 'src/components/mobile/course-preview/MetaChips';
import LearnList from 'src/components/mobile/course-preview/LearnList';
import AccordionV3 from 'src/components/mobile/course-preview/AccordionV3';
import Button from 'src/components/mobile/common/ui/Button';
import { Module } from 'src/types/courses.types';
import { formatCourseDate } from 'src/utils/formatDate';
import { SucessModal } from 'src/components/modals/SucessModal';
import { FailureModal } from 'src/components/modals/FailureModal';
import { useCoursePreview } from 'src/hooks/useCoursePreview';

interface MobileCoursePreviewPageProps {
  highlights: string[];
  courseSlug: string;
}

export default function MobileCoursePreviewPage({
  highlights,
  courseSlug,
}: MobileCoursePreviewPageProps) {
  const {
    loading,
    isProcessingPayment,
    showSuccessModal,
    setShowSuccessModal,
    showFailureModal,
    setShowFailureModal,
    course,
    initializeRazorpayCoursePayment,
  } = useCoursePreview(courseSlug);
  // Convert Course modules to AccordionV3 format
  const formatModules = (modules?: Module[]) => {
    if (!modules) return [];
    return modules.map((module, index) => ({
      title: `Module ${index + 1}: ${module.name || 'Untitled Module'}`,
      durationText: module.duration || 'TBD',
      description: module.description,
      lessons: module.lessons?.map((lesson) => ({
        title: lesson.name || 'Untitled Lesson',
        ctaText: 'Start',
      })),
      defaultOpen: index === 0,
    }));
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-[480px] min-h-dvh px-4 pb-24 flex items-center justify-center">
        <div className="text-center text-text-secondary">Loading course...</div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="mx-auto max-w-[480px] min-h-dvh px-4 pb-24 flex items-center justify-center">
        <div className="text-center text-text-secondary">Course not found</div>
      </main>
    );
  }
  const totalLessons = course.modules?.reduce(
    (acc, module) => acc + (module?.lessons?.length || 0),
    0,
  );

  return (
    <>
      <main className="mx-auto max-w-[480px] min-h-dvh px-4 pb-24 space-y-7">
        <div className="flex flex-col gap-4 p-5 border rounded-[20px] bg-[#F6F6F6]">
          <CoursePreviewHero
            imageSrc={
              (course.images && course.images[0]) ||
              (course.banner && course.banner[0]) ||
              '/thumbnail.jpg'
            }
            ratingText={`${course.rating || 5}/5`}
          />

          <CoursePreviewHeader
            courseName={course.name || 'Untitled Course'}
            author={`${course.user?.firstName || ''} ${course.user?.lastName || ''}`.trim()}
            description={course.description || ''}
            price={`${course.currency || '$'}${course.price || 0}`}
            showActions
          />

          <Button
            variant="primary"
            size="lg"
            className="text-sm"
            fullWidth
            onClick={initializeRazorpayCoursePayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? 'Processing...' : 'Buy Now'}
          </Button>

          <MetaChips
            items={[
              {
                label: 'Published on',
                value:
                  formatCourseDate(
                    (course.publishedAt as unknown as string) || null,
                  ) || 'TBD',
                imageSrc: '/calendarBlue.svg',
              },
              {
                label: 'Rating',
                value: `${course.rating || 5}/5`,
                imageSrc: '/starBlue.svg',
              },
              {
                label: 'Duration',
                value: course.duration || 'TBD',
                imageSrc: '/clockBlue.svg',
              },
              {
                label: 'Level',
                value: course.level || 'Beginner',
                imageSrc: '/BarchartBlue.svg',
              },
              {
                label: 'Modules',
                value: String(course.modules?.length || 0),
                imageSrc: '/noteBlue.svg',
              },
              {
                label: 'Lessons',
                value: String(totalLessons || 0),
                imageSrc: '/playBlue.svg',
              },
            ]}
          />
        </div>

        {highlights.length > 0 && (
          <section>
            <h2 className="text-base font-medium text-text-secondary mb-4">
              What you&apos;ll learn?
            </h2>
            <LearnList items={highlights} />
          </section>
        )}

        {course.modules && course.modules.length > 0 && (
          <section>
            <h2 className="text-base font-medium text-text-secondary mb-4">
              Course Content
            </h2>
            <AccordionV3 modules={formatModules(course.modules)} />
          </section>
        )}

        {course.description && (
          <section>
            <h2 className="text-base font-medium text-text-secondary mb-4">
              Description
            </h2>
            <p className="text-sm font-medium">{course.description}</p>
          </section>
        )}
      </main>

      {/* Success Modal */}
      <SucessModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        title="Payment Successful!"
        message={`Thank you for purchasing "${course.name}". You now have access to this course.`}
        redirectMessage="You'll be redirected to the course in"
        onOpenChange={(open) => {
          setShowSuccessModal(open);
        }}
      />

      {/* Failure Modal */}
      <FailureModal
        open={showFailureModal}
        setOpen={setShowFailureModal}
        title="Payment Failed"
        message="Your payment could not be processed. Please try again or contact support if the issue persists."
        onOpenChange={(open) => {
          setShowFailureModal(open);
        }}
      />
    </>
  );
}

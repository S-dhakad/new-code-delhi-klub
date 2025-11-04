'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from 'src/components/ui/card';
import { Button } from 'src/components/ui/button';
import { Badge } from 'src/components/ui/badge';
import { Play, Check } from 'lucide-react';
import CourseAccordion from 'src/components/courses/CourseAccordion';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatCourseDate } from 'src/utils/formatDate';
import { SucessModal } from 'src/components/modals/SucessModal';
import { FailureModal } from 'src/components/modals/FailureModal';
import { useIsMobile } from 'src/hooks/useIsMobile';
import MobileCoursePreviewPage from 'src/mobile-pages/MobileCoursePreviewPage';
import { useCoursePreview } from 'src/hooks/useCoursePreview';

export default function CourseDetailsPage() {
  const isMobile = useIsMobile();
  const params = useParams();

  const {
    loading,
    isProcessingPayment,
    showSuccessModal,
    setShowSuccessModal,
    showFailureModal,
    setShowFailureModal,
    course,
    initializeRazorpayCoursePayment,
  } = useCoursePreview(params.slug as string);

  // Render mobile version
  if (isMobile) {
    return (
      <MobileCoursePreviewPage
        highlights={course?.learningOutcomes || []}
        courseSlug={params.slug as string}
      />
    );
  }

  return (
    <div className="bg-[#F6F6F6]">
      <div className="border-b">
        <div className="container">
          <div className="pt-[35px] pb-5">
            <h1 className="text-xl font-semibold text-[#000000]">Classroom</h1>
          </div>
        </div>
      </div>
      {course && !loading ? (
        <div className="container">
          <div className="py-[30px] lg:px-12">
            <div className="text-sm font-semibold text-[#787878] mb-5 flex items-center">
              <Link className="text-[#787878" href="/courses">
                All Courses
              </Link>
              <span className="mx-1">
                <Image
                  src="/rightArrow.svg"
                  alt="arrow icon"
                  width={8}
                  height={16}
                />
              </span>
              <span className="font-semibold text-[#000000]">
                {course?.name}
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* left column: full width on mobile, fixed on large */}
              <div className="w-full lg:w-[400px]">
                <Card className="rounded-2xl overflow-hidden p-5 gap-0 bg-transparent">
                  <div className="relative h-[171px] w-full">
                    <Image
                      src={`${course?.images?.[0] || '/cardImage1.jpg'}`}
                      alt={`${course?.name}`}
                      fill
                      className="object-cover rounded-[20px]"
                    />

                    <div className="absolute left-4 top-4 inline-flex items-center gap-2 bg-white/95 px-3 py-1 rounded-full shadow">
                      <Play size={14} className="text-blue-600 fill-blue-600" />
                      <span className="text-sm font-medium">Preview</span>
                    </div>
                  </div>

                  <CardContent className="pt-4 px-0">
                    <h2 className="text-xl font-semibold text-[#000000] mb-1">
                      {course?.name}
                    </h2>
                    <p className="text-sm font-medium text-[#000000] mb-3">
                      Author:{' '}
                      <a
                        href="#"
                        className="text-sm font-semibold text-[#0A5DBC]"
                      >
                        {course?.user?.firstName} {course?.user?.lastName}
                      </a>
                    </p>

                    <p className="text-[15px] text-[#787878] font-semibold mb-3">
                      {course?.description}
                    </p>

                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-xl font-bold text-[#000000]">
                        {course?.currency} {course?.price}
                      </div>
                      <div className="text-sm font-semibold text-[#787878] line-through">
                        {course?.currency} 2332
                      </div>
                      <Badge className="ml-auto text-[#0D906B] bg-[#13B1841A] py-[6px] px-2 rounded-[9px] text-xs font-semibold">
                        50% off
                      </Badge>
                    </div>

                    <Button
                      onClick={initializeRazorpayCoursePayment}
                      disabled={isProcessingPayment}
                      className="w-full rounded-[15px] bg-[#0A5DBC] text-sm font-medium text-white disabled:opacity-50 h-11 transition-colors duration-300 hover:bg-[#053875]"
                    >
                      {isProcessingPayment ? 'Processing...' : 'Buy now'}
                    </Button>

                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <Image
                          src="/calendarBlue.svg"
                          alt="play icon"
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className="text-xs text-[#787878] font-medium">
                            Published on
                          </p>
                          <p className="text-sm font-semibold text-[#000000] mt-1">
                            {formatCourseDate(
                              (course?.publishedAt as unknown as string) ||
                                null,
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <Image
                          src="/starBlue.svg"
                          alt="play icon"
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className="text-xs text-[#787878] font-medium">
                            Rating
                          </p>
                          <p className="text-sm font-semibold text-[#000000] mt-1">
                            5
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <Image
                          src="/clockBlue.svg"
                          alt="play icon"
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className="text-xs text-[#787878] font-medium">
                            Duration
                          </p>
                          <p className="text-sm font-semibold text-[#000000] mt-1">
                            {course?.duration}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <Image
                          src="/BarchartBlue.svg"
                          alt="play icon"
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className="text-xs text-[#787878] font-medium">
                            Level
                          </p>
                          <p className="text-sm font-semibold text-[#000000] mt-1">
                            {course?.level}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <Image
                          src="/noteBlue.svg"
                          alt="play icon"
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className="text-xs text-[#787878] font-medium">
                            Modules
                          </p>
                          <p className="text-sm font-semibold text-[#000000] mt-1">
                            {course?.modules?.length}
                          </p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                        <Image
                          src="/playBlue.svg"
                          alt="play icon"
                          width={18}
                          height={18}
                        />
                        <div>
                          <p className="text-xs text-[#787878] font-medium">
                            Lectures
                          </p>
                          <p className="text-sm font-semibold text-[#000000] mt-1">
                            {course?.modules?.reduce(
                              (acc, module) =>
                                acc + (module?.lessons?.length || 0),
                              0,
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* right column: grows to fill remaining space */}
              <div className="flex-1">
                <div>
                  <h2 className="text-base font-semibold text-[#787878]">
                    What you will learn
                  </h2>
                  <Card className="rounded-2xl mt-4 p-0">
                    <CardContent className="p-5">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {course?.learningOutcomes?.map((h) => (
                          <li key={h} className="flex items-start gap-2">
                            <Check
                              className="text-blue-600"
                              width={18}
                              height={18}
                            />
                            <p className="text-sm font-semibold text-black">
                              {h}
                            </p>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-4">
                  <h2 className="text-base font-semibold text-[#787878] mb-4">
                    Course content
                  </h2>
                  <Card className="rounded-2xl bg-transparent py-0">
                    <CardContent className="p-0">
                      <CourseAccordion modules={course?.modules} />
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container">Loading</div>
      )}

      {/* Success Modal */}
      <SucessModal
        open={showSuccessModal}
        setOpen={setShowSuccessModal}
        title="Payment Successful!"
        message={`Thank you for purchasing "${course?.name}". You now have access to this course.`}
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
    </div>
  );
}

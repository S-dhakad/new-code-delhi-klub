'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import ModuleSidebar from 'src/components/courses/ModuleSidebar';
import { useRouter } from 'next/navigation';

export default function CoursePage() {
  const router = useRouter();
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
              <Button className="rounded-2xl border bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 py-1 w-full lg:w-auto">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-28 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:block lg:w-[390px]">
            <ModuleSidebar />
          </div>

          <div className="flex-1 space-y-6 w-full">
            <h2 className="text-lg font-semibold">
              Chapter 3: LLM is & Training
            </h2>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <div className="relative w-full h-[220px] lg:h-[360px]">
                  <Image
                    src="/trainingImage1.jpg"
                    alt="Instructor"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                      <Image
                        src="/playIcon.svg"
                        alt="play icon"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <div className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                <div className="relative w-full h-[220px] lg:h-[360px]">
                  <Image
                    src="/trainingImage2.jpg"
                    alt="Instructor"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/80 flex items-center justify-center">
                      <Image
                        src="/playIcon.svg"
                        alt="play icon"
                        width={32}
                        height={32}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

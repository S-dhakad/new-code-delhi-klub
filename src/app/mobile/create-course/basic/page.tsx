'use client';

import React, { useState } from 'react';
import Image from 'next/image';
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

export default function BasicInfoPage() {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner',
    language: '',
    price: '',
    thumbnail: null as File | null,
  });

  const learningPoints = [
    'Step-wise learning on AI + no-code automation',
    'Point 2',
    'Point 3',
  ];

  return (
    <>
      {/* Step name */}
      <div className="px-4 mt-7">
        <h1 className="text-2xl font-semibold">Step 1: Basic Details</h1>
        <p className="text-sm font-medium text-text-secondary mt-4">
          Mention all info needed to describe your course
        </p>
      </div>

      {/* Main Content */}
      <main className="mt-7 px-4">
        <div className="px-4 py-5 space-y-5 bg-white rounded-[20px]">
          {/* Course Title */}
          <FieldSection
            title="Course Title"
            description="Display name for the course"
          >
            <Input type="text" placeholder="Enter course title" />
          </FieldSection>

          {/* Bio */}
          <FieldSection title="Bio" description="One-liner about the course">
            <TextArea placeholder="Enter bio" rows={2} />
          </FieldSection>

          {/* Description */}
          <FieldSection
            title="Description"
            description="Detailed overlook of the course"
          >
            <TextArea placeholder="Enter description" rows={4} />
          </FieldSection>

          {/* Course Difficulty */}
          <FieldSection
            title="Course Difficulty"
            description="Where are you based"
          >
            <Select
              value={courseData.level}
              onValueChange={(val) =>
                setCourseData((prev) => ({ ...prev, level: val }))
              }
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

          {/* Tags */}
          <FieldSection
            title="Tags"
            description="Make it easier to look for your course"
          >
            <div className="rounded-[20px] border p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {['AI Automation', 'AI Tools', 'AI Jobs'].map((tag, index) => (
                  <div
                    key={index}
                    className="text-sm font-medium px-2 py-1.5 bg-[#F6F6F6] rounded-[10px] border whitespace-nowrap"
                  >
                    <span className="text-primary"># </span>
                    <span>{tag}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="px-2.5 py-1.5 text-sm font-medium"
                >
                  + Add new
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1.5 bg-white px-2.5 py-1.5 text-sm font-medium"
                >
                  <Image src="/edit-2.svg" alt="edit" width={16} height={16} />
                  Edit
                </Button>
              </div>
            </div>
          </FieldSection>

          {/* What you'll learn */}
          <FieldSection
            title="What will your subscribers learn?"
            description={`Show under the "What you'll learn" section`}
          >
            <div className="flex flex-col gap-3 rounded-2xl border p-4">
              {learningPoints.map((point, index) => (
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
                  <span className="text-sm font-medium">{point}</span>
                  <X className="ml-auto w-4 h-4 text-[#DE0000] flex-shrink-0" />
                </div>
              ))}
              <Button
                variant="primary"
                size="sm"
                className="w-fit px-2.5 py-1.5 text-sm font-medium"
              >
                + Add new
              </Button>
            </div>
          </FieldSection>

          {/* Thumbnail */}
          <FieldSection
            title="Course Thumbnail"
            description="Your display picture"
          >
            <div className="flex items-center gap-4">
              <Image
                src="/headerProfile.jpg"
                alt="Profile"
                width={130}
                height={130}
                className="flex-shrink h-[130px] w-[130px] rounded-2xl object-cover"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="">
                    + Upload new
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[#DE0000]"
                  >
                    Remove
                  </Button>
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
            description="A brief intro to your course"
          >
            <div>
              <div className="mt-5 flex items-center gap-2">
                <Button size="sm" variant="outline" className="">
                  + Upload new
                </Button>
                <Button size="sm" variant="outline" className="text-[#DE0000]">
                  Remove
                </Button>
              </div>
              <div className="mt-2 text-xs font-medium text-text-secondary">
                JPG, PNG or video
              </div>
            </div>
          </FieldSection>
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-7">
          <Button
            variant="secondary"
            size="sm"
            className="font-semibold bg-white"
          >
            Go Back
          </Button>
          <Button size="sm" className="font-semibold">
            Save & Next
          </Button>
        </div>
      </main>
    </>
  );
}

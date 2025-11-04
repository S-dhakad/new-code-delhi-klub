'use client';

import Image from 'next/image';
import React from 'react';
import Button from 'src/components/mobile/common/ui/Button';
import Input, { TextArea } from 'src/components/mobile/common/ui/Input';
import FieldSection from 'src/components/mobile/create-course/FieldSection';

export default function ModulesContentPage() {
  return (
    <>
      <div className="px-4 mt-7">
        <h1 className="text-2xl font-semibold">Step 2: Modules & Content</h1>
        <p className="text-sm font-medium text-text-secondary mt-4">
          Lets setup & structure all modules and content for your Subscribers
        </p>
      </div>

      <main className="mt-7 px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Course Modules</h1>
          <Button size="sm" className="font-semibold rounded-2xl">
            + Add Module
          </Button>
        </div>
        <div className="mt-5 px-4 py-5 space-y-5 bg-white rounded-[20px]">
          {/* Module Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2.5 items-center">
              <Button variant="secondary" size="sm">
                <Image src="/menu.svg" alt="menu" width={16} height={16} />
              </Button>
              <Button variant="secondary" size="sm">
                Module 1
              </Button>
            </div>
            <Button variant="secondary" size="sm">
              <Image src="/delete.svg" alt="delete" width={16} height={16} />
            </Button>
          </div>

          {/* Name of Module */}
          <FieldSection
            title="Name of Module"
            description="Used to define your course ModulesContentPage"
          >
            <Input type="text" placeholder="Enter module name" />
          </FieldSection>

          {/* Description of Module */}
          <FieldSection
            title="Description of Module"
            description="What will the students learn in the course"
          >
            <TextArea placeholder="Enter module description" rows={4} />
          </FieldSection>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Chapters(1)</h1>
          <Button size="sm" className="font-semibold rounded-2xl">
            + Add Chapter
          </Button>
        </div>
        <div className="mt-5 px-4 py-5 space-y-5 bg-white rounded-[20px]">
          {/* Chapter Header */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2.5 items-center">
              <Button variant="secondary" size="sm">
                <Image src="/menu.svg" alt="menu" width={16} height={16} />
              </Button>
              <Button variant="secondary" size="sm">
                Chapter 1
              </Button>
            </div>
            <Button variant="secondary" size="sm">
              <Image src="/delete.svg" alt="delete" width={16} height={16} />
            </Button>
          </div>

          {/* Add a Chapter */}
          <FieldSection
            title="Add a Chapter"
            description="All your content & videos here"
          >
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2">
                Chapter name
              </h4>
              <Input type="text" placeholder="Enter chapter name" />
            </div>
          </FieldSection>

          {/* Have to add videos here */}
        </div>

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

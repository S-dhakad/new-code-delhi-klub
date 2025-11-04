'use client';

import React from 'react';
import Button from 'src/components/mobile/common/ui/Button';
import FieldSection from 'src/components/mobile/create-course/FieldSection';
import Input from 'src/components/mobile/common/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';

export default function PricingPage() {
  return (
    <>
      <div className="px-4 mt-7">
        <h1 className="text-2xl font-semibold">Step 3: Pricing</h1>
        <p className="text-sm font-medium text-text-secondary mt-4">
          Lets setup the price for your course
        </p>
      </div>

      <main className="mt-7 px-4">
        <div className="px-4 py-5 space-y-5 bg-white rounded-[20px]">
          {/* Course Type */}
          <FieldSection
            title="Course Type"
            description="Is this course free or paid?"
          >
            <Select>
              <SelectTrigger className="rounded-2xl w-full justify-between font-medium text-sm">
                <SelectValue placeholder="Select course type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </FieldSection>

          {/* Course Price */}
          <FieldSection title="Price" description="Display name for the course">
            <Input type="number" placeholder="Enter price" />
          </FieldSection>
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
            Publish Course
          </Button>
        </div>
      </main>
    </>
  );
}

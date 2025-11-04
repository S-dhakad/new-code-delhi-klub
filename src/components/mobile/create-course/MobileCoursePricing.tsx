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

interface PricingData {
  courseType: 'paid' | 'free';
  price: string;
}

interface MobileCoursePricingProps {
  data: PricingData;
  onDataChange: (data: PricingData) => void;
  onPublish: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export default function MobileCoursePricing({
  data,
  onDataChange,
  onPublish,
  onBack,
  isLoading,
}: MobileCoursePricingProps) {
  const updateField = (field: keyof PricingData, value: string) => {
    onDataChange({ ...data, [field]: value });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-semibold">Step 3: Pricing</h1>
        <p className="text-sm font-medium text-text-secondary mt-4">
          Lets setup the price for your course
        </p>
      </div>

      <div className="mt-7">
        <div className="px-4 py-5 space-y-5 bg-white rounded-[20px]">
          {/* Course Type */}
          <FieldSection
            title="Course Type"
            description="Is this course free or paid?"
          >
            <Select
              value={data.courseType}
              onValueChange={(val) =>
                updateField('courseType', val as 'paid' | 'free')
              }
            >
              <SelectTrigger className="rounded-2xl w-full justify-between font-medium text-sm">
                <SelectValue placeholder="Select course type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </FieldSection>

          {/* Course Price - only show if paid */}
          {data.courseType === 'paid' && (
            <FieldSection
              title="Price"
              description="Set the price for your course"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">₹</span>
                <Input
                  type="number"
                  placeholder="Enter price"
                  value={data.price}
                  onChange={(e) => updateField('price', e.target.value)}
                />
              </div>
            </FieldSection>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex justify-between items-center mt-7 mb-8">
          <Button
            variant="secondary"
            size="sm"
            className="font-semibold bg-white"
            onClick={onBack}
          >
            Go Back
          </Button>
          <Button
            size="sm"
            className="font-semibold"
            onClick={onPublish}
            disabled={isLoading}
          >
            {isLoading ? 'Publishing...' : 'Publish Course'}
          </Button>
        </div>
      </div>
    </>
  );
}

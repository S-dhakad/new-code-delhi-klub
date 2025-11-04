'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Button from 'src/components/mobile/common/ui/Button';

interface Step {
  id: string;
  label: string;
}

interface MobileCourseHeaderProps {
  stepIndex: number;
  steps: Step[];
  onStepClick: (index: number) => void;
  onCancel: () => void;
}

export default function MobileCourseHeader({
  stepIndex,
  steps,
  onStepClick,
  onCancel,
}: MobileCourseHeaderProps) {
  return (
    <>
      {/* Header */}
      <div className="top-0 z-10 border-b px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">Create a course</h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white p-4 text-sm font-semibold rounded-[15px]"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 px-4 pt-4 pb-2 text-sm font-semibold bg-[#F6F6F6]">
        <span className="text-text-secondary">All courses</span>
        <span className="text-text-secondary">{'>'}</span>
        <span>Create a course</span>
      </div>

      {/* Steps with horizontal scroll */}
      <div className="w-full overflow-x-auto py-5 px-4 scrollbar-hide border-b bg-[#F6F6F6]">
        <div className="flex items-center min-w-max">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex-shrink-0">
                <Button
                  variant="outline"
                  className={`h-10 flex items-center gap-2 text-base font-medium whitespace-nowrap py-2 px-5 rounded-[15px] ${
                    stepIndex === index
                      ? 'border-primary bg-blue-50 text-primary'
                      : stepIndex > index
                        ? 'bg-white'
                        : 'bg-white text-text-secondary'
                  } ${index > stepIndex ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => {
                    // Only allow clicking on current or completed steps
                    if (index <= stepIndex) {
                      onStepClick(index);
                    }
                  }}
                  disabled={index > stepIndex}
                >
                  <Image
                    src={
                      stepIndex >= index
                        ? '/tick-square-active.svg'
                        : '/tick-square-inactive.svg'
                    }
                    alt={stepIndex >= index ? 'step completed' : 'step pending'}
                    width={18}
                    height={18}
                  />
                  {step.label}
                </Button>
              </div>
              {/* Connecting line between steps */}
              {index < steps.length - 1 && (
                <div className="h-[2px] w-4 bg-[#DADADA] flex-shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}

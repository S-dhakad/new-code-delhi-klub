'use client';
import React, { useState } from 'react';
import { Card, CardContent } from 'src/components/ui/card';
import { Input } from 'src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';

interface CoursePriceDetailProps {
  data: {
    courseType: 'paid' | 'free';
    price: string;
  };
  onDataChange: (data: Partial<CoursePriceDetailProps['data']>) => void;
}

export default function CoursePriceDetail({
  data,
  onDataChange,
}: CoursePriceDetailProps) {
  const [title, setTitle] = useState(data.price);
  const [difficulty, setDifficulty] = useState(data.courseType);

  // Sync with store data
  React.useEffect(() => {
    setTitle(data.price);
    setDifficulty(data.courseType);
  }, [data]);

  // Update store when local state changes
  React.useEffect(() => {
    onDataChange({
      courseType: difficulty as 'paid' | 'free',
      price: title,
    });
  }, [title, difficulty, onDataChange]);

  return (
    <Card className="rounded-[20px] py-0 border-0">
      <CardContent className="py-6 lg:py-8 px-4 lg:px-10">
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
            <div className="flex-1 min-w-[200px]">
              <div className="text-base font-semibold text-[#000000]">
                Course Type
              </div>
              <div className="text-sm font-medium text-[#787878]">
                Is the course free or paid?
              </div>
            </div>
            <div className="w-full lg:w-[495px]">
              <Select
                value={difficulty}
                onValueChange={(v) => setDifficulty(v as 'paid' | 'free')}
              >
                <SelectTrigger
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium w-full"
                  style={{ height: '40px' }}
                >
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="free">Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-20">
            <div className="flex-1 min-w-[200px]">
              <div className="text-base font-semibold text-[#000000]">
                Price
              </div>
              <div className="text-sm font-medium text-[#787878]">
                Display name for the course
              </div>
            </div>

            <div className="w-full lg:w-[495px]">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                placeholder="Automation on Autopilot"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

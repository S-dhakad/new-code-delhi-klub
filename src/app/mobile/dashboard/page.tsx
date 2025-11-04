'use client';

import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import { CourseSelector } from 'src/components/dashboard/CourseSelector';
import { DashboardTable } from 'src/components/dashboard/DashboardTable';
import { StatsGrid } from 'src/components/dashboard/StatsGrid';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'src/components/ui/tabs';
import { Course } from 'src/types/courses.types';

const DashboardMobile = () => {
  // Dummy state and data
  const [selected, setSelected] = useState<Course>({
    id: '1',
    name: 'React Basics',
    isActive: true,
    images: [],
  });

  const statsSubscription = [
    { label: 'Active Members', value: 42 },
    { label: 'Expired', value: 5 },
    { label: 'Pending Renewals', value: 3 },
  ];

  const subscriptionsReported = [
    { id: 1, name: 'John Doe', status: 'Active', plan: 'Pro' },
    { id: 2, name: 'Jane Smith', status: 'Expired', plan: 'Basic' },
    { id: 3, name: 'Michael Johnson', status: 'Active', plan: 'Premium' },
  ];

  const courses: Course[] = [
    { id: '1', name: 'React Basics', isActive: true, images: [] },
    { id: '2', name: 'Next.js Advanced', isActive: false, images: [] },
    { id: '3', name: 'Node.js Mastery', isActive: true, images: [] },
  ];

  const subscriptionStats = [
    { label: 'Total Subscribers', value: 186 },
    { label: 'Active Subscribers', value: 3 },
    { label: 'Retention', value: 102 },
  ];

  const courseStats = [
    { label: 'Total Purchases', value: 186 },
    { label: 'Total Revenue (in Rs)', value: 3 },
  ];

  const dashboardCourses = [
    {
      user: { firstName: 'Amit', lastName: 'Kumar' },
      subscription: {
        paymentDate: '2025-10-15',
        length: 6,
        paidAmount: '1200',
      },
      status: 'ACTIVE',
    },
    {
      user: { firstName: 'Sneha', lastName: 'Verma' },
      subscription: {
        paymentDate: '2025-09-10',
        length: 3,
        paidAmount: '600',
      },
      status: 'ACTIVE',
    },
    {
      user: { firstName: 'Rohit', lastName: 'Sharma' },
      subscription: {
        paymentDate: '2025-07-01',
        length: 12,
        paidAmount: '2400',
      },
      status: 'INACTIVE',
    },
    {
      user: { firstName: 'Priya', lastName: 'Singh' },
      subscription: {
        paymentDate: '2025-11-01',
        length: 1,
        paidAmount: '200',
      },
      status: 'ACTIVE',
    },
    {
      user: { firstName: 'Vikram', lastName: 'Patel' },
      subscription: {
        paymentDate: '2025-08-20',
        length: 2,
        paidAmount: '0',
      },
      status: 'INACTIVE',
    },
  ];

  return (
    <Fragment>
      <header className="z-20 bg-[#F6F6F6] border-b">
        <div className="flex items-center justify-between px-4 py-[15px]">
          <h1 className="w-full text-[18px] font-semibold text-[#000000]">
            Dashboard
          </h1>
          <div className="flex items-center gap-3">
            <div className="rounded-[10px] h-11 w-11 bg-white flex items-center justify-center">
              <Image
                src="/mobile/navbar/notification.svg"
                alt="Bell"
                width={22}
                height={22}
              />
            </div>
            <div className="rounded-[10px] h-11 w-11 bg-white flex items-center justify-center">
              <Image
                src="/mobile/navbar/menu.svg"
                alt="Menu"
                width={22}
                height={22}
              />
            </div>
          </div>
        </div>
      </header>
      <Tabs defaultValue="subscriptions" className="gap-0">
        <div className="flex items-center justify-between pt-[20px] pb-[6px] px-4 border-b border-[#ECECEC] bg-[#FFFFFF]">
          <div className="max-w-[952px] w-full mx-auto">
            <TabsList className="gap-[46px] bg-transparent p-0">
              <TabsTrigger
                value="subscriptions"
                className="relative text-base font-semibold p-0 text-[#787878] data-[state=active]:text-[#0A5DBC] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-[#0A5DBC] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Subscriptions
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="relative text-base font-semibold p-0 text-[#787878] data-[state=active]:text-[#0A5DBC] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-[#0A5DBC] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Courses
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Subscriptions Tab */}
        <div>
          <TabsContent value="subscriptions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-[30px] mx-4">
              <StatsGrid stats={subscriptionStats} />
            </div>
            <div className="my-[30px]">
              <div className="flex items-center justify-between mb-3 px-4">
                <h2 className="text-base font-medium text-[#000000]">
                  Manage Members{' '}
                  <span className="font-semibold text-[#0A5DBC]">
                    ({subscriptionsReported?.length})
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto px-4">
                <DashboardTable members={dashboardCourses} />
              </div>
            </div>
          </TabsContent>
        </div>

        {/* Courses Tab */}
        <div>
          <TabsContent value="courses">
            <div className="mt-[30px] px-4">
              <CourseSelector
                selected={selected}
                courses={courses}
                onSelect={(c) => setSelected(c)}
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-[30px] mx-4">
              <StatsGrid stats={courseStats} />
            </div>
            <div className="mt-[30px]">
              <div className="flex items-center justify-between mb-3 px-4">
                <h2 className="text-base font-medium text-[#000000]">
                  Manage Purchases{' '}
                  <span className="font-semibold text-[#0A5DBC]">
                    ({dashboardCourses.length})
                  </span>
                </h2>
              </div>
              <div className="overflow-x-auto px-4">
                <DashboardTable members={dashboardCourses} />
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </Fragment>
  );
};

export default DashboardMobile;

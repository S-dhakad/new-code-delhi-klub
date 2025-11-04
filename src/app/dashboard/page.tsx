'use client';

import React, { useEffect, useState } from 'react';
import { CourseSelector } from 'src/components/dashboard/CourseSelector';
import { DashboardTable } from 'src/components/dashboard/DashboardTable';
import { StatsGrid } from 'src/components/dashboard/StatsGrid';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from 'src/components/ui/tabs';

import { useCourses } from 'src/hooks/useCourses';
import { useDashboardCourses } from 'src/hooks/useDashboardCourses';
import { useDashboardSubscriptions } from 'src/hooks/useDashboardSubscriptions';
import { useIsMobile } from 'src/hooks/useIsMobile';
import { useCommunityStore } from 'src/store/community.store';
import { Course } from 'src/types/courses.types';
import DashboardMobile from '../mobile/dashboard/page';

export default function Dashboard() {
  const { community, userCommunity } = useCommunityStore();
  const { courses, loading, error } = useCourses(community?.id);
  const [selected, setSelected] = useState<Course | null>(null);
  const isMobile = useIsMobile();

  const [statsSubscription, setstatsSubscription] = useState([
    { label: 'Total Subscribers', value: '0' },
    { label: 'Active Subscribers', value: '0' },
    { label: 'Retention', value: '95.96%' },
  ]);

  const [courseStats, setCourseStats] = useState([
    { label: 'Total Purchases', value: '0' },
    { label: 'Total Revenue (in Rs)', value: '0' },
  ]);

  const { dashboardCourses, refetch } = useDashboardCourses(
    community?.id,
    selected?.id || '',
  );

  const { subscriptionsReported } = useDashboardSubscriptions(community?.id);

  useEffect(() => {
    if (dashboardCourses) {
      const totalPurchases = dashboardCourses.length.toString();
      const totalRevenue = dashboardCourses.reduce((total, course) => {
        const subscription = course?.subscription;
        let amount = 0;

        if (Array.isArray(subscription)) {
          amount = subscription.reduce((sum, sub) => {
            return sum + (Number(sub?.paidAmount) || 0);
          }, 0);
        } else if (subscription?.paidAmount) {
          amount = Number(subscription.paidAmount) || 0;
        }

        return total + amount;
      }, 0);

      setCourseStats([
        { label: 'Total Purchases', value: totalPurchases },
        {
          label: 'Total Revenue (in Rs)',
          value: totalRevenue.toLocaleString(),
        },
      ]);
    } else {
      // Reset stats if no courses
      setCourseStats([
        { label: 'Total Purchases', value: '0' },
        { label: 'Total Revenue (in Rs)', value: '0' },
      ]);
    }
  }, [dashboardCourses]);

  useEffect(() => {
    if (subscriptionsReported) {
      const totalPurchases = subscriptionsReported.length.toString();
      const ActiveSubscribers = subscriptionsReported?.reduce(
        (total, course) => {
          const subscription = course?.subscription;
          let activeCount = 0;

          if (Array.isArray(subscription)) {
            activeCount = subscription.filter(
              (sub) => sub?.active === true || sub?.status === 'active',
            ).length;
          } else if (subscription) {
            if (
              subscription.active === true ||
              subscription.status === 'active'
            ) {
              activeCount = 1;
            }
          }

          return total + activeCount;
        },
        0,
      );

      setstatsSubscription([
        { label: 'Total Subscribers', value: totalPurchases.toString() },
        { label: 'Active Subscribers', value: ActiveSubscribers.toString() },
        { label: 'Retention', value: '95.96%' },
      ]);
    } else {
      // Reset stats if no courses
      setstatsSubscription([
        { label: 'Total Subscribers', value: '0' },
        { label: 'Active Subscribers', value: '0' },
        { label: 'Retention', value: '95.96%' },
      ]);
    }
  }, [subscriptionsReported]);

  useEffect(() => {
    if (courses && courses.length > 0 && !selected?.id) {
      setSelected(courses[0]);
    } else {
      refetch();
    }
  }, [courses, selected]);

  if (isMobile) {
    return <DashboardMobile />;
  }

  return (
    <div>
      <div className="border-b border-[#ECECEC]">
        <div className="container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 sm:pt-[35px] sm:pb-[20px]">
            <h1 className="w-full sm:w-auto text-xl sm:text-xl font-semibold text-[#000000]">
              Dashboard
            </h1>
          </div>
        </div>
      </div>

      <Tabs defaultValue="subscriptions">
        <div className="flex items-center justify-between mb-[30px] mt-[30px] border-b border-[#ECECEC]">
          <div className="max-w-[952px] w-full mx-auto">
            <TabsList className="gap-[46px] bg-transparent">
              <TabsTrigger
                value="subscriptions"
                className="relative text-base font-semibold px-0 text-[#787878] data-[state=active]:text-[#0A5DBC] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-[#0A5DBC] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Subscriptions
              </TabsTrigger>
              <TabsTrigger
                value="courses"
                className="relative text-base font-semibold px-0 text-[#787878] data-[state=active]:text-[#0A5DBC] data-[state=active]:bg-transparent data-[state=active]:shadow-none after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-[#0A5DBC] after:scale-x-0 data-[state=active]:after:scale-x-100 after:transition-transform after:origin-left"
              >
                Courses
              </TabsTrigger>
            </TabsList>
          </div>
        </div>
        <div className="max-w-[952px] w-full mx-auto">
          <TabsContent value="subscriptions">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-[30px]">
              <StatsGrid stats={statsSubscription} />
            </div>
            <div className="mt-[30px] mb-[20px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium text-[#000000]">
                  Manage Members{' '}
                  <span className="font-semibold text-[#0A5DBC]">
                    ({subscriptionsReported?.length})
                  </span>
                </h2>
              </div>
              <DashboardTable
                members={subscriptionsReported
                  .filter((course) => course?.user && course?.subscription)
                  .map((course) => {
                    const subscription = Array.isArray(course.subscription)
                      ? course.subscription[0]
                      : course.subscription;

                    return {
                      user: {
                        firstName: course.user?.firstName || '',
                        lastName: course.user?.lastName || '',
                      },
                      subscription: {
                        paymentDate: subscription?.paymentDate || '',
                        length: subscription?.length || 1,
                        paidAmount: String(subscription?.paidAmount || 0),
                      },
                      status:
                        subscription?.status ||
                        (subscription?.active ? 'ACTIVE' : 'INACTIVE'),
                    };
                  })}
              />
            </div>
          </TabsContent>
        </div>
        <div className="max-w-[952px] w-full mx-auto">
          <TabsContent value="courses">
            {selected && (
              <CourseSelector
                selected={selected}
                courses={courses}
                onSelect={(c) => setSelected(c)}
              />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-[30px]">
              <StatsGrid stats={courseStats} />
            </div>
            <div className="mt-[30px] mb-[20px]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-medium text-[#000000]">
                  Manage Purchases{' '}
                  <span className="font-semibold text-[#0A5DBC]">(186)</span>
                </h2>
              </div>
              <DashboardTable
                members={dashboardCourses
                  .filter((course) => course?.user && course?.subscription)
                  .map((course) => {
                    const subscription = Array.isArray(course.subscription)
                      ? course.subscription[0]
                      : course.subscription;

                    return {
                      user: {
                        firstName: course.user?.firstName || '',
                        lastName: course.user?.lastName || '',
                      },
                      subscription: {
                        paymentDate: subscription?.paymentDate || '',
                        length: subscription?.length || 1,
                        paidAmount: String(subscription?.paidAmount || 0),
                      },
                      status:
                        subscription?.status ||
                        (subscription?.active ? 'ACTIVE' : 'INACTIVE'),
                    };
                  })}
              />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

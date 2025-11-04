'use client';
import React from 'react';
import TabsSwitcher from 'src/components/mobile/feed/TabsSwitcher';
import CourseCardDetailed from 'src/components/mobile/common/CourseCardDetailed';
import Link from 'next/link';

const MobileCoursesPage = () => {
  const allCoursesContent = (
    <div className="pt-7 px-4 grid grid-cols-1 gap-10 bg-[#ECECEC]">
      <Link
        href={`/mobile/courses/${encodeURIComponent('automation-on-autopilot')}`}
        className="block"
      >
        <CourseCardDetailed
          imageSrc="/thumbnail.jpg"
          title="Automation on autopilot"
          startedText="Started June, 13th, 2024"
          price={20}
          currencySymbol="$"
          ratingScore={5}
          ratingMax={5}
          description="Best for creating sales funnels that make money even in your sleep"
          tags={['AI Automation', 'Agentic AI']}
        />
      </Link>
      <Link
        href={`/mobile/courses/${encodeURIComponent('automation-on-autopilot-2')}`}
        className="block"
      >
        <CourseCardDetailed
          imageSrc="/map.jpg"
          title="Automation on autopilot"
          startedText="Started June, 13th, 2024"
          price={20}
          currencySymbol="$"
          ratingScore={5}
          ratingMax={5}
          description="Best for creating sales funnels that make money even in your sleep"
          tags={['AI Automation', 'Agentic AI']}
        />
      </Link>
    </div>
  );

  const myCoursesContent = (
    <div className="pt-7 px-4 grid grid-cols-1 gap-10 bg-[#ECECEC]">
      <CourseCardDetailed
        imageSrc="/thumbnail.jpg"
        title="Automation on autopilot"
        startedText="Started June, 13th, 2024"
        price={20}
        currencySymbol="$"
        ratingScore={5}
        ratingMax={5}
        description="Best for creating sales funnels that make money even in your sleep"
        tags={['AI Automation', 'Agentic AI']}
        progressPercent={46}
      />
      <CourseCardDetailed
        imageSrc="/map.jpg"
        title="Automation on autopilot"
        startedText="Started June, 13th, 2024"
        price={20}
        currencySymbol="$"
        ratingScore={5}
        ratingMax={5}
        description="Best for creating sales funnels that make money even in your sleep"
        tags={['AI Automation', 'Agentic AI']}
        progressPercent={72}
      />
    </div>
  );

  return (
    <main className="mx-auto max-w-[480px] min-h-dvh bg-[#ECECEC] pb-24">
      <TabsSwitcher
        defaultIndex={0}
        items={[
          { title: 'All Courses', number: '06', component: allCoursesContent },
          { title: 'My Courses', number: '02', component: myCoursesContent },
        ]}
      />
    </main>
  );
};

export default MobileCoursesPage;

import React from 'react';
import CoursePreviewHero from 'src/components/mobile/course-preview/Hero';
import CoursePreviewHeader from 'src/components/mobile/course-preview/Header';
import MetaChips from 'src/components/mobile/course-preview/MetaChips';
import LearnList from 'src/components/mobile/course-preview/LearnList';
import AccordionV3 from 'src/components/mobile/course-preview/AccordionV3';
import Button from 'src/components/mobile/common/ui/Button';

export default function MobileCoursePreview({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="mx-auto max-w-[480px] min-h-dvh px-4 pb-24 space-y-7">
      <div className="flex flex-col gap-4 p-5 border rounded-[20px] bg-[#F6F6F6]">
        <CoursePreviewHero imageSrc="/thumbnail.jpg" ratingText="5/5" />

        <CoursePreviewHeader
          courseName="Ai Foundations"
          author="Paula Agard"
          description="Best for creating sales funnels that make money even in your sleep"
          price="$99"
          showActions
        />

        <Button variant="primary" size="lg" className="text-sm" fullWidth>
          Buy Now
        </Button>

        <MetaChips
          items={[
            {
              label: 'Published on',
              value: 'July 16th, 2025',
              imageSrc: '/calendarBlue.svg',
            },
            { label: 'Rating', value: '4.8/5', imageSrc: '/starBlue.svg' },
            { label: 'Duration', value: '3h 45m', imageSrc: '/clockBlue.svg' },
            {
              label: 'Level',
              value: 'Beginner',
              imageSrc: '/BarchartBlue.svg',
            },
            { label: 'Modules', value: '6', imageSrc: '/noteBlue.svg' },
            { label: 'Lessons', value: '18', imageSrc: '/playBlue.svg' },
          ]}
        />
      </div>

      <section>
        <h2 className="text-base font-medium text-text-secondary mb-4">
          What you&apos;ll learn?
        </h2>
        <LearnList
          items={[
            'Step-wise learning on AI + no-code automation',
            'Real-world workflow from lead gen to service delivery',
            'Live projects to build your own AI systems',
            'Tools: Zapier, Make, Notion, Airtable, GPT and more',
            'Pre-built automation blueprints to plug & play',
            'Weekly office hours and expert Q&A sessions',
          ]}
        />
      </section>

      <section>
        <h2 className="text-base font-medium text-text-secondary mb-4">
          Course Content
        </h2>
        <AccordionV3
          modules={[
            {
              title: 'Module 1: Understanding AI',
              durationText: '28m to complete',
              description:
                "Get a clear, beginner-friendly breakdown of what AI really is—and what it's not. This module covers core concepts like machine learning, large language models (LLMs), and how AI systems ‘think’ and make decisions.",
              lessons: [
                { title: 'Origination of AI', ctaText: 'Start' },
                { title: 'Origination of AI', ctaText: 'Start' },
              ],
              defaultOpen: true,
            },
            {
              title: 'Module 2: Types of AI',
              durationText: '38m to complete',
              description:
                'Not all AI is created equal. In this module, you’ll explore the different types of artificial intelligence—from simple rule-based systems to advanced generative models. Understanding these distinctions will help you choose the right kind of AI for the task at hand, whether it’s automation, content creation, or decision-making.',
              lessons: [
                { title: 'Narrow AI vs General AI', ctaText: 'Start' },
                { title: 'Rule-Based vs Learning-Based AI', ctaText: 'Start' },
                { title: 'Generative AI & LLMs', ctaText: 'Start' },
              ],
            },
            {
              title: 'Module 3: Popular Automation Tools',
              durationText: '28m to complete',
            },
            {
              title: 'Module 4: Creating basic workflows',
              durationText: '1h & 40m to complete',
            },
            {
              title: 'Module 5: Automating tasks with AI',
              durationText: '40m to complete',
            },
            {
              title: 'Module 6: Publishing your workflows',
              durationText: '1h & 25m to complete',
            },
          ]}
        />
      </section>

      <section>
        <h2 className="text-base font-medium text-text-secondary mb-4">
          Description
        </h2>
        <p className="text-sm font-medium">
          Automation on Autopilot with AI is a hands-on course designed to equip
          you with the skills to build intelligent, self-operating systems using
          AI and no-code tools. Whether you&apos;re a founder, freelancer,
          business operator, or simply looking to free yourself from repetitive
          tasks, this course walks you through the practical steps to automate
          workflows and build AI-powered agents that work for you—24/7.
        </p>
      </section>
    </main>
  );
}

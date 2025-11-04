'use client';

import React, { useMemo, useState } from 'react';
import Button from 'src/components/mobile/common/ui/Button';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';

type Module = {
  id: number;
  title: string;
  completed: boolean; // whole module completed
  chapters: { id: number; title: string; completed: boolean }[];
};

const MobileCourseProgressPage = () => {
  const [openId, setOpenId] = useState<number | null>(3); // module 3 open like screenshot

  const modules: Module[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Module 1',
        completed: true,
        chapters: [
          { id: 1, title: 'Intro', completed: true },
          { id: 2, title: 'Setup', completed: true },
        ],
      },
      {
        id: 2,
        title: 'Module 2',
        completed: true,
        chapters: [
          { id: 1, title: 'Basics', completed: true },
          { id: 2, title: 'Deep Dive', completed: false },
        ],
      },
      {
        id: 3,
        title: 'Module 3',
        completed: false,
        chapters: [
          { id: 1, title: 'Types of AI', completed: true },
          { id: 2, title: 'History', completed: true },
        ],
      },
      { id: 4, title: 'Module 4', completed: false, chapters: [] },
      { id: 5, title: 'Module 5', completed: false, chapters: [] },
      { id: 6, title: 'Module 6', completed: false, chapters: [] },
    ],
    [],
  );

  const totalModules = modules.length;
  const completedModules = modules.filter((m) => m.completed).length;

  return (
    <div className="max-w-[420px] mx-auto min-h-screen bg-[#F6F6F6]">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 p-4 text-sm font-semibold">
        All courses
        <span>{'>'}</span>
        Create a course
      </div>

      <div className="px-4 py-7">
        <h1 className="text-2xl font-semibold">Automation on Autopilot</h1>
        <p className="text-sm font-medium text-text-secondary mt-2.5">
          By, <span className="font-semibold text-primary">Paula Agard</span>
        </p>

        {/* Progress Card */}
        <div className="mt-5 rounded-[20px] bg-white p-5 border">
          <div className="text-xs font-medium">
            {completedModules}/{totalModules} Completed
          </div>
          <div className="mt-3 flex items-center gap-2">
            {Array.from({ length: totalModules }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < completedModules ? 'bg-emerald-500' : 'bg-[#E5E5E5]'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-7 space-y-4 p-4">
          {modules.map((m) => {
            const isOpen = openId === m.id;
            return (
              <div key={m.id} className="rounded-2xl border bg-white">
                {/* Header */}
                <button
                  type="button"
                  className={`w-full flex items-center justify-between rounded-2xl px-4 py-3 ${
                    isOpen ? 'rounded-b-none' : ''
                  }`}
                  onClick={() =>
                    setOpenId((prev) => (prev === m.id ? null : m.id))
                  }
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-6 w-6 rounded-full grid place-items-center border ${
                        m.completed
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-white border-[#D9D9D9]'
                      }`}
                    >
                      {m.completed ? (
                        <Check className="h-4 w-4 text-white" />
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="text-sm font-semibold text-[#7A7A7A]">
                      {m.title}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {/* Body */}
                {isOpen && (
                  <div className="rounded-b-2xl overflow-hidden">
                    {/* White top strip mimicking screenshot */}
                    <div className="bg-white px-4 py-3 border-t">
                      <div className="text-xs font-semibold text-[#7A7A7A]">
                        {m.title}
                      </div>
                      <div className="mt-1 text-base font-semibold">
                        {m.chapters[0]?.title ?? 'Types of AI'}
                      </div>
                    </div>
                    {/* Dark body */}
                    <div className="px-4 py-4">
                      <div className="space-y-3">
                        {m.chapters.slice(0, 2).map((c) => (
                          <div key={c.id} className="flex items-center gap-3">
                            <div
                              className={`h-5 w-5 rounded-full grid place-items-center border ${
                                c.completed
                                  ? 'bg-emerald-500 border-emerald-500'
                                  : 'bg-transparent border-white/30'
                              }`}
                            >
                              {c.completed ? (
                                <Check className="h-3.5 w-3.5 text-white" />
                              ) : null}
                            </div>
                            <div className="text-sm">{c.title}</div>
                          </div>
                        ))}
                      </div>

                      <Button
                        size="md"
                        className="mt-5 w-full bg-[#1D63E3] text-white rounded-xl"
                      >
                        Continue
                      </Button>

                      {/* Bottom controls */}
                      <div className="mt-4 flex items-center gap-3">
                        <div className="h-5 w-5 rounded border border-white/30" />
                        <div className="h-5 w-5 rounded border border-white/30" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MobileCourseProgressPage;

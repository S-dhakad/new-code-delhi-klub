'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'src/components/ui/accordion';
import { Play } from 'lucide-react';
import Link from 'next/link';
import { Module } from 'src/types/courses.types';
import { useParams } from 'next/navigation';

type Props = {
  modules?: Module[] | null;
};

export default function CourseAccordion({ modules = [] }: Props) {
  const [openItem, setOpenItem] = useState<string | undefined>(undefined);
  const params = useParams();
  const courseId = params.slug as string;
  return (
    <Accordion
      type="single"
      collapsible
      value={openItem}
      onValueChange={setOpenItem}
    >
      {modules?.map((module: Module, index: number) => {
        const isFirst = index === 0;
        const isLast = index === modules.length - 1;
        const isOpen = openItem === module.id;

        return (
          <AccordionItem key={module.id} value={`${module.id}`}>
            <AccordionTrigger
              className={`px-6 py-4 flex items-center justify-between bg-white hover:no-underline
                ${isFirst ? 'rounded-t-[20px]' : ''}
                ${isLast ? (isOpen ? '' : 'rounded-b-[20px]') : ''}`}
            >
              <div>
                <div className="text-base text-black font-semibold">
                  {module.name}
                </div>
                {module.duration && (
                  <div className="text-sm font-semibold text-[#787878]">
                    {module.duration} to complete
                  </div>
                )}
              </div>
              <div />
            </AccordionTrigger>

            <AccordionContent
              className={`px-6 py-4 border-t
                ${isLast && isOpen ? 'rounded-b-[20px]' : ''}`}
            >
              <p className="text-sm font-semibold text-black mb-4">
                {module.description}
              </p>

              <ul className="space-y-3">
                {module.lessons?.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 grid place-items-center">
                        <Play size={14} className="text-slate-500" />
                      </div>
                      <div className="text-sm font-semibold text-[#787878]">
                        {lesson.name}
                      </div>
                    </div>

                    <Link
                      href={`/courses/${courseId}/resources`}
                      className="text-[#0A5DBC] bg-white rounded-[11px] text-[12px] font-medium px-3 py-2"
                    >
                      Start
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

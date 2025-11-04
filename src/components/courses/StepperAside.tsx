'use client';
import React from 'react';
import Image from 'next/image';

type Step = {
  id: string;
  label: string;
};

type Props = {
  steps: Step[];
  stepIndex: number;
};

export default function StepperAside({ steps, stepIndex }: Props) {
  return (
    <aside className="w-56 hidden md:block">
      <div className="flex flex-col items-start gap-6">
        {steps.map((st, idx) => {
          const completed = idx < stepIndex;
          const active = idx === stepIndex;

          return (
            <div
              key={st.id}
              role="button"
              tabIndex={0}
              aria-current={active ? 'step' : undefined}
              className={`relative flex items-center gap-2 cursor-pointer border py-3 px-5 rounded-[15px] h-10 ${
                active
                  ? 'text-[#000000] bg-white border-[#ECECEC]'
                  : completed
                    ? 'text-#0A5DBC bg-[#E6EFF8] border-[#0A5DBC]'
                    : 'text-[#787878] bg-white border-[#ECECEC]'
              }`}
            >
              {/* Icon + line container */}
              <div className="flex flex-col items-center">
                {completed ? (
                  <Image
                    src="/tick-square-complete.svg"
                    alt="tick icon"
                    width={18}
                    height={18}
                  />
                ) : active ? (
                  <Image
                    src="/tick-square-active.svg"
                    alt="tick icon"
                    width={18}
                    height={18}
                  />
                ) : (
                  <Image
                    src="/tick-square-inactive.svg"
                    alt="tick icon"
                    width={18}
                    height={18}
                  />
                )}

                {idx !== steps.length - 1 && (
                  <div
                    className={`absolute w-[1px] h-8 mt-1 top-[93%] left-8 ${
                      completed ? 'bg-[#0A5DBC]' : 'bg-[#DADADA]'
                    }`}
                  />
                )}
              </div>

              <div className="text-base font-medium">{st.label}</div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

'use client';

import React, { Fragment } from 'react';
import { Card, CardContent } from 'src/components/ui/card';

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <Fragment>
      {stats.map((s, index) => (
        <Card
          key={s.label}
          className={`rounded-[20px] border border-[#ECECEC] shadow-none py-0 ${index === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
        >
          <CardContent className="py-5 px-[25px]">
            <div className="text-sm font-medium text-[#787878]">{s.label}</div>
            <div className="mt-5 text-[36px] font-bold text-[#000000]">
              {s.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </Fragment>
  );
};

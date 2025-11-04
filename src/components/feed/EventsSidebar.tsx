'use client';

import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';
import { Event } from 'src/types/events.types';

export default function EventsSidebar({
  upcomingEvents,
}: {
  upcomingEvents: Event[];
}) {
  return (
    <Card className="border border-[#ECECEC] rounded-[20px] py-[20px] gap-5">
      <CardHeader className="px-5 gap-0 flex flex-row justify-between items-center">
        <CardTitle className="text-base font-medium text-[#787878]">
          Upcoming Events
        </CardTitle>
        <button className="w-[26px] h-[26px] rounded-[5px] bg-[#F6F6F6] text-[#787878]">
          +
        </button>
      </CardHeader>
      <CardContent>
        <div>
          {upcomingEvents.map((event, index) => (
            <div key={event.id}>
              <div className="flex items-center gap-3">
                {event.url && (
                  <div className="w-12 h-12 rounded overflow-hidden">
                    <Image
                      src={event.url}
                      alt={event.name}
                      width={44}
                      height={44}
                      className="object-cover w-11 h-11"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="text-base font-medium text-[#000000] line-clamp-1">
                    {event.name}
                  </div>
                  <div className="text-sm font-medium text-[#B5B5B5] line-clamp-1">
                    {event.description}
                  </div>
                </div>
              </div>
              {index !== upcomingEvents.length - 1 && (
                <span className="border-b border-[#ECECEC] block w-full my-3"></span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

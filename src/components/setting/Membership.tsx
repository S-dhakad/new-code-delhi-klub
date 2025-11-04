'use client';

import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'src/components/ui/accordion';
import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { SettingMembershipModal } from './SettingMembershipModal';
import { useMembership, DISCOVER_KLUB } from 'src/hooks/settings/useMembership';

export default function Membership() {
  const {
    open,
    setOpen,
    communities,
    loading,
    hasMore,
    showSettingMembership,
    setShowSettingMembership,
    handleScroll,
  } = useMembership();

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="membership" className="overflow-hidden">
        <AccordionTrigger
          className={`px-6 py-4 hover:no-underline bg-white flex justify-between items-center ${
            open ? 'rounded-b-none rounded-t-[20px]' : 'rounded-[20px]'
          } [&>svg]:hidden`}
          onClick={() => setOpen(!open)}
        >
          <div className="text-base font-semibold text-[#000000]">
            Memberships
          </div>
          <Image
            src="/downArrow.svg"
            width={24}
            height={24}
            alt="down arrow icon"
            className={`transition-transform duration-300 ${open ? 'rotate-180' : 'rotate-0'}`}
          />
        </AccordionTrigger>

        <AccordionContent className="mt-4 bg-white border-t-2 border-[#0A5DBC] pb-0 rounded-b-[20px]">
          <div className="px-4 sm:px-6 pb-6 pt-2">
            {/* list container */}
            <div className="space-y-6 py-6 pb-0" onScroll={handleScroll}>
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between"
                >
                  {/* left: avatar + text */}
                  <div className="flex items-start sm:items-center gap-4 min-w-0 pl-1">
                    <div className="w-12 h-12 sm:w-11 sm:h-11 relative rounded-[15px] overflow-hidden flex-shrink-0">
                      <Image
                        src={community.image || '/cardImage1.jpg'}
                        alt={community.name}
                        fill
                        sizes="44px"
                        className="object-cover rounded-2xl"
                      />
                    </div>

                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-[#000000]">
                        {community.name}
                      </div>
                      <div className="text-sm font-medium text-[#787878]">
                        {community._count.members} members |{' '}
                        {community.isPaid
                          ? `$${community.subscriptionAmount}/m`
                          : 'Free'}
                      </div>
                    </div>
                  </div>

                  {/* right: action button */}
                  <div className="w-full sm:w-auto flex sm:justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="w-full h-10 sm:w-auto rounded-[15px] px-4 py-2 border border-[#ECECEC] text-sm font-medium text-[#000000]"
                      onClick={() => setShowSettingMembership(true)}
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              ))}

              {/* Discover new Klubs card */}
              <div
                key={DISCOVER_KLUB.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 justify-between pl-1"
              >
                <div className="flex items-start sm:items-center gap-4 min-w-0">
                  <div className="w-12 h-12 sm:w-11 sm:h-11 relative rounded-[15px] overflow-hidden flex-shrink-0">
                    <Image
                      src={DISCOVER_KLUB.avatar}
                      alt={DISCOVER_KLUB.title}
                      fill
                      sizes="44px"
                      className="object-cover rounded-2xl"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#000000]">
                      {DISCOVER_KLUB.title}
                    </div>
                    <div className="text-sm font-medium text-[#787878]">
                      {DISCOVER_KLUB.subtitle}
                    </div>
                  </div>
                </div>

                <div className="w-full sm:w-auto flex sm:justify-end">
                  <Link
                    href="/"
                    className="w-full h-10 sm:w-auto rounded-[15px] border-[#0A5DBC] text-[#0A5DBC] bg-white px-4 py-2 border font-semibold text-sm"
                  >
                    Discover
                  </Link>
                </div>
              </div>

              {loading && (
                <div className="text-center py-2 text-sm text-gray-500">
                  Loading...
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
      <SettingMembershipModal
        open={showSettingMembership}
        setOpen={setShowSettingMembership}
      />
    </Accordion>
  );
}

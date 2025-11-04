'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'src/components/ui/accordion';
import { Input } from 'src/components/ui/input';
import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import { SocialMediaPlatform } from 'src/types/login.types';
import { useSocialLinks } from 'src/hooks/settings/useSocialLinks';

type Props = {
  context?: 'profile' | 'community';
};

export default function SocialLinks({ context = 'profile' }: Props) {
  const [open, setOpen] = useState(false);
  const {
    loading,
    handleInputChange,
    handleSave,
    getSocialLink,
    getPlatformLabel,
  } = useSocialLinks(context);

  const standardPlatforms = [
    SocialMediaPlatform.WEBSITE,
    SocialMediaPlatform.YOUTUBE,
    SocialMediaPlatform.INSTAGRAM,
    SocialMediaPlatform.LINKEDIN,
    SocialMediaPlatform.FACEBOOK,
  ];

  const customPlatforms = [
    SocialMediaPlatform.CUSTOM_URL1,
    SocialMediaPlatform.CUSTOM_URL2,
  ];

  const platformsToShow =
    context === 'community'
      ? standardPlatforms
      : [...standardPlatforms, ...customPlatforms];

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="social" className="overflow-hidden">
        <AccordionTrigger
          className={`px-6 py-4 hover:no-underline bg-white flex justify-between items-center ${
            open ? 'rounded-b-none rounded-t-[20px]' : 'rounded-[20px]'
          } [&>svg]:hidden`}
          onClick={() => setOpen(!open)}
        >
          <div className="text-base font-semibold text-[#000000]">
            Social Links
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
          <div className="py-8 px-4 sm:px-10 space-y-6">
            {/* Standard social platforms */}
            {platformsToShow
              .filter((platform) =>
                context === 'community'
                  ? ![
                      SocialMediaPlatform.CUSTOM_URL1,
                      SocialMediaPlatform.CUSTOM_URL2,
                    ].includes(platform)
                  : ![
                      SocialMediaPlatform.CUSTOM_URL1,
                      SocialMediaPlatform.CUSTOM_URL2,
                    ].includes(platform),
              )
              .map((platform) => {
                const link = getSocialLink(platform);
                return (
                  <div
                    key={platform}
                    className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start"
                  >
                    <div className="w-full sm:w-48">
                      <label className="text-base font-semibold text-[#000000]">
                        {getPlatformLabel(platform)}
                      </label>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="relative">
                        <Image
                          src="/copy.svg"
                          alt="copy icon"
                          width={16}
                          height={16}
                          className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                        />
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            handleInputChange(platform, 'url', e.target.value)
                          }
                          className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          placeholder="Add a URL"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Custom URLs with labels - only for profile context */}
            {context === 'profile' &&
              [
                SocialMediaPlatform.CUSTOM_URL1,
                SocialMediaPlatform.CUSTOM_URL2,
              ].map((platform) => {
                const link = getSocialLink(platform);
                return (
                  <div
                    key={platform}
                    className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start"
                  >
                    <div className="w-full sm:w-48">
                      <label className="text-base font-semibold text-[#000000]">
                        {getPlatformLabel(platform)}
                      </label>
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative flex-1 w-full">
                          <Image
                            src="/text.svg"
                            alt="text icon"
                            width={16}
                            height={16}
                            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            value={link.label || ''}
                            placeholder="Add a URL name"
                            onChange={(e) =>
                              handleInputChange(
                                platform,
                                'label',
                                e.target.value,
                              )
                            }
                            className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          />
                        </div>
                        <div className="relative flex-1 w-full">
                          <Image
                            src="/copy.svg"
                            alt="copy icon"
                            width={16}
                            height={16}
                            className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2"
                          />
                          <Input
                            value={link.url}
                            placeholder="Add a URL"
                            onChange={(e) =>
                              handleInputChange(platform, 'url', e.target.value)
                            }
                            className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] pl-10 text-sm font-medium"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t border-[#ECECEC]">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-[#0A5DBC] text-white text-sm font-medium h-[40px] rounded-[10px] hover:bg-[#053875] transition-colors duration-300"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

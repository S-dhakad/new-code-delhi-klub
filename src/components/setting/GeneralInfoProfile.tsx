'use client';

import React, { useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from 'src/components/ui/accordion';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import FileUploader from 'src/components/FileUploader';
import { useGeneralInfo } from 'src/hooks/settings/useGeneralInfo';

export default function GeneralInfoProfile() {
  const [open, setOpen] = useState<string | undefined>('general');
  const {
    formData,
    loading,
    isUsernameAvailable,
    handleInputChange,
    handleSave,
    handleFilesAdded,
    handleRemoveProfilePicture,
  } = useGeneralInfo();

  return (
    <Accordion
      type="single"
      collapsible
      value={open}
      onValueChange={(v) => setOpen(v)}
    >
      <AccordionItem value="general" className="rounded-[20px]">
        <AccordionTrigger
          className={`px-6 py-4 hover:no-underline bg-white flex justify-between items-center ${
            open ? 'rounded-b-none rounded-t-[20px]' : 'rounded-[20px]'
          } [&>svg]:hidden`}
        >
          <div className="text-base font-semibold text-[#000000]">
            General Info
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
            {/* First name and Last name row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  First Name
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Your display name
                </p>
              </div>

              <div className="relative flex-1 w-full">
                <Image
                  src="/info-circle.svg"
                  alt="info"
                  width={16}
                  height={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                />
                <Input
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pr-[40px]"
                  placeholder="First name"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Last Name
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Your last name
                </p>
              </div>

              <div className="flex-1 w-full">
                <Input
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                  placeholder="Last name"
                />
              </div>
            </div>

            {/* Username row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Username
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  A nickname for your profile
                </p>
              </div>

              <div className="flex-1 w-full relative">
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    handleInputChange('username', e.target.value)
                  }
                  placeholder="username"
                  aria-invalid={
                    isUsernameAvailable === false ? true : undefined
                  }
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pr-9"
                />
                {isUsernameAvailable !== null && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center">
                    {isUsernameAvailable ? (
                      <Image
                        src="/Check.svg"
                        alt="available"
                        width={16}
                        height={16}
                      />
                    ) : (
                      <Image
                        src="/cross.svg"
                        alt="taken"
                        width={16}
                        height={16}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Photo row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Profile Photo
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Your display picture
                </p>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4">
                  <Image
                    src={formData.profilePictureUrl || '/dummyProfile.png'}
                    alt="Profile"
                    width={104}
                    height={104}
                    className="h-[104px] w-[104px] rounded-[20px] object-cover shadow-sm flex-shrink-0 bg-[#F6F6F6]"
                  />
                  <div className="w-full">
                    <div className="flex gap-2">
                      <FileUploader
                        accept="image/*"
                        multiple={false}
                        maxFiles={1}
                        onFilesAdded={handleFilesAdded}
                        onError={(msg) => console.warn(msg)}
                      >
                        {(open) => (
                          <Button
                            size="sm"
                            className="px-4 py-2 rounded-[10px] border border-[#ECECEC] bg-transparent font-medium text-sm text-[#000000] h-[34px]"
                            onClick={open}
                          >
                            + Upload new
                          </Button>
                        )}
                      </FileUploader>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="px-4 py-2 rounded-[10px] text-[#DE0000] border border-[#ECECEC] bg-transparent font-medium text-sm h-[34px]"
                        onClick={handleRemoveProfilePicture}
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="text-xs text-[#787878] font-medium mt-2">
                      <div>200 × 200 px size recommended</div>
                      <div>JPG or PNG</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Bio
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  A little about yourself
                </p>
              </div>

              <div className="flex-1 w-full">
                <Textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="h-[93px] p-[15px] resize-none border-[#ECECEC] rounded-[15px] font-medium text-sm text-[#000000]"
                  placeholder="Tell people about yourself"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex  justify-end pt-4 border-t">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-[#0A5DBC] text-white hover:bg-[#053875] transition-colors duration-300"
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

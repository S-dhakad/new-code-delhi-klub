'use client';

import React from 'react';
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
import AddSpaceModal from 'src/components/feed/AddSpaceModal';
import FileUploader from 'src/components/FileUploader';
import AddTopicsModal from './AddTopicsModal';
import { TagFailureModal } from '../modals/TagFailureModal';
import { useGeneralInfoCommunities } from 'src/hooks/settings/useGeneralInfoCommunities';

export default function GeneralInfoCommunities() {
  const {
    open,
    setOpen,
    activeWorkspaceId,
    community,
    workspaces,
    loading,
    isAddSpaceOpen,
    setIsAddSpaceOpen,
    spaceName,
    setSpaceName,
    spaceLoading,
    isAddTopicsOpen,
    setIsAddTopicsOpen,
    isEditing,
    setIsEditing,
    showFailureModal,
    setShowFailureModal,
    formState,
    thumbnail,
    banner,
    imagesPreview,
    updateFormField,
    handleSave,
    createNewSpace,
    handleThumbnailFilesAdded,
    handleBannerFilesAdded,
    handleImagesFilesAdded,
    removeThumbnail,
    removeBanner,
    removeImageAt,
    handleActive,
  } = useGeneralInfoCommunities();

  // ---------- end additions ----------
  if (!community) {
    return (
      <Accordion
        type="single"
        collapsible
        value={open}
        onValueChange={(v) => setOpen(v)}
      >
        <AccordionItem value="general" className="rounded-xl">
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
            <div className="py-8 px-4 sm:px-10">
              <p className="text-center text-gray-500">
                Loading community data...
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

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
          {/* responsive padding: smaller on xs, larger on sm+ */}
          <div className="py-8 px-4 sm:px-10 space-y-6">
            {/* Full name row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Community name
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
                  value={formState.fullName}
                  onChange={(e) => updateFormField('fullName', e.target.value)}
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pr-[40px]"
                  placeholder="Enter community name"
                />
              </div>
            </div>

            {/* Profile Photo row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Community Photo
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Your community display picture
                </p>
              </div>

              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-col md:items-center lg:flex-row items-center sm:items-center gap-4">
                  <div className="flex-shrink-0">
                    {thumbnail.url ? (
                      thumbnail.isObjectURL ? (
                        <Image
                          src={thumbnail.url}
                          alt={thumbnail.name}
                          width={104}
                          height={104}
                          className="h-[104px] w-[104px] rounded-xl object-cover shadow-sm flex-shrink-0 bg-[#F6F6F6]"
                        />
                      ) : (
                        <Image
                          src={thumbnail.url}
                          alt="Community Profile"
                          width={104}
                          height={104}
                          className="h-[104px] w-[104px] rounded-xl object-cover shadow-sm flex-shrink-0 bg-[#F6F6F6]"
                        />
                      )
                    ) : (
                      <div className="h-[104px] w-[104px] rounded-xl bg-[#F6F6F6] text-xs text-[#787878] font-medium flex items-center justify-center text-center">
                        <p>No profile photo uploaded</p>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex gap-2">
                      <FileUploader
                        accept="image/*"
                        multiple={false}
                        maxFiles={1}
                        onFilesAdded={handleThumbnailFilesAdded}
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
                        onClick={removeThumbnail}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-xs text-[#787878] font-medium  mt-2">
                      <div>200 × 200 px size recommended</div>
                      <div>JPG or PNG</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Banner
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  A brief intro to your Community
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-col md:items-start items-start lg:flex-row lg:items-center gap-4">
                  <div className="relative rounded-[20px] w-full lg:w-[235px] h-[190px] flex-shrink-0">
                    {banner.url ? (
                      banner.type === 'video' ? (
                        banner.isObjectURL ? (
                          <video
                            src={banner.url}
                            className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                            controls
                          />
                        ) : (
                          <Image
                            src={banner.url}
                            alt="Community banner"
                            width={235}
                            height={190}
                            className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                          />
                        )
                      ) : banner.type === 'image' ? (
                        banner.isObjectURL ? (
                          <Image
                            src={banner.url}
                            alt={banner.name}
                            width={235}
                            height={190}
                            className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                          />
                        ) : (
                          <Image
                            src={banner.url}
                            alt="Community banner"
                            width={235}
                            height={190}
                            className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                          />
                        )
                      ) : (
                        <Image
                          src={banner.url}
                          alt="Community banner"
                          width={235}
                          height={190}
                          className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6]"
                        />
                      )
                    ) : (
                      <div className="object-cover w-full h-full rounded-[20px] bg-[#F6F6F6] text-xs text-[#787878] font-medium flex items-center justify-center">
                        No banner uploaded
                      </div>
                    )}

                    {!banner.isObjectURL && banner.type === 'video' && (
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow">
                          <Image
                            src="/playIcon.svg"
                            alt="play icon"
                            width={28}
                            height={28}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex gap-2">
                      <FileUploader
                        accept="image/*,video/*"
                        multiple={false}
                        maxFiles={1}
                        onFilesAdded={handleBannerFilesAdded}
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
                        onClick={removeBanner}
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="text-xs text-[#787878] font-medium mt-2">
                      JPG, PNG or video
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
                  Single liner about Community
                </p>
              </div>
              <div className="flex-1 w-full">
                <Input
                  value={formState.bio}
                  onChange={(e) => updateFormField('bio', e.target.value)}
                  placeholder="Enter community bio"
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                />
              </div>
            </div>

            {/* Location row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Location
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Where are you based
                </p>
              </div>
              <div className="flex-1 w-full">
                <Input
                  value={formState.location}
                  onChange={(e) => updateFormField('location', e.target.value)}
                  placeholder="Enter location"
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium"
                />
              </div>
            </div>

            {/* About row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  About
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Purpose, values, or focus of the community.
                </p>
              </div>
              <div className="flex-1 w-full">
                <Textarea
                  value={formState.about}
                  onChange={(e) => updateFormField('about', e.target.value)}
                  className="h-[93px] p-[15px] resize-none border-[#ECECEC] rounded-[15px] font-medium text-sm text-[#000000]"
                  placeholder="Describe your community"
                />
              </div>
            </div>

            {/* Slug row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Slug
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  A unique link for your Community
                </p>
              </div>
              <div className="relative flex-1 w-full">
                <span className="absolute top-[1px] bottom-[1px] left-[1px] bg-[#F6F6F6] flex items-center pl-3 w-[133px] text-sm font-medium rounded-tl-[15px] rounded-bl-[15px] text-[#787878]">
                  klub.it.com/k/
                </span>
                <Input
                  value={formState.slug}
                  onChange={(e) => updateFormField('slug', e.target.value)}
                  className="h-10 border-[#ECECEC] rounded-[15px] px-[15px] text-sm font-medium pl-[140px] pr-8"
                  placeholder="community-slug"
                />
                <Image
                  src="/copy.svg"
                  alt="copy icon"
                  width={16}
                  height={16}
                  className="absolute top-1/2 right-3 -translate-y-1/2"
                />
              </div>
            </div>

            {/* Topics row */}
            {/* <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Spaces
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Organise conversations by topic
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-wrap gap-2">
                  {community.topics?.map((topic, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full border text-sm bg-blue-100 border-blue-200"
                    >
                      #{topic}
                    </span>
                  ))}
                  <Button
                    size="sm"
                    className="px-3 py-1 rounded-md bg-blue-600 text-white hover:bg-blue-600"
                    onClick={() => setIsAddTopicsOpen(true)}
                  >
                    + Add topic
                  </Button>
                </div>
              </div>
            </div> */}

            {/* Spaces row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Spaces
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Organise conversations by topic
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="flex flex-wrap gap-2 gap-y-3">
                  {workspaces.map((workspace) => {
                    const isActive = workspace.id === activeWorkspaceId;
                    return (
                      <div
                        key={workspace.id}
                        className={`flex items-center gap-1 rounded-[10px] border border-[border-[#ECECEC] px-3 py-1 h-[34px] ${isEditing ? 'bg-white' : 'bg-[#F6F6F6]'}`}
                      >
                        <span className="text-[#0A5DBC]">#</span>
                        <input
                          value={workspace.name}
                          readOnly={!isEditing}
                          className="bg-transparent border-none focus:outline-none text-sm font-medium text-[#000000] px-1"
                          style={{ width: `${workspace.name.length}ch` }}
                        />
                        {isEditing && (
                          <Image
                            src="/cross.svg"
                            alt="remove"
                            width={12}
                            height={12}
                            className="cursor-pointer"
                            onClick={() => setShowFailureModal(true)}
                          />
                        )}
                      </div>
                    );
                  })}

                  <Button
                    size="sm"
                    onClick={() => setIsAddSpaceOpen(true)}
                    className="rounded-[10px] border bg-[#0A5DBC] text-white text-sm font-medium px-3 py-1 w-1/2 lg:w-auto flex items-center h-[34px] hover:bg-[#053875] transition-colors duration-300"
                  >
                    + Add new
                  </Button>
                  <Button
                    className="rounded-[10px] border border-[#ECECEC] bg-white text-sm font-medium text-[#000000] px-3 py-1 w-1/2 lg:w-auto h-[34px]"
                    onClick={() => setIsEditing((prev) => !prev)}
                  >
                    {isEditing ? 'Done' : 'Edit'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Key Highlights / Description row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48">
                <label className="text-base font-semibold text-[#000000]">
                  Key Highlights
                </label>
                <p className="text-sm font-medium text-[#787878] mt-1">
                  Feature notable work, impact, or community wins.
                </p>
              </div>
              <div className="flex-1 w-full">
                <p className="text-[#787878] text-[14px] font-medium mb-[14px] ">
                  Description
                </p>
                <Textarea
                  value={formState.description}
                  onChange={(e) =>
                    updateFormField('description', e.target.value)
                  }
                  className="h-[100px] resize-none border border-[#ECECEC] rounded-[15px]"
                  placeholder="Describe what makes your community special"
                />
              </div>
            </div>

            {/* Images row */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-32 items-start">
              <div className="w-full sm:w-48"></div>
              <div className="flex-1 w-full">
                <p className="text-[#787878] text-[14px] font-medium mb-[14px] ">
                  Images
                </p>
                <div className="flex gap-3 flex-wrap">
                  {imagesPreview.map((img, i) => (
                    <div
                      key={`${img.id}-${i}`}
                      className="relative w-[116px] h-[104px]"
                    >
                      {img.isObjectURL ? (
                        <Image
                          src={img.url}
                          alt={`Community image ${i + 1}`}
                          width={116}
                          height={104}
                          className="w-[116px] h-[104px] rounded-[20px] object-cover shadow-sm"
                        />
                      ) : (
                        <Image
                          src={img.url}
                          alt={`Community image ${i + 1}`}
                          width={116}
                          height={104}
                          className="w-[116px] h-[104px] rounded-[20px] object-cover shadow-sm"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeImageAt(i)}
                        className="absolute bottom-2 right-2 bg-white rounded-[20px] p-1 shadow"
                        aria-label="Remove image"
                      >
                        <Image
                          src="/deleteIcon.svg"
                          alt="close"
                          width={26}
                          height={26}
                        />
                      </button>
                    </div>
                  ))}
                  <FileUploader
                    accept="image/*"
                    multiple={true}
                    onFilesAdded={handleImagesFilesAdded}
                    onError={(msg) => console.warn(msg)}
                  >
                    {(open) => (
                      <button
                        type="button"
                        onClick={open}
                        className="w-[116px] h-[104px] text-xs font-medium flex items-center justify-center border rounded-[20px] bg-[#FFFFFF]"
                      >
                        <div className="text-center">
                          <div className="text-2xl">+</div>
                          <div className="text-xs">Upload</div>
                        </div>
                      </button>
                    )}
                  </FileUploader>
                </div>
              </div>
            </div>

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

      <AddSpaceModal
        isOpen={isAddSpaceOpen}
        onClose={() => setIsAddSpaceOpen(false)}
        value={spaceName}
        onChange={setSpaceName}
        onSave={createNewSpace}
        loading={spaceLoading}
      />
      <AddTopicsModal
        isOpen={isAddTopicsOpen}
        onClose={() => setIsAddTopicsOpen(false)}
      />
      <TagFailureModal
        open={showFailureModal}
        setOpen={setShowFailureModal}
        title="Are you sure?"
        subTitle="This action cannot be undone"
        message="Deleting a space will delete all posts in it. You cannot recover it later"
        onOpenChange={(open) => {
          setShowFailureModal(open);
        }}
      />
    </Accordion>
  );
}

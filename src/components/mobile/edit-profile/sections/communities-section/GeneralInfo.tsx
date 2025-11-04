'use client';
import React from 'react';
import { Input } from 'src/components/ui/input';
import Image from 'next/image';
import Button from '../../../common/ui/Button';
import { TextArea } from '../../../common/ui/Input';
import { useGeneralInfoCommunities } from 'src/hooks/settings/useGeneralInfoCommunities';
import FileUploader from 'src/components/FileUploader';
import AddSpaceModal from 'src/components/feed/AddSpaceModal';
import AddTopicsModal from 'src/components/setting/AddTopicsModal';
import { TagFailureModal } from 'src/components/modals/TagFailureModal';

const GeneralInfo: React.FC = () => {
  const {
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
  } = useGeneralInfoCommunities();

  if (!community) {
    return (
      <div className="p-5">
        <p className="text-center text-gray-500">Loading community data...</p>
      </div>
    );
  }

  return (
    <div className="p-5 space-y-5">
      {/* Community Name */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Community name</label>
          <p className="font-medium text-sm text-text-secondary">
            Your display name
          </p>
        </div>
        <Input
          value={formState.fullName}
          onChange={(e) => updateFormField('fullName', e.target.value)}
          placeholder="Enter community name"
          className="rounded-2xl text-sm font-medium py-3 h-10"
        />
      </div>

      {/* Community Photo */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Profile Photo</label>
          <p className="font-medium text-sm text-text-secondary">
            Your display picture
          </p>
        </div>

        <div className="flex items-center gap-4">
          {thumbnail.url ? (
            <Image
              src={thumbnail.url}
              alt="Community Profile"
              width={130}
              height={130}
              className="flex-shrink h-[130px] w-[130px] rounded-2xl object-cover"
            />
          ) : (
            <div className="flex-shrink h-[130px] w-[130px] rounded-2xl bg-[#F6F6F6] text-xs text-text-secondary font-medium flex items-center justify-center text-center">
              No profile photo uploaded
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <FileUploader
              accept="image/*"
              multiple={false}
              maxFiles={1}
              onFilesAdded={handleThumbnailFilesAdded}
              onError={(msg) => console.warn(msg)}
            >
              {(open) => (
                <Button size="sm" variant="outline" onClick={open}>
                  + Upload new
                </Button>
              )}
            </FileUploader>
            <Button
              size="sm"
              variant="outline"
              className="text-[#DE0000]"
              onClick={removeThumbnail}
            >
              Remove
            </Button>
          </div>
        </div>
        <p className="text-xs text-text-secondary font-medium">
          200 x 200 px size recommended JPG or PNG
        </p>
      </div>

      {/* Banner */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Banner</label>
          <p className="font-medium text-sm text-text-secondary">
            A brief intro to your Klub
          </p>
        </div>

        <div className="relative rounded-2xl w-full h-[190px]">
          {banner.url ? (
            banner.type === 'video' ? (
              banner.isObjectURL ? (
                <video
                  src={banner.url}
                  className="object-cover w-full h-full rounded-2xl"
                  controls
                />
              ) : (
                <Image
                  src={banner.url}
                  alt="Community banner"
                  width={235}
                  height={190}
                  className="object-cover w-full h-full rounded-2xl"
                />
              )
            ) : (
              <Image
                src={banner.url}
                alt="Community banner"
                width={235}
                height={190}
                className="object-cover w-full h-full rounded-2xl"
              />
            )
          ) : (
            <div className="object-cover w-full h-full rounded-2xl bg-[#F6F6F6] text-xs text-text-secondary font-medium flex items-center justify-center">
              No banner uploaded
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <FileUploader
            accept="image/*,video/*"
            multiple={false}
            maxFiles={1}
            onFilesAdded={handleBannerFilesAdded}
            onError={(msg) => console.warn(msg)}
          >
            {(open) => (
              <Button size="sm" variant="outline" onClick={open}>
                + Upload new
              </Button>
            )}
          </FileUploader>
          <Button
            size="sm"
            variant="outline"
            className="text-[#DE0000]"
            onClick={removeBanner}
          >
            Remove
          </Button>
        </div>
        <p className="text-xs text-text-secondary font-medium">
          JPG, PNG or video
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Bio</label>
          <p className="font-medium text-sm text-text-secondary">
            Single liner about Klub
          </p>
        </div>
        <Input
          value={formState.bio}
          onChange={(e) => updateFormField('bio', e.target.value)}
          placeholder="Enter community bio"
          className="rounded-2xl text-sm font-medium py-3 h-10"
        />
      </div>

      {/* Location */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Location</label>
          <p className="font-medium text-sm text-text-secondary">
            Where are you based
          </p>
        </div>
        <Input
          value={formState.location}
          onChange={(e) => updateFormField('location', e.target.value)}
          placeholder="Enter location"
          className="rounded-2xl text-sm font-medium py-3 h-10"
        />
      </div>

      {/* About */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">About</label>
          <p className="font-medium text-sm text-text-secondary">
            Purpose, values, or focus of the community.
          </p>
        </div>
        <TextArea
          value={formState.about}
          onChange={(e) => updateFormField('about', e.target.value)}
          placeholder="Describe your community"
          className="border-[0.5px] outline-none border-[#ECECEC] rounded-2xl min-h-[93px]"
        />
      </div>

      {/* Slug */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Slug</label>
          <p className="font-medium text-sm text-text-secondary">
            A unique link for your Klub
          </p>
        </div>
        <div className="relative">
          <span className="absolute top-[1px] bottom-[1px] left-[1px] bg-[#F6F6F6] flex items-center pl-3 w-[133px] text-sm font-medium rounded-tl-2xl rounded-bl-2xl text-text-secondary">
            klub.it.com/k/
          </span>
          <Input
            value={formState.slug}
            onChange={(e) => updateFormField('slug', e.target.value)}
            className="rounded-2xl text-sm font-medium py-3 h-10 pl-[140px] pr-8"
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

      {/* Spaces */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Spaces</label>
          <p className="font-medium text-sm text-text-secondary">
            Organise conversations by topic
          </p>
        </div>
        <div className="flex flex-wrap gap-2 gap-y-3">
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`flex items-center gap-1 rounded-2xl border border-[#ECECEC] px-3 py-1 h-[34px] ${isEditing ? 'bg-white' : 'bg-[#F6F6F6]'}`}
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
          ))}

          <Button
            size="sm"
            onClick={() => setIsAddSpaceOpen(true)}
            className="rounded-2xl bg-[#0A5DBC] text-white text-sm font-medium px-3 py-1 h-[34px]"
          >
            + Add new
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditing((prev) => !prev)}
            className="rounded-2xl text-sm font-medium px-3 py-1 h-[34px]"
          >
            {isEditing ? 'Done' : 'Edit'}
          </Button>
        </div>
      </div>

      {/* Key Highlights */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Key Highlights</label>
          <p className="font-medium text-sm text-text-secondary">
            Feature notable work, impact, or community wins.
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-text-secondary text-sm font-medium">Description</p>
          <TextArea
            value={formState.description}
            onChange={(e) => updateFormField('description', e.target.value)}
            placeholder="Describe what makes your community special"
            className="border-[0.5px] outline-none border-[#ECECEC] rounded-2xl min-h-[100px]"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <p className="text-text-secondary text-sm font-medium">Images</p>
        <div className="flex gap-3 flex-wrap">
          {imagesPreview.map((img, i) => (
            <div
              key={`${img.id}-${i}`}
              className="relative w-[116px] h-[104px]"
            >
              <Image
                src={img.url}
                alt={`Community image ${i + 1}`}
                width={116}
                height={104}
                className="w-[116px] h-[104px] rounded-2xl object-cover shadow-sm"
              />
              <button
                type="button"
                onClick={() => removeImageAt(i)}
                className="absolute bottom-2 right-2 bg-white rounded-2xl p-1 shadow"
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
                className="w-[116px] h-[104px] text-xs font-medium flex items-center justify-center border rounded-2xl bg-[#FFFFFF]"
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

      {/* Save Button */}
      <div className="flex justify-end pt-2 border-t">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Modals */}
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
    </div>
  );
};

export default GeneralInfo;

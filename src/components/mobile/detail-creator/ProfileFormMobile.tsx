'use client';
import Image from 'next/image';

import { Label } from 'src/components/ui/label';
import { Button } from 'src/components/ui/button';
import { SubscribeBadge } from 'src/components/mobile/common/SubscribeBadge';
import FileUploader from 'src/components/FileUploader';
import Input, { TextArea } from '../common/ui/Input';
import { useProfileForm } from 'src/hooks/useProfileForm';

export default function ProfileFormMobile() {
  const {
    fullName,
    setFullName,
    username,
    bio,
    setBio,
    whatsapp,
    setWhatsapp,
    avatar,
    isUsernameAvailable,
    loading,
    handleFilesAdded,
    handleUsernameChange,
    handleSubmit,
  } = useProfileForm();

  return (
    <section
      className="px-4 py-7 rounded-[20px] border border-border-stroke-regular overflow-hidden bg-center bg-cover"
      style={{ backgroundImage: "url('/wave.png')" }}
    >
      <SubscribeBadge type="creator" />
      <h1 className="mt-3 text-[22px] font-semibold leading-tight">
        Let&apos;s <span className="text-primary">Setup your account</span>
      </h1>
      <p className="mt-3 text-base font-medium text-text-secondary">
        Personalize how you will appear to people on Klub
      </p>

      {/* Avatar + Edit */}
      <div className="mt-6 flex justify-center">
        <div className="relative inline-flex items-center gap-3">
          <div className="rounded-2xl border-2 border-black p-1">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl bg-white">
              <Image
                src={avatar}
                alt={fullName}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <FileUploader
            accept="image/*"
            multiple={false}
            maxFiles={1}
            onFilesAdded={handleFilesAdded}
            onError={(msg) => console.warn(msg)}
          >
            {(open) => (
              <button
                type="button"
                className="cursor-pointer inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs shadow-sm absolute bottom-[-10px] right-[-32px]"
                onClick={open}
              >
                <Image src="/Edit.svg" alt="Edit" width={14} height={14} />
                Edit
              </button>
            )}
          </FileUploader>
        </div>
      </div>

      {/* Inputs */}
      <div className="mt-6 grid grid-cols-1 gap-4">
        <div>
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-text-secondary"
          >
            Full name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-2 text-sm font-medium rounded-2xl bg-white"
            placeholder="Your full name"
          />
        </div>
        <div>
          <Label
            htmlFor="username"
            className="text-sm font-medium text-text-secondary"
          >
            Username
          </Label>
          <div className="relative">
            <Input
              id="username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="mt-2 text-sm font-medium rounded-2xl bg-white pr-9"
              placeholder="username"
              aria-invalid={isUsernameAvailable === false ? true : undefined}
            />
            {isUsernameAvailable !== null && (
              <span className="absolute right-3 top-[55%] -translate-y-1/2 h-4 w-4 inline-flex items-center justify-center">
                {isUsernameAvailable ? (
                  <Image
                    src="/Check.svg"
                    alt="available"
                    width={16}
                    height={16}
                  />
                ) : (
                  <Image src="/cross.svg" alt="taken" width={16} height={16} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      <div className="mt-4">
        <Label
          htmlFor="bio"
          className="text-sm font-medium text-text-secondary"
        >
          Enter your bio
        </Label>
        <div className="mt-2 rounded-2xl bg-white">
          <TextArea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="rounded-xl text-sm font-medium bg-white resize-none"
            placeholder="Tell people about yourself"
          />
        </div>
      </div>

      {/* WhatsApp Number */}
      <div className="mt-4">
        <Label
          htmlFor="whatsapp"
          className="text-sm font-medium text-text-secondary"
        >
          Enter WhatsApp Number
        </Label>
        <div className="mt-2 relative">
          <Input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="text-sm font-medium rounded-2xl w-full bg-white"
            placeholder="Enter WhatsApp Number"
          />
        </div>
      </div>

      {/* Next button */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-full text-white"
      >
        {loading ? 'Saving...' : 'Next'}
      </Button>
    </section>
  );
}

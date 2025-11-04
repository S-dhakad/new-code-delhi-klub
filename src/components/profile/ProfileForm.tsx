'use client';
import { Input } from 'src/components/ui/input';
import { Textarea } from 'src/components/ui/textarea';
import { Label } from 'src/components/ui/label';
import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import FileUploader from 'src/components/FileUploader';
import { useProfileForm } from 'src/hooks/useProfileForm';
import { useToastStore } from 'src/store/toast.store';

export default function ProfileForm() {
  const { showToast } = useToastStore();
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
    <section className="px-[38px] py-[50] border-r border-[#ECECEC]">
      <h1 className="text-[26px] font-semibold text-[#000000]">
        Let’s <span className="text-[#0A5DBC]">Setup your profile</span>
      </h1>
      <p className="mt-2 text-base text-[#787878] font-medium">
        Personalize how you will appear to people on Klub
      </p>

      {/* Avatar + Edit */}
      <div className="mt-[28px] flex justify-center">
        <div className="inline-flex items-center gap-3 relative">
          <div className="relative h-[85px] w-[85px] overflow-hidden rounded-[15px] border-2 bg-white border-[#0A5DBC] p-1">
            <Image
              src={avatar}
              alt={fullName}
              width={76}
              height={76}
              className="object-cover w-full h-full rounded-[15px]"
            />
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
                className="inline-flex items-center gap-2 cursor-pointer rounded-[10px] border border-[#ECECEC] bg-white py-[6px] px-[10px] absolute bottom-[-10px] right-[-32px] text-sm font-medium text-[#000000] h-[28px]"
                onClick={open}
              >
                <Image src="/Edit.svg" alt="Edit" width={16} height={16} />
                Edit
              </button>
            )}
          </FileUploader>
        </div>
      </div>

      {/* Two inputs */}
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <Label
            htmlFor="fullName"
            className="mb-2 text-sm font-medium text-[#787878]"
          >
            Full name
          </Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="rounded-[15px] bg-white border border-[#ECECEC] text-sm font-medium text-[#000000] h-10 focus:outline-none focus-visible:ring-0 focus:border-[#0A5DBC]"
            placeholder="Your full name"
          />
        </div>
        <div>
          <Label
            htmlFor="username"
            className="mb-2 text-sm font-medium text-[#787878]"
          >
            Username
          </Label>
          <div className="relative">
            <Input
              id="username"
              value={username}
              onChange={(e) => handleUsernameChange(e.target.value)}
              className="rounded-[15px] bg-white border border-[#ECECEC] text-sm font-medium text-[#000000] h-10 pr-9"
              placeholder="username"
              aria-invalid={isUsernameAvailable === false ? true : undefined}
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
          className="mb-2 text-sm font-medium text-[#787878]"
        >
          Enter your bio
        </Label>
        <Textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          className="rounded-[15px] bg-white border border-[#ECECEC] text-sm font-medium text-[#000000] resize-none"
          placeholder="Tell people about yourself"
        />
      </div>

      {/* DOB */}
      <div className="mt-4">
        <Label
          htmlFor="dob"
          className="mb-2 text-sm font-medium text-[#787878]"
        >
          Enter WhatsApp Number
        </Label>
        <div className="mt-2 relative">
          {/* <Input
            id="dob"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="rounded-[15px] bg-white border border-[#ECECEC] text-sm font-medium text-[#000000] h-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full"
            placeholder="YYYY-MM-DD"
          />
          <Image
            src="/calendar.svg"
            alt="Calendar"
            width={18}
            height={18}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          /> */}
          <Input
            id="whatsapp"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="rounded-[15px] bg-white border border-[#ECECEC] text-sm font-medium text-[#000000] h-10 focus:outline-none focus-visible:ring-0 focus:border-[#0A5DBC]"
            placeholder="Enter WhatsApp Number"
          />
        </div>
      </div>

      {/* Next button */}
      <Button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-6 font-semibold text-base w-full rounded-[15px] text-white bg-[#0A5DBC] h-11 hover:bg-[#053875] transition-colors duration-300"
      >
        {loading ? 'Saving...' : 'Next'}
      </Button>
    </section>
  );
}

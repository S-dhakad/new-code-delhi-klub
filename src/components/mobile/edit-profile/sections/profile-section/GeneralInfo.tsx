'use client';
import React from 'react';
import { Input } from 'src/components/ui/input';
import Image from 'next/image';
import Button from '../../../common/ui/Button';
import { TextArea } from '../../../common/ui/Input';
import { useGeneralInfo } from 'src/hooks/settings/useGeneralInfo';
import FileUploader from 'src/components/FileUploader';

const GeneralInfo: React.FC = () => {
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
    <div className="p-5 space-y-5">
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">First Name</label>
          <p className="font-medium text-sm text-text-secondary">
            Your display name
          </p>
        </div>
        <Input
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          placeholder="First name"
          className="rounded-2xl text-sm font-medium py-3 h-10"
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Last Name</label>
          <p className="font-medium text-sm text-text-secondary">
            Your last name
          </p>
        </div>
        <Input
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          placeholder="Last name"
          className="rounded-2xl text-sm font-medium py-3 h-10"
        />
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Username</label>
          <p className="font-medium text-sm text-text-secondary">
            A nickname for your profile
          </p>
        </div>
        <div className="relative">
          <Input
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            placeholder="username"
            className="rounded-2xl text-sm font-medium py-3 h-10 pr-9"
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
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Profile Photo</label>
          <p className="font-medium text-sm text-text-secondary">
            Your display picture
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Image
            src={formData.profilePictureUrl || '/dummyProfile.png'}
            alt="Profile"
            width={130}
            height={130}
            className="flex-shrink h-[130px] w-[130px] rounded-2xl object-cover"
          />
          <div className="flex flex-wrap gap-2">
            <FileUploader
              accept="image/*"
              multiple={false}
              maxFiles={1}
              onFilesAdded={handleFilesAdded}
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
              onClick={handleRemoveProfilePicture}
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="font-semibold">Bio</label>
          <p className="font-medium text-sm text-text-secondary">
            A little about yourself
          </p>
        </div>
        <TextArea
          value={formData.bio}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell people about yourself"
          className="border-[0.5px] outline-none border-[#ECECEC] rounded-2xl"
        />
      </div>

      <div className="flex justify-end pt-2 border-t">
        <Button onClick={handleSave} disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default GeneralInfo;

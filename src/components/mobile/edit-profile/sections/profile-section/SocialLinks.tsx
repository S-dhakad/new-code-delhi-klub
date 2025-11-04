'use client';
import React from 'react';
import { Input } from 'src/components/ui/input';
import Image from 'next/image';
import Button from '../../../common/ui/Button';
import { SocialMediaPlatform } from 'src/types/login.types';
import { useSocialLinks } from 'src/hooks/settings/useSocialLinks';

const SocialLinks: React.FC = () => {
  const {
    loading,
    handleInputChange,
    handleSave,
    getSocialLink,
    getPlatformLabel,
  } = useSocialLinks('profile');

  // Standard social media platforms
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

  return (
    <div className="p-5 space-y-5">
      {/* Standard Platforms */}
      {standardPlatforms.map((platform) => {
        const link = getSocialLink(platform);
        return (
          <div key={platform} className="space-y-2">
            <label className="font-semibold">
              {getPlatformLabel(platform)}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center">
                <span className="h-6 w-6 rounded-full bg-white border border-[#ECECEC] grid place-items-center">
                  <Image
                    src="/copy.svg"
                    alt="Copy"
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </span>
              </span>
              <Input
                placeholder="Add a URL"
                className="pl-12 rounded-2xl text-sm font-medium py-3 h-10 border-[0.5px] border-[#ECECEC]"
                value={link.url}
                onChange={(e) =>
                  handleInputChange(platform, 'url', e.target.value)
                }
              />
            </div>
          </div>
        );
      })}

      {/* Custom URLs */}
      {customPlatforms.map((platform) => {
        const link = getSocialLink(platform);
        return (
          <div key={platform} className="space-y-2">
            <label className="font-semibold">
              {getPlatformLabel(platform)}
            </label>
            <div className="space-y-2.5">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-white border border-[#ECECEC] grid place-items-center">
                    <Image
                      src="/text.svg"
                      alt="text"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </span>
                </span>
                <Input
                  placeholder="Digital Products"
                  className="pl-12 rounded-2xl text-sm font-medium py-3 h-10 border-[0.5px] border-[#ECECEC]"
                  value={link.label || ''}
                  onChange={(e) =>
                    handleInputChange(platform, 'label', e.target.value)
                  }
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <span className="h-6 w-6 rounded-full bg-white border border-[#ECECEC] grid place-items-center">
                    <Image
                      src="/copy.svg"
                      alt="Copy"
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </span>
                </span>
                <Input
                  placeholder="Add a URL"
                  className="pl-12 rounded-2xl text-sm font-medium py-3 h-10 border-[0.5px] border-[#ECECEC]"
                  value={link.url}
                  onChange={(e) =>
                    handleInputChange(platform, 'url', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex justify-end pt-2 border-t">
        <Button disabled={loading} onClick={handleSave}>
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default SocialLinks;

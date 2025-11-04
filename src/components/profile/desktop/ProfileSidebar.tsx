import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from 'src/components/ui/button';
import { Separator } from 'src/components/ui/separator';
import { formatJoinedDate } from 'src/utils/formatDate';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';
import { Profile } from 'src/types/profile.types';

interface ProfileSidebarProps {
  profile: Profile;
  isOwner: boolean;
}

export default function ProfileSidebar({
  profile,
  isOwner,
}: ProfileSidebarProps) {
  return (
    <div className="w-full lg:w-[412px] flex-shrink-0">
      <div className="rounded-[20px] bg-transparent border border-[#ECECEC] p-6">
        <div className="items-start gap-4">
          <div>
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-blue-600 p-2">
              {profile.profilePicture && (
                <Image
                  src={profile.profilePicture}
                  alt="Profile pic"
                  width={73}
                  height={73}
                  className="object-cover w-full h-full rounded-2xl"
                />
              )}
            </div>

            {/* Name and Username */}
            <div className="mt-3">
              <h3 className="text-xl font-semibold text-[#000000]">
                {profile.firstName} {profile.lastName}
              </h3>
              <div className="mt-1 text-sm text-[#787878] font-medium">
                {profile.username}
              </div>
            </div>
          </div>

          {/* Bio and Stats */}
          <div className="mt-[10px]">
            <p className="text-[15px] font-medium text-[#000000]">
              {profile.bio}
            </p>
            {profile.createdAt && (
              <div className="text-sm text-[#787878] font-medium mt-[10px]">
                {formatJoinedDate(profile.createdAt)}
              </div>
            )}

            {/* Followers and Posts */}
            <div className="mt-4 flex items-center gap-4 text-sm font-medium text-[#787878]">
              <div>
                <span className="text-base font-bold text-black">
                  {profile.followers
                    ? profile.followers >= 1000
                      ? `${(profile.followers / 1000)
                          .toFixed(1)
                          .replace(/\.0$/, '')}k`
                      : profile.followers
                    : 0}
                </span>{' '}
                Followers
              </div>
              <div>
                <span className="text-base font-bold text-black">{0}</span>{' '}
                Posts
              </div>
            </div>

            {/* Action Buttons (for public profiles) */}
            {!isOwner && (
              <div className="mt-4 flex gap-3">
                <Button className="flex-1 border border-[#0A5DBC] bg-[#0A5DBC] text-white py-2 rounded-[15px] text-sm font-medium h-11 transition-colors duration-300 hover:bg-[#053875]">
                  Follow
                </Button>
                <Button
                  onClick={() =>
                    copyToClipboardWithToast(`/profile/${profile.username}`)
                  }
                  className="border border-[#0A5DBC] rounded-[15px] px-4 py-2 text-[#0A5DBC] bg-white text-sm font-medium h-11"
                >
                  Share
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Social Links */}
        {Array.isArray(profile.userSocialMedia) &&
          profile.userSocialMedia.some((s) => !!s.url) && (
            <>
              <Separator className="my-4 bg-[#ECECEC]" />
              <div className="flex flex-col gap-3">
                {profile.userSocialMedia
                  .filter((s) => !!s.url)
                  .map((social, i: number) => (
                    <Link
                      key={i}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex bg-white rounded-[20px] w-full overflow-hidden"
                    >
                      <div className="flex-shrink-0 w-20 h-20">
                        <Image
                          src="/map.jpg"
                          alt={social.platform}
                          width={85}
                          height={85}
                          className="h-full w-full object-cover rounded-tl-[20px] rounded-bl-[20px]"
                        />
                      </div>
                      <div className="p-4 flex-1 min-w-0">
                        <div className="text-sm font-medium text-[#000000]">
                          {social.platform}
                        </div>
                        <div className="text-xs font-medium text-[#787878] break-words break-all">
                          {social.url}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </>
          )}
      </div>
    </div>
  );
}

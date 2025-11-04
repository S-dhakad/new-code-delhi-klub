import React from 'react';
import Link from 'next/link';
import Avatar from '../common/Avatar';
import Button from '../common/ui/Button';
import Image from 'next/image';
import { Profile } from 'src/types/profile.types';
import { formatJoinedDate } from 'src/utils/formatDate';
import { copyToClipboardWithToast } from 'src/utils/copyToClipboardWithToast';

interface CreatorProfileHeroProps {
  profile: Profile;
  isOwner: boolean;
}

const CreatorProfileHero = ({ profile, isOwner }: CreatorProfileHeroProps) => {
  return (
    <div className="rounded-[20px] bg-white border shadow-sm overflow-hidden p-3">
      <Avatar
        src={profile.profilePicture || '/profile3.jpg'}
        alt={`${profile.firstName} ${profile.lastName}`}
        size={89}
        padding={8}
      />

      {/* Body */}
      <div className="mt-3">
        <h1 className="text-xl font-semibold">
          {profile.firstName} {profile.lastName}
        </h1>
        <p className="text-sm font-medium mt-1 text-text-secondary">
          {profile.username}
        </p>
        <p className="mt-2 font-medium">{profile.bio}</p>
        {profile.createdAt && (
          <p className="mt-2 text-text-secondary text-sm font-medium">
            {formatJoinedDate(profile.createdAt)}
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 font-bold">
          <div>
            {profile.followers
              ? profile.followers >= 1000
                ? `${(profile.followers / 1000).toFixed(1).replace(/\.0$/, '')}k`
                : profile.followers
              : 0}{' '}
            <span className="text-text-secondary text-sm font-medium">
              Followers
            </span>
          </div>
          <div>
            {0}{' '}
            <span className="text-text-secondary text-sm font-medium">
              Posts
            </span>
          </div>
        </div>

        {/* Actions */}
        {!isOwner ? (
          <div className="mt-4 flex items-center gap-3">
            <Button variant="primary" size="md" fullWidth className="text-sm">
              Follow
            </Button>
            <Button
              variant="outline"
              size="md"
              className="px-6 text-sm border-primary text-primary"
              onClick={() =>
                copyToClipboardWithToast(`/profile/${profile.username}`)
              }
            >
              Share
            </Button>
          </div>
        ) : (
          <div className="mt-4">
            <Link href="/setting/profile">
              <Button
                variant="outline"
                size="md"
                fullWidth
                className="text-sm border-primary text-primary"
              >
                Edit Profile
              </Button>
            </Link>
          </div>
        )}

        {/* Social Links */}
        {Array.isArray(profile.userSocialMedia) &&
          profile.userSocialMedia.some((s) => !!s.url) && (
            <>
              {/* Divider */}
              <div className="h-[1px] bg-[#ECECEC] my-4"></div>

              {/* Quick Links */}
              <section>
                <div className="flex flex-col gap-2">
                  {profile.userSocialMedia
                    .filter((s) => !!s.url)
                    .map((social, i) => (
                      <Link
                        key={i}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center bg-white rounded-[20px] border overflow-hidden"
                      >
                        <div className="w-[90px] h-[90px] flex-shrink-0">
                          <Image
                            src="/map.jpg"
                            alt={social.platform}
                            width={90}
                            height={90}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="text-sm font-medium">
                            {social.platform}
                          </div>
                          <div className="mt-2 text-xs text-text-secondary break-all">
                            {social.url}
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </section>
            </>
          )}
      </div>
    </div>
  );
};

export default CreatorProfileHero;

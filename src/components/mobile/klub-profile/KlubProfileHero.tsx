import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Button from 'src/components/mobile/common/ui/Button';
import Avatar from 'src/components/mobile/common/Avatar';
import { Community } from 'src/types/community.types';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from 'src/components/ui/popover';
import { Input } from 'src/components/ui/input';

interface KlubProfileHeroProps {
  community: Community;
  isMember: boolean;
  open: boolean;
  copied: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  formatJoinedDate: (dateString: string) => string;
  getEmbedUrl: (url: string) => string;
  getProfileLinks: () => { title: string; subtitle: string; img: string }[];
  handleJoinNow: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleCopy: () => void;
  showJoinButton?: boolean;
}

const KlubProfileHero = ({
  community,
  isMember,
  open,
  copied,
  setOpen,
  formatJoinedDate,
  getEmbedUrl,
  getProfileLinks,
  handleJoinNow,
  handleCopy,
  showJoinButton = true,
}: KlubProfileHeroProps) => {
  const links = getProfileLinks();
  const adminMember = community?.members?.find((e) => e.role == 'ADMIN');
  const ownerName = adminMember
    ? `${adminMember.user.firstName} ${adminMember.user.lastName}`.trim() ||
      adminMember.user.username
    : 'Community Owner';

  return (
    <div className="rounded-[20px] bg-white border shadow-sm overflow-hidden">
      {/* Banner */}
      <div className="relative w-full aspect-[16/9] bg-[#F2F2F2]">
        {community?.banner?.[0] ? (
          getEmbedUrl(community.banner[0] as string)?.includes('youtube') ||
          getEmbedUrl(community.banner[0] as string)?.includes('vimeo') ||
          getEmbedUrl(community.banner[0] as string)?.endsWith('.mp4') ? (
            <iframe
              src={getEmbedUrl(community.banner[0] as string)}
              title="Profile Video"
              className="w-full h-full border-0"
              style={{ objectFit: 'cover' }}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          ) : (
            <img
              src={community.banner[0] as string}
              alt="Community Banner"
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="w-full h-full bg-[#F2F2F2]" />
        )}
        {/* Avatar (absolute inside banner's relative container) */}
        <div className="absolute -bottom-10 left-3">
          <Avatar
            src={community?.image || '/badge1.jpg'}
            alt={community?.name || 'Klub avatar'}
            size={89}
            padding={8}
          />
        </div>
      </div>

      {/* Body */}
      <div className="px-3 pt-12 pb-3">
        <h1 className="text-xl font-semibold">{community?.name}</h1>
        <p className="font-medium mt-2">
          Owned by <span className="font-semibold underline">{ownerName}</span>
        </p>
        {community?.createdAt && (
          <p className="text-sm text-text-secondary mt-0.5">
            {formatJoinedDate(community.createdAt)}
          </p>
        )}

        {community?.bio && <p className="mt-2 font-medium">{community.bio}</p>}

        {/* Price */}
        {community?.subscriptionAmount && (
          <p className="mt-3 text-2xl font-bold">
            ₹{community.subscriptionAmount}{' '}
            <span className="text-text-secondary text-sm font-medium">
              /month
            </span>
          </p>
        )}

        {/* Stats */}
        <div className="mt-4 flex items-center gap-4 font-bold">
          {community?._count?.members && (
            <div>
              {community._count.members > 1000
                ? `${(community._count.members / 1000).toFixed(1)}K`
                : community._count.members}{' '}
              <span className="text-text-secondary text-sm font-medium">
                Members
              </span>
            </div>
          )}
          {community?._count?.posts && (
            <div>
              {community._count.posts || 0}{' '}
              <span className="text-text-secondary text-sm font-medium">
                Posts
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center gap-3">
          {showJoinButton && (
            <Button
              variant="primary"
              size="md"
              fullWidth
              className={`text-sm ${isMember ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleJoinNow}
              disabled={isMember}
            >
              Join now
            </Button>
          )}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="md"
                className={`px-6 text-sm border-primary text-primary ${!showJoinButton ? 'w-full' : ''}`}
              >
                Share
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="mt-5 p-5 rounded-[20px] w-[353px]"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="flex flex-col space-y-4">
                <p className="text-base font-medium text-[#787878]">
                  Copy Klub URL
                </p>
                <div className="relative">
                  <Image
                    src="/copy.svg"
                    alt="link icon"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                  />
                  <Input
                    readOnly
                    value={
                      typeof window !== 'undefined' ? window.location.href : ''
                    }
                    className="flex-1 pl-[41px] pr-[15px] py-3 bg-white text-sm font-medium text-[#000000] outline-none border border-[#ECECEC] h-10 rounded-[15px]"
                  />
                </div>
                <button
                  onClick={handleCopy}
                  className="bg-[#0A5DBC] text-white rounded-[15px] text-sm font-medium h-11 hover:bg-[#053875] transition-colors duration-300"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Divider */}
        <div className="h-[1px] bg-[#ECECEC] my-4"></div>

        {/* Quick Links */}
        <section>
          <div className="flex flex-col gap-2">
            {links.map((l, i) => (
              <div
                key={i}
                className="flex items-center bg-white rounded-[20px] border overflow-hidden"
                onClick={() => {
                  window.open(l.subtitle, '_blank');
                }}
              >
                <div className="w-[90px] h-[90px] flex-shrink-0">
                  <Image
                    src={l.img}
                    alt={l.title}
                    width={90}
                    height={90}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <div className="text-sm font-medium">{l.title}</div>
                  <div className="mt-2 text-xs text-text-secondary break-all">
                    {l.subtitle}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default KlubProfileHero;

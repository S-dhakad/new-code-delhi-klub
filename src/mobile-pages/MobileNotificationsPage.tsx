import React from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { X } from 'lucide-react';

const MobileNotificationsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-[430px] p-5 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between py-4 border-b text-text-secondary">
        <span className="font-medium text-base">Notifications</span>
        <X className="w-6 h-6" />
      </div>

      {/* Notifications list */}
      <div className="divide-y">
        {/* 1. Onboarding */}
        <div className="flex gap-3 py-4">
          <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center">
            <Image
              src="/profile-2user.svg"
              alt="onboarding"
              width={18}
              height={18}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm">
              Welcome to Klub. Complete your profile to get started
            </p>
            <div className="text-sm text-text-secondary">18 days ago</div>
            <Button className="mt-2 h-7 px-3 text-xs bg-primary text-white hover:bg-blue-600">
              Finish Profile
            </Button>
          </div>
        </div>

        {/* 2. Follow notification */}
        <div className="flex gap-3 py-4">
          <Image
            src="/community-profile.jpg"
            alt="Pang Vang"
            width={40}
            height={40}
            className="rounded-xl h-11"
          />
          <div className="flex-1">
            <p className="text-sm">
              <strong>Pang Vang</strong> followed you
            </p>
            <div className="text-sm text-text-secondary">6 days ago</div>
            <Button className="mt-2 h-7 px-3 text-xs bg-primary text-white hover:bg-blue-600">
              Follow back
            </Button>
          </div>
        </div>

        {/* 3. Mention */}
        <div className="flex gap-3 py-4">
          <Image
            src="/community-profile.jpg"
            alt="Jonathan"
            width={40}
            height={40}
            className="rounded-xl h-11"
          />
          <div className="flex-1">
            <p className="text-sm">
              <strong>Jonathan Sidwell</strong> mentioned you
            </p>
            <div className="text-sm text-text-secondary">6 days ago</div>
          </div>
        </div>

        {/* 4. Like */}
        <div className="flex gap-3 py-4">
          <Image
            src="/community-profile.jpg"
            alt="Gaurang"
            width={40}
            height={40}
            className="rounded-xl h-11"
          />
          <div className="flex-1">
            <p className="text-sm">
              <strong>Gaurang Gaikwad</strong> liked your post
            </p>
            <div className="text-sm text-text-secondary">6 days ago</div>
          </div>
        </div>

        {/* 5. Comment */}
        <div className="flex gap-3 py-4">
          <Image
            src="/community-profile.jpg"
            alt="Maz"
            width={40}
            height={40}
            className="rounded-xl h-11"
          />
          <div className="flex-1">
            <p className="text-sm">
              <strong>Maz Person (Admin)</strong> commented your post
            </p>
            <div className="text-sm text-text-secondary">6 days ago</div>
          </div>
        </div>

        {/* 6. New post */}
        <div className="flex gap-3 py-4">
          <Image
            src="/community-profile.jpg"
            alt="Neha"
            width={44}
            height={44}
            className="rounded-xl h-11"
          />
          <div className="flex-1">
            <p className="text-sm">
              <strong>Neha</strong> has added a new post to{' '}
              <span className="text-primary">#wins</span>
            </p>
            <div className="text-sm text-text-secondary">6 days ago</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNotificationsPage;

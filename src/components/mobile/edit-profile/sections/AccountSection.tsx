'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/accordion';
import Button from '../../common/ui/Button';
import Image from 'next/image';
import { useAuthStore } from 'src/store/auth.store';
import { useProfileStore } from 'src/store/profile.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AccountSection: React.FC = () => {
  const { profile, setProfile } = useProfileStore();
  const { logout } = useAuthStore();
  const router = useRouter();

  const signOutHandler = () => {
    logout();
    setProfile(null);
    router.push('/');
  };

  return (
    <div>
      <Accordion type="single" defaultValue="account" collapsible={false}>
        <AccordionItem value="account" className="rounded-xl">
          <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline [&>svg]:hidden">
            <div className="text-base font-semibold">Account</div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-primary rounded-b-[20px]">
            <div className="p-5 space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="font-semibold">Email</label>
                  <p className="font-medium text-sm text-text-secondary">
                    {profile?.email || 'Loading...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="font-semibold">Log out</label>
                  <p className="font-medium text-sm text-text-secondary">
                    End your session now
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-2 text-sm font-medium text-[#DE0000]"
                  onClick={signOutHandler}
                >
                  <Image
                    src="/logout.svg"
                    alt="logout"
                    width={18}
                    height={18}
                  />
                  <span>Log out</span>
                </Button>
              </div>

              <div className="border h-[1px]"></div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <label className="font-semibold">Delete Account</label>
                  <p className="font-medium text-sm text-text-secondary">
                    This action can&apos;t be undone
                  </p>
                </div>
                <Link href="mailto:support@klub.it.com" className="inline-flex">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex items-center gap-2 text-sm font-medium"
                  >
                    <Image
                      src="/trash.svg"
                      alt="delete"
                      width={18}
                      height={18}
                    />
                    <span>Contact Us</span>
                  </Button>
                </Link>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccountSection;

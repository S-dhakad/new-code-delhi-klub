'use client';

import { Button } from 'src/components/ui/button';
import { Separator } from 'src/components/ui/separator';
import { LogOut } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from 'src/store/auth.store';
import { useProfileStore } from 'src/store/profile.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AccountSetting() {
  const { profile, setProfile } = useProfileStore();
  const { logout } = useAuthStore();
  const router = useRouter();
  const signOutHandler = () => {
    logout();
    setProfile(null);
    router.push('/');
  };
  return (
    <div className="rounded-[20px]">
      <div className="px-6 py-4 bg-white rounded-t-[20px]">
        <h2 className="text-lg font-semibold text-[#000000]">Account</h2>
      </div>

      <div className="bg-white  px-6 py-6 space-y-6 border-t-2 border-[#0A5DBC] mt-2 rounded-b-[20px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-[#000000]">Email</p>
            <p className="text-sm font-medium text-[#787878] mt-1">
              paulaagard@gmail.com
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-[#000000]">Log out</p>
            <p className="text-sm font-medium text-[#787878] mt-1">
              End your session now
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border border-[#ECECEC] text-sm font-medium text-[#DE0000] rounded-[10px] h-[34px]"
            onClick={() => signOutHandler()}
          >
            <Image src="/logout.svg" alt="logout icon" width={18} height={18} />
            Log out
          </Button>
        </div>
        <Separator className="bg-[#ECECEC]" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-semibold text-[#000000]">
              Delete Account
            </p>
            <p className="text-sm font-medium text-[#787878] mt-1">
              This action can’t be undone
            </p>
          </div>
          <Link
            href="mailto:support@klub.it.com"
            className="inline-flex items-center justify-center border border-[#ECECEC] text-sm font-medium text-[#000000] rounded-[10px] h-[34px] px-3 hover:bg-white"
          >
            <Image
              className="mr-1"
              src="/trash.svg"
              alt="Trash"
              width={18}
              height={18}
            />
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { authService } from 'src/axios/auth/authApi';
import { getErrorMessage } from 'src/lib/getErrorMessage';
import { useToastStore } from 'src/store/toast.store';

export function SignupHero({
  triggerRazorPay,
}: {
  triggerRazorPay?: () => void;
}) {
  const showToast = useToastStore((s) => s.showToast);
  const handleGetAuthUrl = async () => {
    try {
      const response = await authService.getAuthUrl();

      // Redirect to the OAuth URL
      if (response.data.url) {
        window.location.href = response.data.url;
      }
      triggerRazorPay?.();
    } catch (error) {
      const message = getErrorMessage(error);
      showToast({
        type: 'default-error',
        title: 'Error getting auth URL',
        message,
      });
    }
  };
  return (
    <div>
      <h2 className="text-[26px] text-[#000000] font-semibold">
        Let’s <span className="text-[#0A5DBC]">Create your account</span>
      </h2>
      <p className="mt-2 text-base font-medium text-[#787878]">
        The first step to get you started
      </p>

      <div className="mt-6 flex justify-center">
        <Button
          variant="outline"
          className="w-full h-[50px] flex items-center rounded-[15px] border border-[#ECECEC] bg-white text-base font-semibold"
          onClick={handleGetAuthUrl}
        >
          <Image
            src="/googleIcon.png"
            alt="google icon"
            width={24}
            height={24}
          />
          Continue with Google
        </Button>
      </div>

      <p className="mt-4 text-sm font-medium text-[#787878]">
        Already have an account,{' '}
        <Link
          href="/login"
          className="text-[#0A5DBC] text-sm font-medium underline hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}

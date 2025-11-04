import Link from 'next/link';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { authService } from 'src/axios/auth/authApi';
import { useToastStore } from 'src/store/toast.store';
import { getErrorMessage } from 'src/lib/getErrorMessage';

export function SigninpHero() {
  const showToast = useToastStore((s) => s.showToast);
  const handleGetAuthUrl = async () => {
    try {
      const response = await authService.getAuthUrl();

      // Redirect to the OAuth URL
      if (response.data.url) {
        window.location.href = response.data.url;
      }
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
    <div className="lg:px-[46px] lg:pt-[57px] pb-[20px]">
      <h2 className="text-[26px] font-semibold text-[#000000]">
        <span className="text-[#0A5DBC]">Sign in</span> to your account
      </h2>
      <p className="mt-3 text-base font-medium text-[#787878]">Welcome back!</p>

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

      <p className="mt-3 text-sm font-medium text-[#787878]">
        Don’t have an account,{' '}
        <Link
          href="/signup"
          className="text-[#0A5DBC] text-sm font-medium underline hover:underline"
        >
          Sign up,
        </Link>
      </p>
    </div>
  );
}

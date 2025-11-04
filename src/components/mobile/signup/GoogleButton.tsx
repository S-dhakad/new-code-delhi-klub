import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import { authService } from 'src/axios/auth/authApi';
import { useCreatorRazorpayStore } from 'src/store/creator-subscriber-razorpay.store';

export function GoogleButton({
  type,
}: {
  type: 'creator' | 'login' | 'signup';
}) {
  const { setInitalizeRazorpay } = useCreatorRazorpayStore();
  const handleGetAuthUrl = async () => {
    try {
      const response = await authService.getAuthUrl();

      // Redirect to the OAuth URL
      if (response.data?.url) {
        window.location.href = response.data.url;
      }
      if (type === 'creator') {
        setInitalizeRazorpay(true);
      }
    } catch (error) {
      console.error('Error getting auth URL:', error);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full flex items-center font-semibold py-6 rounded-xl border border-[#ECECEC] bg-white hover:bg-white"
      onClick={handleGetAuthUrl}
    >
      <Image src="/googleIcon.png" alt="google icon" width={24} height={24} />
      Continue with Google
    </Button>
  );
}

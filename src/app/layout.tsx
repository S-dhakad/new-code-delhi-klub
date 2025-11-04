import type { Metadata } from 'next';
import { Poppins, Zain } from 'next/font/google';
import './globals.css';
import HeaderBar from 'src/components/header/HeaderBar';
import RouteGuard from 'src/components/RouteGuard';
import { ToastProvider } from 'src/components/ui/ToastProvider';
import HeaderSwitcher from 'src/components/header/HeaderSwitcher';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const zain = Zain({
  variable: '--font-zain',
  subsets: ['arabic'],
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Klub',
  description: 'Klub',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${zain.variable} antialiased bg-[#F6F6F6]`}
      >
        <RouteGuard>
          <ToastProvider>
            {children}
            <HeaderSwitcher />
          </ToastProvider>
        </RouteGuard>
      </body>
    </html>
  );
}

// components/RouteGuard.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isPublicRoute } from 'src/lib/publicRoutes';

type Props = { children: React.ReactNode };

export default function RouteGuard({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = () => {
      const token =
        typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null;
      const publicAllowed = isPublicRoute(pathname || '/');

      if (token || publicAllowed) {
        setAuthorized(true);
      } else {
        setAuthorized(false);
        router.replace(`/login?next=${encodeURIComponent(pathname || '/')}`);
      }
      setChecked(true);
    };

    check();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'accessToken') check();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [pathname, router]);

  if (!checked) return null;
  if (!authorized) return null;

  return <>{children}</>;
}

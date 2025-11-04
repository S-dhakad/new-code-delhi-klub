'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCommunityStore } from 'src/store/community.store';

const LINKS = [
  { href: '/setting/profile', label: 'Profile' },
  { href: '/setting/communities', label: 'Communities' },
  { href: '/setting/account', label: 'Account' },
  { href: '/setting/notifications', label: 'Notifications' },
  { href: '/setting/payments', label: 'Payments & Invoices' },
  { href: '/setting/help', label: 'Help & Support' },
];

export default function SettingsSidebar() {
  const { userCommunity } = useCommunityStore();
  const path = usePathname();

  const filteredLinks =
    userCommunity?.role === 'MEMBER'
      ? LINKS.filter((link) => link.href !== '/setting/communities')
      : LINKS;

  const getLinkClass = (href: string) =>
    `w-full text-left px-6 py-3 rounded-[15px] font-medium text-base ${
      path === href
        ? 'bg-[#0A5DBC] text-white'
        : 'rounded-[15px] text-[#000000]'
    }`;

  return (
    <aside className="max-w-[238px] w-full">
      <nav className="flex flex-col space-y-4">
        {filteredLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={getLinkClass(link.href)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

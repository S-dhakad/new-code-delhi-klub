'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from 'src/components/mobile/common/HamburgerMenu';

export default function TopBar() {
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Approx header height ~ 68px for positioning the overlay just below
  const overlayTop = '68px';

  // Lock background scroll while menu is mounted (includes fade-out duration)
  useEffect(() => {
    if (isMenuMounted) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isMenuMounted]);

  const openMenu = () => {
    setIsMenuMounted(true);
    // next frame to trigger transition
    requestAnimationFrame(() => setIsMenuVisible(true));
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    // match duration-200
    setTimeout(() => setIsMenuMounted(false), 200);
  };

  return (
    <header className="z-20 bg-[#F6F6F6] border-b relative">
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/">
          <Image src="/klub.png" alt="Klub Logo" width={63} height={63} />
        </Link>
        <div className="flex items-center gap-3">
          <div className="rounded-[10px] h-11 w-11 bg-white flex items-center justify-center">
            <Image
              src="/mobile/navbar/search.svg"
              alt="Search"
              width={22}
              height={22}
            />
          </div>
          {/* <div className="rounded-[10px] h-11 w-11 bg-white flex items-center justify-center">
            <Image
              src="/mobile/navbar/notification.svg"
              alt="Bell"
              width={22}
              height={22}
            />
          </div> */}
          <button
            type="button"
            aria-label="Open menu"
            className="rounded-[10px] h-11 w-11 bg-white flex items-center justify-center"
            onClick={openMenu}
          >
            <Image
              src="/mobile/navbar/menu.svg"
              alt="Menu"
              width={22}
              height={22}
            />
          </button>
        </div>
      </div>
      {isMenuMounted && (
        <>
          <div
            className={`fixed inset-0 z-30 transition-opacity duration-200 ${
              isMenuVisible ? 'bg-white opacity-100' : 'bg-white opacity-0'
            }`}
            style={{ top: overlayTop }}
            onClick={closeMenu}
          />
          <div
            className={`fixed left-0 right-0 z-40 transform transition-all duration-200 ${
              isMenuVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2'
            }`}
            style={{ top: overlayTop }}
          >
            <HamburgerMenu onClose={closeMenu} />
          </div>
        </>
      )}
    </header>
  );
}

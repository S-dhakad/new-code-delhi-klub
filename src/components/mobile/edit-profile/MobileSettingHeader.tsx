'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../common/ui/Button';
import HamburgerMenu from 'src/components/mobile/common/HamburgerMenu';

export default function MobileSettingHeader() {
  const [isMenuMounted, setIsMenuMounted] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  // Keep overlay below the header (~60px)
  const overlayTop = '68px';

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
    requestAnimationFrame(() => setIsMenuVisible(true));
  };

  const closeMenu = () => {
    setIsMenuVisible(false);
    setTimeout(() => setIsMenuMounted(false), 200);
  };

  return (
    <header className="z-20 bg-[#F6F6F6] border-b relative">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-lg font-semibold">Settings</h2>
        <div className="flex items-center gap-3">
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

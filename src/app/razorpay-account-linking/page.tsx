'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import { Separator } from 'src/components/ui/separator';
import { FooterLinks } from 'src/components/signup/FooterLinks';

export default function RazorpayAccountLinkingPage() {
  const [accountId, setAccountId] = useState('ABCDXYZ3344712');
  return (
    <div className="container">
      <div className="flex items-center min-h-screen">
        <div className="max-w-[1038px] w-full mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-extrabold text-[#000000]">Klub</h1>
            <Button
              type="button"
              className="inline-flex items-center gap-2 rounded-[10px] bg-[#4BD3661A] px-4 py-1 h-[34px] border border-[#ECECEC]"
            >
              <span className="w-3 h-3 rounded-full bg-[#4BD366]" />
              <span className="text-sm font-medium text-[#000000]">
                Creator
              </span>
            </Button>
          </div>
          <section className="bg-[url('/wave.png')] bg-repeat rounded-[20px] p-[30px]">
            <div className="bg-transparent rounded-[20px] flex items-stretch">
              {/* LEFT: form */}
              <div className="flex-1 flex-shrink-0">
                <h2 className="text-[26px] font-semibold text-[#000000] mb-3">
                  Link your{' '}
                  <span className="text-[#0A5DBC]">Razorpay Account</span>
                </h2>
                <p className="text-sm font-medium text-[#787878] mb-5">
                  Your Razorpay ID links your bank account to receive all
                  payments from Klub. Your details stay safe & secure with
                  Razorpay.
                </p>

                <label className="block text-sm font-medium text-[#000000] mb-3">
                  Enter Razorpay Account ID
                </label>
                <div className="mb-3">
                  <Input
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    placeholder="ABCDXYZ3344712"
                    className="w-full rounded-[15px] py-[10px] px-5 border-[#ECECEC] h-10 bg-white"
                  />
                </div>

                <div className="text-sm text-[#787878] font-medium mb-5 text-right">
                  Don’t have a Razorpay Account,{' '}
                  <a
                    className="text-[#0A5DBC] font-semibold underline"
                    href="#"
                  >
                    Create now
                  </a>
                </div>

                <Button className="w-full rounded-[15px] bg-[#0A5DBC] h-11 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#053875]">
                  Next
                </Button>
              </div>

              <span className="w-[1px] border-r border-[#ECECEC] mx-[30px]"></span>

              {/* RIGHT: media preview */}
              <div className="flex-1 flex-shrink-0">
                <div className="rounded-[20px] p-[15px] overflow-hidden bg-[#FFFFFF] border border-[#ECECEC] relative h-full">
                  {/* <iframe width="100%" height="100%" src="https://www.youtube.com/embed/rLwbLJwe2Zk?si=_0PFAUPoOyGI_fUc" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe> */}

                  <div className="h-full w-full relative">
                    <Image
                      src="/courses_image3.png"
                      alt="video thumbnail"
                      fill
                      className="object-cover rounded-[20px]"
                    />
                  </div>
                  <button
                    aria-label="Play video"
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg"
                  >
                    <Image
                      src="/playIcon1.svg"
                      alt="play icon"
                      width={42}
                      height={42}
                      className="w-[42px] h-[42px]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
          <div className="flex items-center justify-between mt-[60px]">
            <p className="text-sm font-medium text-[#787878]">
              All rights reserved @2025
            </p>
            <FooterLinks />
          </div>
        </div>
      </div>
    </div>
  );
}

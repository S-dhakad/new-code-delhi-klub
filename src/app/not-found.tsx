'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  // Add background for the body
  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);
  return (
    <main
      className="flex items-center justify-center bg-[#FFFFFF] p-6"
      style={{ height: 'calc(100vh - 128px)' }}
    >
      <div className="max-w-4xl w-full flex flex-col-reverse md:flex-row items-center gap-10 md:gap-14">
        {/* Text column */}
        <section className="flex-1 text-center md:text-left">
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900">
            404
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-xl">
            Oops — the page you are looking for doesn’t exist or has been moved.
          </p>

          <div className="flex items-center justify-start gap-3 my-4">
            <Link
              href="/"
              className="px-4 py-3 bg-[#0A5DBC] text-sm font-semibold text-[#FFFFFF] h-11 rounded-[15px] flex items-center gap-1 max-w-max transition-colors duration-300 hover:bg-[#053875]"
              aria-label="Go back home"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go back home
            </Link>
            <Link
              href="/contact"
              className="rounded-[15px] px-4 py-2 text-sm text-[#0A5DBC] font-semibold border border-[#0A5DBC] h-11 flex items-center justify-center"
            >
              Contact support
            </Link>
          </div>

          <p className="mt-6 text-sm text-slate-500">
            If you typed the URL directly, please check your spelling.
          </p>
        </section>

        {/* Illustration column */}
        <aside className="flex-1 flex items-center justify-center">
          <div className="w-[320px] h-[320px] rounded-2xl bg-gradient-to-tr from-sky-50 to-indigo-50 shadow-lg flex items-center justify-center">
            <svg
              width="220"
              height="220"
              viewBox="0 0 220 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              <rect
                x="10"
                y="10"
                width="200"
                height="200"
                rx="28"
                fill="url(#g)"
                stroke="#E6EEF8"
                strokeWidth="2"
              />
              <g opacity="0.95">
                <path
                  d="M60 150 C80 110, 140 110, 160 150"
                  stroke="#0EA5E9"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="95" cy="90" r="18" fill="#7DD3FC" />
                <circle cx="125" cy="70" r="10" fill="#60A5FA" />
              </g>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EFF6FF" />
                  <stop offset="100%" stopColor="#EEF2FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </aside>
      </div>
    </main>
  );
}

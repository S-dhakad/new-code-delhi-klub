'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';

export default function ForbiddenPage() {
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
      <div className="max-w-3xl w-full flex flex-col items-center text-center gap-6">
        <div className="rounded-2xl bg-slate-50 p-7 shadow-md border border-slate-100 w-full">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-50 mb-4">
            <Lock className="h-8 w-8 text-violet-600" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900">
            403 — Forbidden
          </h1>
          <p className="mt-3 text-slate-600">
            You do not have permission to view this resource.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-3 bg-[#0A5DBC] text-sm font-semibold text-[#FFFFFF] h-11 rounded-[15px] flex items-center gap-1 max-w-max transition-colors duration-300 hover:bg-[#053875]"
            >
              Go to dashboard
            </Link>

            <Link
              href="/contact"
              className="rounded-[15px] px-4 py-2 text-sm text-[#0A5DBC] font-semibold border border-[#0A5DBC] h-11 flex items-center justify-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Contact support
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          If you think this is a mistake, request access from the resource
          owner.
        </p>
      </div>
    </main>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 mb-4">
            <AlertTriangle className="h-8 w-8 text-amber-600" />
          </div>

          <h1 className="text-4xl font-extrabold text-slate-900">
            401 — Unauthorized
          </h1>
          <p className="mt-3 text-slate-600">
            You need to sign in to access this page or your session has expired.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/login"
              className="rounded-[15px] px-4 py-2 text-sm text-[#0A5DBC] font-semibold border border-[#0A5DBC] h-11 flex items-center justify-center"
            >
              Sign in
            </Link>
            <Link
              href="/"
              className="px-4 py-3 bg-[#0A5DBC] text-sm font-semibold text-[#FFFFFF] h-11 rounded-[15px] flex items-center gap-1 max-w-max transition-colors duration-300 hover:bg-[#053875]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
        </div>

        <p className="text-sm text-slate-500">
          If you believe this is an error, contact support.
        </p>
      </div>
    </main>
  );
}

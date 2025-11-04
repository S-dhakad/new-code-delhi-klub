// components/PricingCard.tsx
import Image from 'next/image';
import React from 'react';

export default function PricingCard() {
  const features = [
    'A community that represents your brand',
    'Your own private Social Media',
    'Create & sell unlimited digital products',
    'Host live sessions, Q&As & discussions',
    'Create & Organize community events',
    'Inbuilt payment processing (UPI, Cards)',
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-[#000000]">
          Individual Plan
        </h3>
      </div>

      {/* Plan selector bar */}
      <div className="rounded-[20px] border border-[#0A5DBC] bg-[#E6EFF8] py-3 px-5 md:p-4 flex items-start justify-between">
        <div className="flex items-center gap-[10px]">
          {/* radio */}
          <div className="flex items-center justify-center w-4 h-4 rounded-full border-2 border-[#0A5DBC]">
            <div className="w-2 h-2 rounded-full bg-sky-600" />
          </div>

          <div className="text-base font-semibold text-slate-800">Monthly</div>
        </div>

        <div className="text-right">
          <div className="text-lg md:text-xl font-semibold text-slate-900">
            Rs. 1299
            <span className="text-sm font-normal text-text-secondary">/mo</span>
          </div>
          <div className="text-xs text-text-secondary">Fixed price</div>
        </div>
      </div>

      {/* Features */}
      <div className="pt-2">
        <p className="text-sm text-text-secondary mb-4">
          This package includes
        </p>

        <ul className="flex flex-col gap-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <Image src="/Check.svg" alt="check icon" width={16} height={16} />
              <span className="text-sm md:text-base font-medium text-slate-700 dark:text-slate-200">
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-[#ECECEC] my-1" />
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-text-secondary">Total</div>
        </div>

        <div className="text-right">
          <div className="text-lg font-semibold text-slate-900">Rs. 1299</div>
          <div className="text-xs text-text-secondary">Cancel anytime</div>
        </div>
      </div>
    </div>
  );
}

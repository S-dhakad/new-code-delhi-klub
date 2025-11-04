'use client';

import { Button } from 'src/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function HelpSupport() {
  return (
    <div>
      <div className="rounded-[20px]">
        <div className="px-6 py-4 bg-white rounded-t-[20px]">
          <h2 className="text-base font-semibold text-[#000000]">
            Help & Support
          </h2>
        </div>

        <div className="bg-white  px-6 py-6 space-y-6 border-t-2 border-[#0A5DBC] mt-2 rounded-b-[20px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-[#000000]">Email</p>
              <p className="text-sm font-medium text-gray-500">
                support@klub.it.com
              </p>
            </div>
            <Link
              className="border border-[#ECECEC] text-sm font-medium text-[#000000] rounded-[10px] h-[34px] flex items-center gap-2 px-[10px]"
              href="mailto:support@klub.it.com"
            >
              <Image
                className="mr-1"
                src="/sms.svg"
                alt="Trash"
                width={18}
                height={18}
              />
              Email us
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-[#000000]">Phone</p>
              <p className="text-sm font-medium text-gray-500">
                +91-8866774524
              </p>
            </div>
            <Link
              href="tel:+911234567890"
              className="inline-flex items-center justify-center gap-2 border border-[#ECECEC] text-sm font-medium text-[#000000] rounded-[10px] h-[34px] px-3 hover:bg-white"
            >
              <Image
                className="mr-1"
                src="/call.svg"
                alt="Call icon"
                width={18}
                height={18}
              />
              Call us
            </Link>
          </div>
        </div>
      </div>
      <div className="flex gap-2 items-center justify-center my-8">
        <span className="text-[#787878] text-base font-semibold">
          Or look for an answer here
        </span>
        <Image src="/arrow-down.svg" alt="Help" width={18} height={18} />
      </div>
      <div className="rounded-[20px]">
        <div className="px-6 py-4 bg-white rounded-t-[20px]">
          <h2 className="text-base font-semibold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="bg-white  px-6 py-6 space-y-6 border-t-2 border-[#0A5DBC] mt-2 rounded-b-[20px]">
          <div className="flex items-center justify-between gap-32">
            <p className="text-base font-semibold max-w-[244px] w-full">
              Where can I find my invoices or payment history?
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm font-medium flex-1">
              Go to your Account Settings → Billing to download invoices, view
              payment history, or manage payment methods.
            </p>
          </div>
          <div className="flex items-center justify-between gap-32">
            <p className="text-base font-semibold max-w-[244px] w-full">
              Can I get a refund if I change my mind?
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm font-medium flex-1">
              Refunds are handled by the individual Klub creator. Klub does not
              issue refunds directly. Reach out to the owner/admin of the Klub
              you paid for.
            </p>
          </div>
          <div className="flex items-center justify-between gap-32">
            <p className="text-base font-semibold max-w-[244px] w-full">
              How are payments processed on Klub?
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm font-medium flex-1">
              All payments are handled via Razorpay — a secure global payments
              provider. Your card information is not stored by Klub directly.
            </p>
          </div>
          <div className="flex items-center justify-between gap-32">
            <p className="text-base font-semibold max-w-[244px] w-full">
              Can I pause or cancel my subscription?
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm font-medium flex-1">
              Yes, you can cancel your subscription anytime under Billing
              Settings. You will retain access until the end of your billing
              cycle. Pausing is not currently supported.
            </p>
          </div>
          <div className="flex items-center justify-between gap-32">
            <p className="text-base font-semibold max-w-[244px] w-full">
              Where can I find my invoices or payment history?
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm font-medium flex-1">
              Go to your Account Settings → Billing to download invoices, view
              payment history, or manage payment methods.
            </p>
          </div>
          <div className="flex items-center justify-between gap-32">
            <p className="text-base font-semibold max-w-[244px] w-full">
              Can I run paid courses or communities on Klub?
            </p>
            <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm font-medium flex-1">
              Yes. You can set pricing, accept payments via Razorpay, and gate
              content or community access based on payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

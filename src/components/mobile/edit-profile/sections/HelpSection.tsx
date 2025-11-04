'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/accordion';
import Button from '../../common/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

const HelpSection: React.FC = () => {
  const faqs = [
    {
      question: 'Where can I find my invoices or payment history?',
      answer:
        'Go to your Account Settings → Billing to download invoices, view payment history, or manage payment methods.',
    },
    {
      question: 'Can I get a refund if I change my mind?',
      answer:
        'Refunds are handled by the individual Klub creator. Klub does not issue refunds directly. Reach out to the owner/admin of the Klub you paid for.',
    },
    {
      question: 'How are payments processed on Klub?',
      answer:
        'All payments are handled via Razorpay — a secure global payments provider. Your card information is not stored by Klub directly.',
    },
    {
      question: 'Can I pause or cancel my subscription?',
      answer:
        'Yes, you can cancel your subscription anytime under Billing Settings. You will retain access until the end of your billing cycle. Pausing is not currently supported.',
    },
    {
      question: 'Where can I find my invoices or payment history?',
      answer:
        'Go to your Account Settings → Billing to download invoices, view payment history, or manage payment methods.',
    },
    {
      question: 'Can I run paid courses or communities on Klub?',
      answer:
        'Yes. You can set pricing, accept payments via Razorpay, and gate content or community access based on payment.',
    },
  ];
  return (
    <div className="space-y-7">
      <div>
        <Accordion type="single" defaultValue="help" collapsible={false}>
          <AccordionItem value="help" className="rounded-xl">
            <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline [&>svg]:hidden">
              <div className="text-base font-semibold">Help & Support</div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-primary rounded-b-[20px]">
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="font-semibold">Email</label>
                    <p className="font-medium text-sm text-text-secondary">
                      support@klub.it.com
                    </p>
                  </div>
                  <Link href="mailto:support@klub.it.com">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Image src="/sms.svg" alt="sms" width={18} height={18} />
                      <span>Email us</span>
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label className="font-semibold">Phone</label>
                    <p className="font-medium text-sm text-text-secondary">
                      +91-8866774524
                    </p>
                  </div>
                  <Link href="tel:+918866774524">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-2 text-sm font-medium"
                    >
                      <Image
                        src="/call.svg"
                        alt="call"
                        width={18}
                        height={18}
                      />
                      <span>Call us</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <p className="font-semibold text-text-secondary text-center">
        Or look for an answer here ↓
      </p>

      <div>
        <Accordion type="single" defaultValue="faq" collapsible={false}>
          <AccordionItem value="faq" className="rounded-xl">
            <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline [&>svg]:hidden">
              <div className="text-base font-semibold">
                Frequently Asked Questions
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-[#0A5DBC] rounded-b-[20px] p-5 text-sm">
              <div className="flex flex-col gap-5">
                {faqs.map((faq) => (
                  <div key={faq.question} className="flex flex-col gap-4">
                    <div className="text-base font-semibold">
                      {faq.question}
                    </div>
                    <p className="p-4 bg-[#F6F6F6] rounded-[15px] text-sm leading-6 font-medium">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default HelpSection;

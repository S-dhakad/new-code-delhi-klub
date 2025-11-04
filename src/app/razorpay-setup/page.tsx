'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'src/components/ui/button';
import { Input } from 'src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { Card, CardContent } from 'src/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { useToastStore } from 'src/store/toast.store';
import razorpayApi from 'src/axios/razorpay/razorpayApi';
import type { CreateRazorpayAccountInput } from 'src/types/razorpay.types';
import { useIsMobile } from 'src/hooks/useIsMobile';
import CreatorDetailHeader from 'src/components/mobile/detail-creator/CreatorDetailHeader';
import { SubscribeBadge } from 'src/components/mobile/common/SubscribeBadge';
import { useRezorPayEmailcheck } from 'src/hooks/useRezorPayEmailcheck';

export default function RazorpaySetupComponent() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const searchParams = useSearchParams();
  const { showToast } = useToastStore();
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Get communityId from URL params
  const communityId = searchParams.get('communityId');

  useEffect(() => {
    document.body.classList.add('bg-[#FFFFFF]');
    return () => {
      document.body.classList.remove('bg-[#FFFFFF]');
    };
  }, []);

  useEffect(() => {
    // Redirect if no communityId is provided
    if (!communityId) {
      showToast({
        title: 'Missing Community ID',
        message: 'Please create a community first.',
        type: 'default-error',
      });
      router.push('/create-community');
    }
  }, [communityId, router, showToast]);

  const steps = [
    { image: '/profile-circle.svg', title: 'Account Setup' },
    { image: '/personalcard.svg', title: 'Business Details' },
    { image: '/cards.svg', title: 'Bank Account' },
  ];

  // Step 1 fields
  const [accountName, setAccountName] = useState('');
  const [accountEmail, setAccountEmail] = useState('');
  const [accountPhone, setAccountPhone] = useState('');
  const [country, setCountry] = useState('India');
  const [Street1, setStreet1] = useState('');
  const [Street2, setStreet2] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [state, setState] = useState('');

  // Step 2 fields
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');

  // Step 3 fields
  const [ifsc, setIfsc] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountNumberConfirm, setAccountNumberConfirm] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const { emailExists, isChecking, checkEmail, updateEmail } =
    useRezorPayEmailcheck();

  // Check email as user types
  useEffect(() => {
    const debounceTimer = setTimeout(async () => {
      if (accountEmail && accountEmail.includes('@')) {
        try {
          const result = await checkEmail(accountEmail);
          console.log('Razorpay email check result:', result);
          if (result?.isAvailable) {
            console.log({ result, communityId });
            if (communityId) {
              const response = await updateEmail(communityId, accountEmail);

              if (response) {
                showToast({
                  title: 'Email Available',
                  message: 'Email updated successfully',
                  type: 'default-success',
                });
              }
            }
          } else {
            showToast({
              type: 'default-error',
              title: 'already registered',
              message:
                'This Razorpay email is already associated with another registered account',
            });
          }
        } catch (error) {
          console.error('Error checking email:', error);
        }
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [accountEmail]);

  // Form validation
  const validateStep1 = () => {
    if (!accountName.trim()) {
      showToast({
        title: 'Validation Error',
        message: 'Account name is required.',
        type: 'default-error',
      });
      return false;
    }
    if (!accountEmail.trim() || !/\S+@\S+\.\S+/.test(accountEmail)) {
      showToast({
        title: 'Validation Error',
        message: 'Please enter a valid email address.',
        type: 'default-error',
      });
      return false;
    }
    if (!accountPhone.trim() || accountPhone.length < 10) {
      showToast({
        title: 'Validation Error',
        message: 'Please enter a valid phone number.',
        type: 'default-error',
      });
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!businessName.trim()) {
      showToast({
        title: 'Validation Error',
        message: 'Business name is required.',
        type: 'default-error',
      });
      return false;
    }
    if (!businessType) {
      showToast({
        title: 'Validation Error',
        message: 'Please select a business type.',
        type: 'default-error',
      });
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!ifsc.trim() || ifsc.length !== 11) {
      showToast({
        title: 'Validation Error',
        message: 'Please enter a valid 11-character IFSC code.',
        type: 'default-error',
      });
      return false;
    }
    if (!accountNumber.trim()) {
      showToast({
        title: 'Validation Error',
        message: 'Account number is required.',
        type: 'default-error',
      });
      return false;
    }
    if (accountNumber !== accountNumberConfirm) {
      showToast({
        title: 'Validation Error',
        message: 'Account numbers do not match.',
        type: 'default-error',
      });
      return false;
    }
    if (!beneficiary.trim()) {
      showToast({
        title: 'Validation Error',
        message: 'Beneficiary name is required.',
        type: 'default-error',
      });
      return false;
    }
    return true;
  };

  const handleNextStep = (currentStep: number) => {
    if (currentStep === 1 && !validateStep1()) return;
    if (currentStep === 2 && !validateStep2()) return;
    setStep(currentStep + 1);
  };

  const handleSubmit = async () => {
    if (!validateStep3()) return;
    if (!communityId) {
      showToast({
        type: 'default-error',
        title: 'Community ID missing',
      });
      return;
    }

    setLoading(true);
    try {
      const accountData: CreateRazorpayAccountInput = {
        accountName: accountName.trim(),
        accountEmail: accountEmail.trim(),
        businessName: businessName.trim(),
        businessType,
        bankIFSCCode: ifsc.trim().toUpperCase(),
        accountNumber: accountNumber.trim(),
        reEnterAccountNumber: accountNumberConfirm.trim(),
        beneficiaryName: beneficiary.trim(),
        phoneNumber: accountPhone.trim(),
        street1: Street1.trim(),
        street2: Street2.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
      };

      const response = await razorpayApi.createRazorpayAccount(
        communityId,
        accountData,
      );

      if (response.success) {
        showToast({
          title: 'Success!',
          message: 'Razorpay account created successfully.',
          type: 'default-success',
        });

        // Redirect to community profile
        router.push(`/community-profile?communityId=${communityId}`);
      } else {
        showToast({
          title: 'Account Creation Failed',
          message: response.message || 'Failed to create Razorpay account.',
          type: 'default-error',
        });
      }
    } catch (error) {
      showToast({
        title: 'Error',
        message:
          'An error occurred while creating your Razorpay account. Please try again.',
        type: 'default-error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {isMobile ? (
        <CreatorDetailHeader />
      ) : (
        <div className="border-b border-[#ECECEC]">
          <div className="container">
            <div className="pt-[45px] pb-[20px]">
              <div className="w-full max-w-[1112px] mx-auto">
                <div className="flex items-center justify-between">
                  <Link
                    href="/"
                    className="text-4xl font-extrabold text-[#000000]"
                  >
                    Klub
                  </Link>
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
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-[471px] mx-auto px-4 py-6 md:px-0 md:py-11">
        {isMobile && (
          <div className="mb-3">
            <SubscribeBadge type="creator" />
          </div>
        )}
        <h1 className="text-[22px] md:text-[26px] font-medium text-[#000000]">
          Setup your <span className="text-primary">Razorpay Account</span>
        </h1>
        <p className="mt-3 text-sm font-medium text-[#787878]">
          Your Razorpay Account links your bank account to receive all payments
          from Klub.
        </p>

        <div className="mt-8">
          <div className="flex items-center justify-center">
            <Card className="rounded-[20px] p-[14px] w-full border border-[#ECECEC] bg-[#F6F6F6]">
              <CardContent className="flex items-center justify-between gap-6 px-0">
                {steps.map((s, idx) => {
                  const idx1 = idx + 1;
                  const isActive = step === idx1;
                  return (
                    <Fragment key={idx}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center justify-center rounded-[20px] h-[52px] w-[52px] overflow-hidden ${
                            isActive ? 'bg-[#0A5DBC]' : 'bg-white'
                          }`}
                        >
                          {s.image ? (
                            <Image
                              src={s.image}
                              alt={s.title}
                              width={24}
                              height={24}
                              className={`h-6 w-6 object-contain ${isActive ? 'filter brightness-0 invert' : ''}`}
                            />
                          ) : (
                            <span className="text-sm font-semibold">
                              {idx1}
                            </span>
                          )}
                        </div>
                        {isActive && (
                          <div className="text-sm">
                            <div className="text-sm font-medium text-[#000000]">
                              Step {idx1}/3
                            </div>
                            <div className="mt-1 text-base font-semibold text-[#000000]">
                              {s.title}
                            </div>
                          </div>
                        )}
                      </div>
                      {idx < steps.length - 1 && (
                        <div className="w-[1px] h-9 bg-[#ECECEC]" />
                      )}
                    </Fragment>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Forms */}
          <div className="mt-8">
            {step === 1 && (
              <form className="space-y-5 max-w-xl mx-auto">
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Enter Account Name
                  </label>
                  <Input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Enter Your Name"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                  <p className="mt-3 text-sm font-medium text-[#787878]">
                    This would be the name of the Account on Klub, and would be
                    in all invoices
                  </p>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Enter Account Email
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={accountEmail}
                      onChange={(e) => setAccountEmail(e.target.value)}
                      placeholder="Enter Account Email"
                      className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                    />
                    {isChecking && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Image
                          src="/loader.svg"
                          alt="checking"
                          width={20}
                          height={20}
                          className="animate-spin"
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-medium text-[#787878]">
                    This email would be used to access the dashboard on Razorpay
                  </p>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Enter Phone number
                  </label>
                  <Input
                    type="number"
                    value={accountPhone}
                    onChange={(e) => setAccountPhone(e.target.value)}
                    placeholder="Enter Phone number"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                  <p className="mt-3 text-sm font-medium text-[#787878]">
                    This phone number would be the primary number registered
                    with Razorpay
                  </p>
                </div>
                <div>
                  <h6 className="text-base text-[#787878] font-medium mb-5">
                    Location details
                  </h6>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Country
                  </label>
                  <Input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Enter Country Name"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Street 1
                  </label>
                  <Input
                    type="text"
                    value={Street1}
                    onChange={(e) => setStreet1(e.target.value)}
                    placeholder="Enter Street first"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Street 2
                  </label>
                  <Input
                    type="text"
                    value={Street2}
                    onChange={(e) => setStreet2(e.target.value)}
                    placeholder="Enter Street second"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    City
                  </label>
                  <Input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter Street second"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Select State
                  </label>
                  <Select value={state} onValueChange={(v) => setState(v)}>
                    <SelectTrigger
                      style={{ height: '40px' }}
                      className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] text-sm font-medium text-[#000000] w-full"
                    >
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="uttarpradesh">
                        Uttar Pradesh
                      </SelectItem>
                      <SelectItem value="gujarat">Gujarat</SelectItem>
                      <SelectItem value="rajasthan">Rajasthan</SelectItem>
                      <SelectItem value="madhya pradesh">
                        Madhya Pradesh
                      </SelectItem>
                      <SelectItem value="telangana">Telangana</SelectItem>
                      <SelectItem value="andhra pradesh">
                        Andhra Pradesh
                      </SelectItem>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="kerala">Kerala</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Postal Code
                  </label>
                  <Input
                    type="number"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Enter Street second"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextStep(1);
                    }}
                    className="mt-[10px] rounded-[15px] px-10 bg-[#0A5DBC] w-[218px] py-2 h-10 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#053875]"
                  >
                    Next
                  </Button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className="space-y-6 max-w-xl mx-auto">
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Enter Business Name
                  </label>
                  <Input
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Enter Business Name"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                  <p className="mt-3 text-sm font-medium text-[#787878]">
                    This would be the Name of the Community
                  </p>
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Enter Business Type
                  </label>
                  <Select
                    value={businessType}
                    onValueChange={(v) => setBusinessType(v)}
                  >
                    <SelectTrigger
                      style={{ height: '40px' }}
                      className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] text-sm font-medium text-[#000000] w-full"
                    >
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Individual">Individual</SelectItem>
                      <SelectItem value="Company">Company</SelectItem>
                      <SelectItem value="Partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-5 justify-end">
                  <Button
                    type="button"
                    className="mt-[10px] rounded-[15px] bg-transparent px-0 py-2 h-10 text-sm font-medium text-[#000000] hover:bg-transparent"
                    onClick={() => setStep(1)}
                  >
                    <Image
                      src="/arrow-left.svg"
                      alt="arrow icon"
                      width={18}
                      height={18}
                    />
                    Back
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextStep(2);
                    }}
                    className="mt-[10px] rounded-[15px] px-10 bg-[#0A5DBC] w-[218px] py-2 h-10 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#053875]"
                  >
                    Next
                  </Button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className="space-y-6 max-w-xl mx-auto">
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Branch IFSC Code
                  </label>
                  <Input
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    placeholder="Enter IFSC Code"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Account Number
                  </label>
                  <Input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter Account Number"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Re-Enter Account Number
                  </label>
                  <Input
                    value={accountNumberConfirm}
                    onChange={(e) => setAccountNumberConfirm(e.target.value)}
                    placeholder="Re-Enter Account Number"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>
                <div>
                  <label className="mb-3 block text-sm font-medium text-[#000000]">
                    Beneficiary Name
                  </label>
                  <Input
                    value={beneficiary}
                    onChange={(e) => setBeneficiary(e.target.value)}
                    placeholder="Beneficiary Name"
                    className="rounded-[15px] border border-[#ECECEC] px-5 py-[10px] h-10 text-sm font-medium text-[#000000]"
                  />
                </div>

                <div className="flex items-center gap-5 justify-end">
                  <Button
                    type="button"
                    className="mt-[10px] rounded-[15px] bg-transparent px-0 py-2 h-10 text-sm font-medium text-[#000000] hover:bg-transparent"
                    onClick={() => setStep(2)}
                  >
                    <Image
                      src="/arrow-left.svg"
                      alt="arrow icon"
                      width={18}
                      height={18}
                    />
                    Back
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit();
                    }}
                    disabled={loading}
                    className={`mt-[10px] rounded-[15px] px-10 bg-[#0A5DBC] w-[218px] py-2 h-10 text-base font-semibold text-white transition-colors duration-300 hover:bg-[#053875] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Creating Account...' : 'Submit'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

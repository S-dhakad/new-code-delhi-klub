'use client';
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from 'src/components/ui/accordion';
import GeneralInfo from './communities-section/GeneralInfo';
import CommunitySocialLinks from './communities-section/SocialLinks';
import FeaturePost from './profile-section/FeaturePost';
import MobileMembership from './profile-section/MobileMembership';
import Courses from './communities-section/Courses';

const CommunitiesSection: React.FC = () => {
  return (
    <div>
      <Accordion type="multiple" className="space-y-7">
        <AccordionItem value="general" className="rounded-xl">
          <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline">
            <div className="text-base font-semibold">General Info</div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-primary rounded-b-[20px]">
            <GeneralInfo />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="social" className="rounded-xl">
          <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline">
            <div className="text-base font-semibold">Social Links</div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-primary rounded-b-[20px]">
            <CommunitySocialLinks />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="membership" className="rounded-xl">
          <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline">
            <div className="text-base font-semibold">Courses</div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-primary rounded-b-[20px]">
            <Courses />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="feature" className="rounded-xl">
          <AccordionTrigger className="px-5 py-6 bg-white rounded-[20px] hover:no-underline">
            <div className="text-base font-semibold">Feature Post</div>
          </AccordionTrigger>
          <AccordionContent className="pb-0 mt-4 bg-white border-t-2 border-primary rounded-b-[20px]">
            <FeaturePost />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default CommunitiesSection;

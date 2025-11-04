'use client';

import React from 'react';
import { Button } from 'src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from 'src/components/ui/card';
import { useCommunityStore } from 'src/store/community.store';

type Props = {
  onAddClick: () => void;
  spaces?: string[];
  selectedSpace?: string;
  onSpaceSelect?: (space: string) => void;
  activeIsAll?: boolean;
};

export default function SpacesSidebar({
  onAddClick,
  spaces = [],
  selectedSpace = '# All',
  onSpaceSelect,
  activeIsAll = false,
}: Props) {
  const handleSpaceClick = (space: string) => {
    if (onSpaceSelect) {
      onSpaceSelect(space);
    }
  };

  const { userCommunity } = useCommunityStore();

  return (
    <Card className="border border-[#ECECEC] rounded-[20px] py-[20px] gap-5">
      <CardHeader className="px-5 gap-0">
        <CardTitle className="text-base font-medium text-[#787878]">
          Spaces
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5">
        <div className="flex flex-wrap gap-2">
          {/* Always show the All option */}
          <button
            onClick={() => handleSpaceClick('# All')}
            className={`px-3 py-1 rounded-[10px] h-[34px] border text-sm font-medium transition-colors ${
              activeIsAll
                ? 'bg-[#E6EFF8] border-[#0A5DBC] text-[#0A5DBC]'
                : 'bg-#FFFFFF border-[#ECECEC] hover:bg-gray-100 text-[#787878]'
            }`}
          >
            # All
          </button>

          {/* Render other spaces */}
          {spaces.map((s, i) => (
            <button
              key={s + i}
              onClick={() => handleSpaceClick(s)}
              className={`px-3 py-1 rounded-[10px] h-[34px] border text-sm font-medium transition-colors ${
                s === selectedSpace && !activeIsAll
                  ? 'bg-[#E6EFF8] border-[#0A5DBC] text-[#0A5DBC]'
                  : 'bg-#FFFFFF border-[#ECECEC] hover:bg-gray-100 text-[#787878]'
              }`}
            >
              {s}
            </button>
          ))}

          {/* Show Add new only if not a MEMBER */}
          {userCommunity?.role !== 'MEMBER' && (
            <Button
              onClick={onAddClick}
              className="bg-[#0A5DBC] rounded-[10px] h-[34px] text-white font-medium hover:text-white hover:bg-[#053875] transition-colors duration-300"
            >
              + Add new
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

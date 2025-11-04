'use client';

import React from 'react';
import moment from 'moment';
import { Badge } from 'src/components/ui/badge';
import { Button } from 'src/components/ui/button';

type Member = {
  user: {
    firstName: string;
    lastName: string;
  };
  subscription: {
    paymentDate: string;
    length: number;
    paidAmount: string;
  };
  status: string;
};

interface DashboardTableProps {
  members: Member[];
}

export const DashboardTable: React.FC<DashboardTableProps> = ({ members }) => {
  return (
    <div className="rounded-[20px] border border-[#ECECEC] ">
      <table className="overflow-hidden rounded-[20px] w-full table-auto">
        <thead className="bg-white">
          <tr className="text-left text-sm font-semibold text-[#000000]">
            <th className="pl-[30px] pr-[15px] py-[25px] text-nowrap">
              Subscribers
            </th>
            <th className="px-[15px] py-[25px] text-nowrap">Joining Date</th>
            <th className="px-[15px] py-[25px] text-nowrap">Duration</th>
            <th className="px-[15px] py-[25px] text-nowrap">Amount</th>
            <th className="px-[15px] py-[25px] text-nowrap">Status</th>
            <th className="pl-[15px] pr-[30px] py-[25px] text-nowrap">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="bg-surface">
          {members?.map((m, idx) => (
            <tr
              key={idx}
              className="border-t border-[#ECECEC] text-base font-medium text-[#000000]"
            >
              <td className="pl-[30px] pr-[15px] py-[25px] text-nowrap">
                {m?.user?.firstName} {m?.user?.lastName}
              </td>
              <td className="px-[15px] py-[25px] text-nowrap">
                {moment(m?.subscription?.paymentDate).format('DD MMM YYYY')}
              </td>
              <td className="px-[15px] py-[25px] text-nowrap">
                {m?.subscription?.length || 1} months
              </td>
              <td className="px-[15px] py-[25px] text-nowrap">
                {m?.subscription?.paidAmount &&
                Number(m?.subscription?.paidAmount) > 0
                  ? m?.subscription?.paidAmount
                  : 'Free'}
              </td>

              <td className="px-[15px] py-[25px] text-nowrap">
                {m?.status === 'ACTIVE' ? (
                  <Badge className="rounded-[10px] py-2 px-[18px] border border-[#9BF89B] bg-[#DFFDDF] text-[#007B00] text-sm font-medium h-[34px]">
                    Active
                  </Badge>
                ) : (
                  <Badge className="rounded-[10px] py-2 px-[18px] border border-[#FFB8B8] bg-[#FCDCDC] text-[#DE0000] text-sm font-medium h-[34px]">
                    Inactive
                  </Badge>
                )}
              </td>

              <td className="pl-[15px] pr-[30px] py-[25px] text-nowrap">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-[10px] px-[15px] border border-[#ECECEC] text-[#DE0000] text-sm font-semibold h-[34px] hover:text-[#DE0000]"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

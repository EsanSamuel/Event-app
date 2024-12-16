"use client";
import { Event, Reserve, User } from "@prisma/client";
import React from "react";
import { format } from "date-fns";

interface Props {
  event: Event & {
    user: User;
  };
  currentUser: User;
  rsvd: {
    id: string;
    eventId: string;
    userId: string;
    reservedAt: Date;
    user: User;
  }[];
  isAuthorized: boolean;
}

const RsvdPage = ({ event, rsvd, currentUser, isAuthorized }: Props) => {
  return (
    <div className="lg:px-[15%] p-3 lg:py-10">
      <h1 className="text-center font-bold text-[25px]">Reserved Page</h1>
      <p className="text-[14px] text-gray-600 text-center">
        As an event orgenizer, check the people thet registered for this event
      </p>
      <div className="overflow-x-auto mt-5">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Username
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Reserved At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Ticket
              </th>
            </tr>
          </thead>
          <tbody>
            {rsvd?.map((list) => (
              <tr key={list.id} className="hover:bg-gray-50 lg:text-[15px]">
                <td className="border border-gray-300 px-4 py-2">
                  {list?.user?.username}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {list?.user?.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {format(new Date(list?.reservedAt), "dd, MM, yyyy")}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <button className="px-4 py-1 rounded-full text-white bg-[#1da1f2] ">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RsvdPage;
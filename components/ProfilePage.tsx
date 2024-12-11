"use client";
import { $Enums, Event, Reserve, User } from "@prisma/client";
import React from "react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Card from "./Card";

interface Props {
  currentUser: User;
  userEvents: Event[];
  events: Event[];
  rsvd: {
    id: string;
    event: Event;
    user: User;
    reservedAt: Date;
    userId: string;
    eventId: string;
  }[];
  userRsvd: {
    id: string;
    event: Event;
    user: User;
    reservedAt: Date;
    userId: string;
    eventId: string;
  }[];
}

interface IReserveProps {
  id: string;
  event: Event;
  user: User;
  reservedAt: Date;
  userId: string;
  eventId: string;
}

const ProfilePage = ({
  currentUser,
  userEvents,
  events,
  rsvd,
  userRsvd,
}: Props) => {
  const [userReserved, setUserReserved] = React.useState<IReserveProps[]>([]);
  console.log(rsvd)

  React.useEffect(() => {
    const filterReserved = async () => {
      if (!currentUser?.id) return;
      const userRsvd = rsvd.filter((item) => item.user.id === currentUser?.id);
      console.log(userRsvd)
      setUserReserved(userRsvd);
    };
    filterReserved();
  }, [currentUser?.id]);

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Image
          src={currentUser?.image! || ""}
          alt="profile picture"
          width={1000}
          height={1000}
          className="w-[300px] h-[300px] rounded-[20px] border-[1px]"
        />
        <div className="mt-4 flex flex-col gap-1 pb-5">
          <h1 className="text-[15px] font-bold flex b">
            {currentUser.username}
          </h1>
          <p className="text-[13px]">{currentUser.email}</p>
        </div>
      </div>
      <Separator />
      <div className="mt-5">
        <h1 className="text-[20px] font-bold">Your Events</h1>
        <p className="text-[13px] text-gray-500">
          Here are the events you listed
        </p>
        <div className="lg:py-10 py-3 grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 w-full pb-5">
          {userEvents?.map((event) => (
            <Card key={event.id} event={event} />
          ))}
        </div>
        <Separator />
        <div className="mt-5">
          <h1 className="text-[20px] font-bold">Reserved Events</h1>
          <p className="text-[13px] text-gray-500">
            Events you reserved a seat for.
          </p>
          <div className="lg:py-10 py-3 grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 w-full pb-5">
            {userReserved?.map((event) => (
              <Card key={event.id} event={event.event!} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

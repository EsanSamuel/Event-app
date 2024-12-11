"use client";
import Image from "next/image";
import React from "react";
import { IoLocationSharp } from "react-icons/io5";
import { Button } from "./ui/button";
import { Event } from "@prisma/client";
import { useRouter } from "next/navigation";

interface EventProps {
  event: Event;
}

const Card = ({ event }: EventProps) => {
  const router = useRouter();
  const handleDetails = () => {
    router.push(`/event-details/${event.id}`);
  };
  return (
    <div className=" flex flex-col gap-3 max-w-[300px]">
      <Image
        src={event.thumbnail! || ""}
        alt="event image"
        className="rounded-[10px] w-full h-[140px]"
        width={300}
        height={300}
      />
      <div className="">
        <h1 className="text-[16px] font-bold">{event.title}</h1>
        <p className="flex gap-2 items-center text-[12px]">
          <IoLocationSharp /> {event.location}
        </p>
      </div>
      <Button
        className="w-full bg-[#1da1f2] rounded-full"
        onClick={handleDetails}
      >
        View more
      </Button>
    </div>
  );
};

export default Card;

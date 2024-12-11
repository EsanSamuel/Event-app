"use client";
import { addGuest, getEvent, reserveEvent } from "@/lib/actions/event.actions";
import { $Enums, Event, Guest, Reserve, User } from "@prisma/client";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useTransition } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { CiCalendarDate, CiLocationOn } from "react-icons/ci";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineReduceCapacity } from "react-icons/md";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import QRCode from "qrcode";

interface IEventProps {
  event: {
    id: string;
    title: string;
    thumbnail: string | null;
    details: string;
    location: string;
    dateTime: string;
    venueImages: string[];
    capacity: number;
    category: $Enums.EventCategory;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
    };
  };
  currentUser: User;
  guests: Guest[];
  rsvd: Reserve[];
}

interface reservedProps {
  reserve: {
    id: string;
    event: Event;
    user: User;
    reservedAt: Date;
  };
}

const EventPage = ({ event, currentUser, guests, rsvd }: IEventProps) => {
  const [image, setImage] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [src, setSrc] = React.useState<string>("");
  const isAuthor = event.user.id === currentUser.id;
  const path = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      console.log("Select Image only!");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;

      setImage(result);
    };
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventId = event.id;
      await addGuest({ name, description, image, eventId, path });
      setImage("");
    } catch (error: any) {
      console.log("Adding guest failed", error);
    }
  };

  const handleReserve = async () => {
    try {
      startTransition(async () => {
        const eventId = event.id;
        await reserveEvent(eventId, path);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const isReserved = React.useMemo(() => {
    const rsvdUserId = rsvd.map((reserve: any) => reserve?.user?.id);
    return rsvdUserId.includes(currentUser.id);
  }, [currentUser.id]);

  const generateQrcode = () => {
    QRCode.toDataURL(`http://localhost:3000/`).then(setSrc);
  };

  return (
    <div className="lg:px-[15%] px-3 lg:py-10 py-3 flex flex-col items-center">
      <h1 className="text-center font-bold text-[22px] pb-5">Event Details</h1>
      <Image
        src={event?.thumbnail!}
        alt="event image"
        className="rounded-[10px] w-full lg:w-[700px] lg:h-[400px] h-[250px]"
        width={5000}
        height={5000}
      />

      <h1 className="text-[30px] font-bold text-center pt-5">{event?.title}</h1>
      <div className="grid grid-cols-2 gap-8 mt-10">
        <div className="flex gap-5 items-center">
          <CiLocationOn /> {event.location}
        </div>
        <div className="flex gap-5 items-center">
          <CiCalendarDate /> {event.dateTime}
        </div>
        <div className="flex gap-5 items-center">
          <MdOutlineCategory /> {event.category}
        </div>
        <div className="flex gap-5 items-center">
          <MdOutlineReduceCapacity /> {event.capacity}
        </div>
      </div>
      <textarea
        value={event?.details}
        className="h-auto w-full min-h-[400px] outline-none mt-10  text-[14px]"
        readOnly
      ></textarea>

      <div className="mt-10 text-center ">
        <h1 className="font-bold text-[20px]">Guests</h1>
        <p className="text-gray-600 text-[13px]">
          Here are the guests invited for this event
        </p>
        {guests?.length > 0 ? (
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 mt-5">
            {guests?.map((guest) => (
              <div
                className=" flex flex-col gap-3 max-w-[300px]"
                key={guest.id}
              >
                <Image
                  src={guest.image!}
                  alt="event image"
                  className="rounded-[10px] w-full h-[140px]"
                  width={300}
                  height={300}
                />
                <div className="text-center">
                  <h1 className="text-[16px] text-center font-bold">
                    {guest.name}
                  </h1>
                  <p className=" text-center text-[12px]">
                    {guest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[14px] mt-5">No Guest Added!</div>
        )}
        {isAuthor && (
          <AlertDialog>
            <AlertDialogTrigger className="mt-5 bg-[#121212] rounded-full py-2 text-white px-4 text-[11px]">
              Add Guests
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Guests</AlertDialogTitle>
                <AlertDialogDescription>
                  Add guests to this event!
                </AlertDialogDescription>
                <div className=" mt-3 flex flex-col gap-2">
                  {image && (
                    <div className="flex items-center justify-center rounded-full">
                      <Image
                        src={image}
                        width={200}
                        height={200}
                        className="rounded-full w-20 h-20"
                        alt="guest image"
                      />
                    </div>
                  )}
                  <label className="flex flex-col gap-2">
                    <h1 className="text-[12px] text-start">Guest name</h1>
                    <input
                      className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                      placeholder="Enter Name"
                      type="text"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <h1 className="text-[12px] text-start">
                      Guest description
                    </h1>
                    <input
                      className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                      placeholder="Enter description"
                      type="text"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <h1 className="text-[12px] text-start">Guest Image</h1>
                    <input
                      className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                      type="file"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleAddGuest}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      <div className="mt-10 text-center">
        <h1 className="font-bold text-[20px]">Venue Images</h1>
        <p className="text-gray-600 text-[13px]">
          Here are the venue images for this event
        </p>
        {event?.venueImages?.length > 0 ? (
          <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 mt-5">
            {event?.venueImages?.map((image, index) => (
              <div className=" flex flex-col gap-3 max-w-[300px]" key={index}>
                <Image
                  src={image!}
                  alt="event image"
                  className="rounded-[10px] w-full h-[140px]"
                  width={300}
                  height={300}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[14px] mt-5">No Venue Image!</div>
        )}
      </div>
      <Separator className="mt-5" />
      {src !== "" && (
        <div className=" mt-10 flex flex-col items-center justify-center">
          <Image
            src={src}
            alt="qr code"
            width={500}
            height={500}
            className="w-[150px] h-[150px]"
          />
          <p className="mt-3 text-[13px]">
            Please show this code at the event and scan it to proceed
          </p>
        </div>
      )}
      {!isReserved ? (
        <Button
          className="rounded-full bg-[#1da1f2] lg:w-[400px] w-full mt-10 hover:bg-[#1da1f2]"
          onClick={handleReserve}
          disabled={isPending}
        >
          {!isPending ? "Reserve" : "Reserving..."}
        </Button>
      ) : (
        <Button
          className="rounded-full bg-[#1da1f2] lg:w-[400px] w-full mt-10 hover:bg-[#1da1f2]"
          onClick={generateQrcode}
        >
          You've reserved! Generate QR code
        </Button>
      )}
    </div>
  );
};

export default EventPage;

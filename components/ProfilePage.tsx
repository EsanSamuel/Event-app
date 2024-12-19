"use client";
import { Event, Organizer, User } from "@prisma/client";
import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Separator } from "./ui/separator";
import Card from "./Card";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { CiEdit } from "react-icons/ci";
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
import { updateUser } from "@/lib/actions/user.actions";
import toast from "react-hot-toast";

interface Props {
  currentUser: User;
  userEvents: Event[];
  events: Event[];
  rsvd: {
    id: string;
    event?: Event;
    user?: User;
    reservedAt: Date;
    userId: string;
    eventId: string;
  }[];
  userRsvd: {
    id: string;
    event?: Event;
    user?: User;
    reservedAt: Date;
    userId: string;
    eventId: string;
  }[];
  bookmarked: {
    id: string;
    eventId: string;
    userId: string;
    pinnedAt: Date;
    event?: Event;
  }[];
  allOrganizedEvents: {
    id: string;
    event?: Event;
  }[];
}

interface IReserveProps {
  id: string;
  event?: Event;
  user?: User;
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
  bookmarked,
  allOrganizedEvents,
}: Props) => {
  const router = useRouter();
  if (!currentUser) {
    return router.push("/");
  }
  const [username, setUsername] = useState<string>(currentUser.username);
  const [image, setImage] = useState<string>(currentUser.image!);
  const [userReserved, setUserReserved] = React.useState<IReserveProps[]>([]);
  const path = usePathname();
  const [isPending, startTransition] = useTransition();

  React.useEffect(() => {
    const filterReserved = async () => {
      if (!currentUser?.id) return;
      const userRsvd = rsvd.filter(
        (item) => item?.user?.id === currentUser?.id
      );
      console.log(userRsvd);
      setUserReserved(userRsvd);
    };
    filterReserved();
  }, [currentUser?.id, rsvd]);

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

  const editUser = async () => {
    try {
      startTransition(async () => {
        await updateUser({ username, image, path });
      });
      toast.success("Profile edited!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4">
        <Image
          src={currentUser?.image! || ""}
          alt="profile picture"
          width={1000}
          height={1000}
          className="w-[200px] h-[200px] rounded-[20px] border-[1px]"
        />
        <div className="flex justify-between items-center">
          <div className="mt-4 flex flex-col gap-1 pb-5">
            <div className="flex gap-4">
              <h1 className="text-[15px] font-bold flex b">
                {currentUser.username}{" "}
              </h1>
              <AlertDialog>
                <AlertDialogTrigger>
                  <CiEdit size={22} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Edit Profile</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className=" mt-3 flex flex-col gap-2">
                        {image && (
                          <div className="flex items-center justify-center rounded-full">
                            <Image
                              src={image}
                              width={200}
                              height={200}
                              className="rounded-full w-20 h-20"
                              alt="profile image"
                            />
                          </div>
                        )}
                        <label className="flex flex-col gap-2">
                          <h1 className="text-[12px] text-start">Edit name</h1>
                          <input
                            className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                            placeholder="Enter Name"
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                          />
                        </label>

                        <label className="flex flex-col gap-2">
                          <h1 className="text-[12px] text-start">Edit Image</h1>
                          <input
                            className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                            type="file"
                            onChange={handleImageChange}
                          />
                        </label>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={editUser}>
                      {isPending ? "Updating..." : "Edit Profile"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <p className="text-[13px]">{currentUser.email}</p>
          </div>
          <div>
            <Button
              className="rounded-full hover:bg-[#1da1f2] hover:opacity-50 bg-[#1da1f2]"
              onClick={() => router.push("/create-event")}
            >
              List Event
            </Button>
          </div>
        </div>
      </div>
      <Separator />
      <div className="mt-5">
        <h1 className="text-[20px] font-bold">Your Events</h1>
        <p className="text-[13px] text-gray-500">
          Here are the events you listed ({userEvents?.length})
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
            Events you reserved a seat for ({userReserved?.length})
          </p>
          <div className="lg:py-10 py-3 grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 w-full pb-5">
            {userReserved?.map((event) => (
              <Card key={event.id} event={event.event!} />
            ))}
          </div>
        </div>
        <Separator />
        <div className="mt-5">
          <h1 className="text-[20px] font-bold">Organized Events</h1>
          <p className="text-[13px] text-gray-500">
            Events You’re a Part of as an Organizer (
            {allOrganizedEvents?.length})
          </p>
          <div className="lg:py-10 py-3 grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 w-full pb-5">
            {allOrganizedEvents?.map((event) => (
              <Card key={event.id} event={event?.event!} />
            ))}
          </div>
        </div>
        <Separator />
        <div className="mt-5">
          <h1 className="text-[20px] font-bold">Bookmarked Events</h1>
          <p className="text-[13px] text-gray-500">
            Events you bookmarked ({bookmarked?.length})
          </p>
          <div className="lg:py-10 py-3 grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 w-full pb-5">
            {bookmarked?.map((event) => (
              <Card key={event.id} event={event?.event!} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

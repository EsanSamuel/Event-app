"use client";
import {
  addGuest,
  addOrganizers,
  bookmarkEvent,
  deleteEvent,
  removeRole,
  reserveEvent,
} from "@/lib/actions/event.actions";
import { $Enums, Event, Guest, Pinn, Reserve, User } from "@prisma/client";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useTransition } from "react";
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
import { CiBookmark } from "react-icons/ci";
import { FaBookmark } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";
import toast from "react-hot-toast";

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
    user?: User;
    userId: string;
  };
  currentUser: User;
  guests: Guest[];
  rsvd: Reserve[];
  bookmarked: {
    id: string;
    eventId: string;
    userId: string;
    user?: User;
    event?: Event;
    pinnedAt: Date;
  }[];
  users: User[];
  isAuthorized: boolean;
  organizers: {
    id: string;
    eventId: string;
    userId: string;
    role: $Enums.OrganizerRole;
    user?: User;
  }[];
  isAdmin: boolean;
}

const EventPage = ({
  event,
  currentUser,
  guests,
  rsvd,
  bookmarked,
  users,
  isAuthorized,
  organizers,
  isAdmin,
}: IEventProps) => {
  const [image, setImage] = React.useState("");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [src, setSrc] = React.useState<string>("");
  const [role, setRole] = React.useState<$Enums.OrganizerRole>("MODERATOR");
  const [userId, setUserId] = React.useState("");
  const [roleModal, setRoleModal] = React.useState(false);
  const isAuthor = event?.user?.id === currentUser.id;
  const path = usePathname();
  const router = useRouter();
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
      toast.success("Guest added successfully!");
    } catch (error: any) {
      toast.error("Something went wrong!");
      console.log("Adding guest failed", error);
    }
  };

  const handleReserve = async () => {
    try {
      startTransition(async () => {
        const eventId = event.id;
        await reserveEvent(eventId, path);
      });
      toast.success("Event Reservation successfully");
    } catch (error) {
      toast.error("Event Reservation Failed");
      console.log(error);
    }
  };

  const isReserved = React.useMemo(() => {
    const rsvdUserId = rsvd.map(
      (reserve: Reserve & { user?: User }) => reserve?.user?.id
    );
    return rsvdUserId.includes(currentUser.id);
  }, [currentUser.id, rsvd]);

  const generateQrcode = () => {
    QRCode.toDataURL(`http://localhost:3000/rsvd/${event?.id}`).then(setSrc);
  };

  const handleBookmark = async () => {
    try {
      startTransition(async () => {
        const eventId = event.id;
        const userId = currentUser.id;
        await bookmarkEvent(eventId, userId);
      });
      toast.success("Event bookmarked!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };

  const isBookmarked = React.useMemo(() => {
    const bookmark = bookmarked.map(
      (bookmark: Pinn & { user?: User }) => bookmark?.user?.id
    );
    return bookmark.includes(currentUser.id);
  }, [currentUser.id, bookmarked]);

  const handleAddOrganizers = async () => {
    try {
      const eventId = event.id;
      console.log(userId, eventId, role);
      await addOrganizers(userId, eventId, role, path);
      toast.success("Organizer added!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleEditPage = () => {
    return router.push(`/edit-event/${event.id}`);
  };

  const handleRsvdPage = () => {
    return router.push(`/rsvd/${event.id}`);
  };

  const handleDeleteRole = async (organizerId: string) => {
    try {
      await removeRole(organizerId, path);
      toast.success("Organizer removed!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(event.id, path);
      router.push("/");
      toast.success("Event deleted");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <>
      <div className="lg:px-[15%] px-3 lg:py-10 py-3 flex flex-col items-center">
        <h1 className="text-center font-bold text-[22px] pb-5">
          Event Details
        </h1>
        <Image
          src={event?.thumbnail!}
          alt="event image"
          className="rounded-[10px] w-full lg:w-[700px] lg:h-[400px] h-[250px]"
          width={5000}
          height={5000}
        />

        <h1 className="text-[30px] font-bold text-center pt-5">
          {event?.title}
        </h1>
        <div className="flex justify-end mt-2">
          {!isBookmarked ? (
            <CiBookmark size={22} onClick={handleBookmark} />
          ) : (
            <FaBookmark size={22} className="text-[#1da1f2]" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-8 mt-10">
          <div className="flex gap-5 items-center">
            <CiLocationOn /> {event?.location}
          </div>
          <div className="flex gap-5 items-center">
            <CiCalendarDate /> {event?.dateTime}
          </div>
          <div className="flex gap-5 items-center">
            <MdOutlineCategory /> {event?.category}
          </div>
          <div className="flex gap-5 items-center">
            <MdOutlineReduceCapacity /> {event?.capacity}
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
          {(isAuthor || isAuthorized) && (
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
                  <AlertDialogAction
                    onClick={handleAddGuest}
                    className="bg-[#121212]"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <Separator className="mt-5" />
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
        <div className="mt-10 text-center">
          <h1 className="font-bold text-[20px]">Event Organizers</h1>
          <p className="text-gray-600 text-[13px]">
            Here are the organizers for this event
          </p>
          {organizers.length > 0 ? (
            <div className="grid lg:grid-cols-4 grid-cols-2 gap-5 mt-5">
              {organizers?.map((organizer) => (
                <div
                  className=" flex flex-col gap-3 max-w-[300px]"
                  key={organizer.id}
                >
                  {(isAuthor || isAdmin) && (
                    <div
                      className="mt-[2px] ml-2 absolute cursor-pointer"
                      onClick={() => setRoleModal(!roleModal)}
                    >
                      <BsThreeDots className="text-white" size={22} />
                    </div>
                  )}
                  <Image
                    src={organizer?.user?.image! || "/placeholder.png"}
                    alt="event image"
                    className="rounded-[10px] w-full h-[140px]"
                    width={300}
                    height={300}
                  />
                  <div className="text-center">
                    <h1 className="text-[16px] text-center font-bold">
                      {organizer?.user?.username}
                    </h1>
                    <p className=" text-center text-[12px]">
                      {organizer?.role}
                    </p>
                  </div>
                  {roleModal && (
                    <Button
                      onClick={() => handleDeleteRole(organizer.id)}
                      className="border-red-400 hover:bg-white hover:opacity-50 bg-white border text-red-400 w-full rounded-full"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-[14px] mt-5">
              No Organizers added!
            </div>
          )}
        </div>
        {(isAuthor || isAuthorized) && (
          <AlertDialog>
            <AlertDialogTrigger className="mt-5 bg-[#121212] rounded-full py-2 text-white px-4 text-[11px]">
              Settings
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Event Settings</AlertDialogTitle>
                <AlertDialogDescription>
                  As an event admin, contributor or moderator, you have access
                  to this event settings
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col gap-2">
                <h1>Event Organizers</h1>
                {isAuthor || isAdmin ? (
                  <div className="flex flex-col gap-2">
                    <label className="flex flex-col gap-2">
                      <select
                        className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                        onChange={(e) => setUserId(e.target.value)}
                      >
                        <option value="">Add user</option>
                        {users.map((user) => (
                          <option
                            key={user.id}
                            value={user.id}
                            onClick={() => setUserId(user.id)}
                          >
                            {user.email}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-2">
                      <select
                        className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                        onChange={(e) =>
                          setRole(e.target.value as $Enums.OrganizerRole)
                        }
                      >
                        <option>Add Role</option>
                        <option>ADMIN</option>
                        <option>CONTRIBUTOR</option>
                        <option>MODERATOR</option>
                      </select>
                    </label>
                  </div>
                ) : (
                  <p className="mt-2 text-gray-500 text-[12px] text-center">
                    Only Event Admin can add organizers!
                  </p>
                )}
              </div>

              {(isAuthor || isAdmin) && (
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAddOrganizers}
                    className="bg-[#121212]"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              )}
              <Separator className="my-2" />
              <div className="flex w-full justify-between gap-3">
                <Button
                  className="bg-[#1da1f2] w-full rounded-full"
                  onClick={handleEditPage}
                >
                  Edit Event
                </Button>
                <Button
                  className="bg-[#1da1f2] w-full rounded-full"
                  onClick={handleRsvdPage}
                >
                  View Rsvd
                </Button>
              </div>
              <Separator className="my-2" />
              <div className="">
                {isAuthor || isAdmin ? (
                  <AlertDialog>
                    <AlertDialogTrigger className="border-red-400 hover:bg-white bg-white border py-2 text-[15px] text-red-400 w-full rounded-full">
                      Delete Event
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your event and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-red-400 text-white"
                          onClick={handleDeleteEvent}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : (
                  <p className="text-[12px] text-center">Only Author or Admin can delete Event!</p>
                )}
              </div>
            </AlertDialogContent>
          </AlertDialog>
        )}
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
            You&#8209;ve reserved! Generate QR code
          </Button>
        )}
        {(isAuthorized || isAuthor) && (
          <h1 className="text-gray-500 text-[12px] mt-5">
            You can make changes to this Event
          </h1>
        )}
      </div>
    </>
  );
};

export default EventPage;

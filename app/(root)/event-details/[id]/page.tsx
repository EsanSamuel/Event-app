import EventPage from "@/components/EventPage";
import {
  authorizeRole,
  getAllReserved,
  getBookmarkedEvents,
  getEvent,
  getGuests,
  getOrganizers,
} from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import { getUsers } from "@/lib/actions/user.actions";
import React from "react";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const id = (await params).id;
  const currentUser = await getCurrentUser();
  const event = await getEvent(id);
  const guests = await getGuests(id);
  const rsvd = await getAllReserved(id);
  const bookmarked = await getBookmarkedEvents(id);
  const users = await getUsers();
  const organizers = await getOrganizers(id);
  const isAuthorized = await authorizeRole(currentUser?.id!, event?.id!, [
    "ADMIN",
    "MODERATOR",
    "CONTRIBUTOR",
  ]);
  const isAdmin = await authorizeRole(currentUser?.id!, event?.id!, ["ADMIN"]);
  return (
    <EventPage
      event={event!}
      currentUser={currentUser!}
      guests={guests!}
      rsvd={rsvd!}
      bookmarked={bookmarked!}
      users={users!}
      organizers={organizers!}
      isAuthorized={isAuthorized}
      isAdmin={isAdmin!}
    />
  );
};

export default page;

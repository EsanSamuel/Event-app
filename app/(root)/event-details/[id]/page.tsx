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
import { GetServerSidePropsContext } from "next";

interface IParams {
  params: {
    id: string;
  };
}

const page = async ({ params }: GetServerSidePropsContext) => {
  const id = params?.id as string;

  if (!id) {
    throw new Error("Event ID is required.");
  }

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

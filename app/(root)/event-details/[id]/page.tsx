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
  params: {
    id: string;
  };
}

const page = async ({ params }: IParams) => {
  const currentUser = await getCurrentUser();
  const event = await getEvent(params?.id);
  const guests = await getGuests(params?.id);
  const rsvd = await getAllReserved(params?.id);
  const bookmarked = await getBookmarkedEvents(params.id);
  const users = await getUsers();
  const organizers = await getOrganizers(params?.id);
  const isAuthorized = await authorizeRole(currentUser?.id!, event?.id!, [
    "ADMIN",
    "MODERATOR",
    "CONTRIBUTOR",
  ]);
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
    />
  );
};

export default page;

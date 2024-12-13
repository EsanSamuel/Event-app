import EventPage from "@/components/EventPage";
import {
  getAllReserved,
  getBookmarkedEvents,
  getEvent,
  getGuests,
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
  return (
    <EventPage
      event={event!}
      currentUser={currentUser!}
      guests={guests!}
      rsvd={rsvd!}
      bookmarked={bookmarked!}
      users={users!}
    />
  );
};

export default page;

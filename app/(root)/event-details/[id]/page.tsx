import EventPage from "@/components/EventPage";
import {
  getAllReserved,
  getEvent,
  getGuests,
} from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
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
  return (
    <EventPage
      event={event!}
      currentUser={currentUser!}
      guests={guests!}
      rsvd={rsvd!}
    />
  );
};

export default page;

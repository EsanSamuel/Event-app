import RsvdPage from "@/components/RsvdPage";
import {
  authorizeRole,
  getAllReserved,
  getEvent,
} from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import React from "react";
import { GetServerSidePropsContext } from "next";

const page = async ({ params }: GetServerSidePropsContext) => {
  const id = params?.id as string;

  if (!id) {
    throw new Error("Event ID is required.");
  }
  const currentUser = await getCurrentUser();
  const event = await getEvent(id);
  const rsvd = await getAllReserved(id);
  const isAuthorized = await authorizeRole(currentUser?.id!, event?.id!, [
    "ADMIN",
    "MODERATOR",
    "CONTRIBUTOR",
  ]);
  return (
    <RsvdPage
      currentUser={currentUser!}
      event={event!}
      rsvd={rsvd!}
      isAuthorized={isAuthorized!}
    />
  );
};

export default page;

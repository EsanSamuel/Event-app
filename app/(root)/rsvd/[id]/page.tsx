import RsvdPage from "@/components/RsvdPage";
import {
  authorizeRole,
  getAllReserved,
  getEvent,
} from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import React from "react";
import { GetServerSidePropsContext } from "next";

interface PageProps {
  params: {
    id: string; 
  };
}

const page = async ({ params }: PageProps) => {
  const currentUser = await getCurrentUser();
  const event = await getEvent(params?.id);
  const rsvd = await getAllReserved(params?.id);
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

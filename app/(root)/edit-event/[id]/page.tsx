import EditPage from "@/components/EditPage";
import { authorizeRole, getEvent } from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import React from "react";
import { GetServerSidePropsContext } from "next";

interface IParams {
  params: Promise<{ id: string }>;
}

const page = async ({ params }: IParams) => {
  const id = (await params).id;
  const currentUser = await getCurrentUser();
  const event = await getEvent(id);
  const isAuthorized = await authorizeRole(currentUser?.id!, event?.id!, [
    "ADMIN",
    "MODERATOR",
    "CONTRIBUTOR",
  ]);

  return (
    <EditPage
      event={event!}
      currentUser={currentUser!}
      isAuthorized={isAuthorized!}
    />
  );
};

export default page;

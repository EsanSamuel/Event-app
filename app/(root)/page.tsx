import MainPage from "@/components/MainPage";
import { getEvents } from "@/lib/actions/event.actions";
import React from "react";

export const dynamic = "force-dynamic";

const page = async () => {
  const events = await getEvents();
  return <MainPage events={events!} />;
};

export default page;

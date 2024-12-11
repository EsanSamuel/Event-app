import MainPage from "@/components/MainPage";
import { getEvents } from "@/lib/actions/event.actions";
import React from "react";

//text-[#1da1f2]

const page = async () => {
  const events = await getEvents();
  return <MainPage events={events!} />;
};

export default page;

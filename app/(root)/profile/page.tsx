import Navbar from "@/components/Navbar";
import ProfilePage from "@/components/ProfilePage";
import {
  getAllReserved,
  getEvents,
  getEventYouReservedFor,
  getReserved,
  getUserEvent,
} from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import React from "react";

const Profile = async () => {
  const currentUser = await getCurrentUser();
  const userEvents = await getUserEvent(currentUser?.id!);
  const events = await getEvents();
  const rsvd = await getReserved();
  const userRsvd = await getEventYouReservedFor(currentUser?.id!);
  return (
    <div>
      <Navbar />
      <div className="lg:px-[15%] lg:py-10 p-3">
        <ProfilePage
          currentUser={currentUser!}
          userEvents={userEvents!}
          events={events!}
          rsvd={rsvd!}
          userRsvd={userRsvd!}
        />
      </div>
    </div>
  );
};

export default Profile;

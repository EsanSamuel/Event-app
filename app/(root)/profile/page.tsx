import Navbar from "@/components/Navbar";
import ProfilePage from "@/components/ProfilePage";
import {
  getBookmarks,
  getEvents,
  getEventYouReservedFor,
  getOrganizersByUser,
  getReserved,
  getUserEvent,
} from "@/lib/actions/event.actions";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import React from "react";

export const dynamic = "force-dynamic";

const Profile = async () => {
  const currentUser = await getCurrentUser();
  const userEvents = await getUserEvent(currentUser?.id!);
  const events = await getEvents();
  const rsvd = await getReserved();
  const userRsvd = await getEventYouReservedFor(currentUser?.id!);
  const bookmarked = await getBookmarks(currentUser?.id!);
  const allOrganizedEvents = await getOrganizersByUser(currentUser?.id!);
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
          bookmarked={bookmarked!}
          allOrganizedEvents={allOrganizedEvents!}
        />
      </div>
    </div>
  );
};

export default Profile;

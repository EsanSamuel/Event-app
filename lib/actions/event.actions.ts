"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prismadb";
import { EventType, gusetType, UpdateEventType } from "../zod";
import { getCurrentUser } from "./getCurrentUser.action";
import { v2 as cloudinary } from "cloudinary";
import {
  $Enums,
  Event,
  Guest,
  Organizer,
  Pinn,
  Reserve,
  User,
} from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const handleError = (error: unknown, context: string): void => {
  console.log(`Error in ${context}:`, error);
};

export const createEvent = async ({
  title,
  thumbnail,
  details,
  location,
  dateTime,
  venueImages,
  capacity,
  category,
}: EventType): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated!");
    const ThumbnailUrl = await cloudinary.uploader.upload(thumbnail!);
    const ImageUrls: string[] = [];
    if (Array.isArray(venueImages!)) {
      for (const image of venueImages!) {
        const imageurl = await cloudinary.uploader.upload(image);
        ImageUrls.push(imageurl.url);
      }
    } else {
      throw new Error("Invalid venueImages: expected an array.");
    }

    const event = await prisma.event.create({
      data: {
        user: {
          connect: {
            id: currentUser?.id,
          },
        },
        title,
        thumbnail: ThumbnailUrl.url,
        details,
        location,
        dateTime,
        venueImages: ImageUrls,
        capacity,
        category,
      },
    });
    console.log(event);
  } catch (error) {
    handleError(error, "createEvents");
  }
};

export const updateEvent = async ({
  title,
  thumbnail,
  details,
  location,
  dateTime,
  venueImages,
  capacity,
  category,
  eventId,
}: UpdateEventType): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated!");
    const ThumbnailUrl = await cloudinary.uploader.upload(thumbnail!);
    const ImageUrls: string[] = [];
    if (Array.isArray(venueImages!)) {
      for (const image of venueImages!) {
        const imageurl = await cloudinary.uploader.upload(image);
        ImageUrls.push(imageurl.url);
      }
    } else {
      throw new Error("Invalid venueImages: expected an array.");
    }

    const event = await prisma.event.update({
      where: {
        id: eventId,
      },
      data: {
        title,
        thumbnail: ThumbnailUrl.url,
        details,
        location,
        dateTime,
        venueImages: ImageUrls,
        capacity,
        category,
      },
    });
    console.log(event);
  } catch (error) {
    handleError(error, "updateEvent");
  }
};

export const getEvents = async (): Promise<Event[]> => {
  try {
    const events = await prisma.event.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    console.log(events);
    return events;
  } catch (error) {
    handleError(error, "getEvents");
    return [];
  }
};

export const getEvent = async (eventId: string): Promise<Event | null> => {
  try {
    const events = await prisma.event.findUnique({
      where: {
        id: eventId,
      },
      include: {
        user: true,
      },
    });
    console.log(events);
    return events;
  } catch (error) {
    handleError(error, "getEvent");
    return null;
  }
};

export const deleteEvent = async (
  eventId: string,
  path: string
): Promise<void> => {
  try {
    await prisma.event.delete({
      where: {
        id: eventId,
      },
    });
    revalidatePath(path);
    console.log("Event deleted!");
  } catch (error) {
    handleError(error, "deleteEvent");
  }
};

export const addGuest = async ({
  name,
  description,
  image,
  eventId,
  path,
}: gusetType): Promise<void> => {
  try {
    const ImageUrl = await cloudinary.uploader.upload(image!);

    const guests = await prisma.guest.create({
      data: {
        name,
        description,
        image: ImageUrl.url,
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });
    console.log(guests);
    revalidatePath(path);
  } catch (error) {
    handleError(error, "addGuest");
  }
};

export const getGuests = async (eventId: string): Promise<Guest[]> => {
  try {
    const guests = await prisma.guest.findMany({
      where: {
        eventId,
      },
      include: {
        event: true,
      },
      orderBy: {
        AddedAt: "desc",
      },
    });
    console.log(guests);
    return guests;
  } catch (error) {
    handleError(error, "getGuests");
    return [];
  }
};

export const deleteGuest = async (guestId: string): Promise<void> => {
  try {
    await prisma.guest.delete({
      where: {
        id: guestId,
      },
    });
    console.log("Guest deleted!");
  } catch (error) {
    handleError(error, "deleteGuest");
  }
};

export const reserveEvent = async (
  eventId: string,
  path: string
): Promise<void> => {
  try {
    const currentUser = await getCurrentUser();

    const rsvd = await prisma.reserve.create({
      data: {
        user: {
          connect: {
            id: currentUser?.id,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });
    console.log(rsvd);
    revalidatePath(path);
  } catch (error) {
    handleError(error, "reserveEvent");
  }
};

export const getReserved = async (): Promise<Reserve[]> => {
  try {
    const rsvd = await prisma.reserve.findMany({
      orderBy: {
        reservedAt: "desc",
      },
      include: {
        user: true,
        event: true,
      },
    });
    return rsvd;
  } catch (error) {
    handleError(error, "getReserved");
    return [];
  }
};

export const getAllReserved = async (eventId: string): Promise<Reserve[]> => {
  try {
    const rsvd = await prisma.reserve.findMany({
      where: {
        eventId,
      },
      orderBy: {
        reservedAt: "desc",
      },
      include: {
        user: true,
        event: true,
      },
    });
    return rsvd;
  } catch (error) {
    handleError(error, "getAllReserved");
    return [];
  }
};

export const getEventYouReservedFor = async (
  userId: string
): Promise<Reserve[]> => {
  try {
    const rsvd = await prisma.reserve.findMany({
      where: {
        userId,
      },
      orderBy: {
        reservedAt: "desc",
      },
      include: {
        user: true,
        event: true,
      },
    });
    return rsvd;
  } catch (error) {
    handleError(error, "getEventYouReservedFor");
    return [];
  }
};

export const getUserEvent = async (userId: string): Promise<Event[]> => {
  try {
    const events = await prisma.event.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
      },
    });
    console.log(events);
    return events;
  } catch (error) {
    handleError(error, "getUserEvent");
    return [];
  }
};

export const bookmarkEvent = async (
  eventId: string,
  userId: string
): Promise<void> => {
  try {
    const bookmark = await prisma.pinn.create({
      data: {
        event: {
          connect: {
            id: eventId,
          },
        },
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
    console.log(bookmark);
  } catch (error) {
    handleError(error, "bookmarkEvent");
  }
};

export const getBookmarks = async (userId: string): Promise<Pinn[]> => {
  try {
    const bookmarks = await prisma.pinn.findMany({
      where: {
        userId,
      },
      include: {
        user: true,
        event: true,
      },
    });
    return bookmarks;
  } catch (error) {
    handleError(error, "getBookmarks");
    return [];
  }
};

export const deleteBookmark = async (bookmarkId: string) => {
  try {
    await prisma.pinn.delete({
      where: {
        id: bookmarkId,
      },
    });
    console.log("Bookmark deleted!");
  } catch (error) {
    handleError(error, "deleteBookmark");
  }
};

export const getBookmarkedEvents = async (eventId: string): Promise<Pinn[]> => {
  try {
    const bookmarks = await prisma.pinn.findMany({
      where: {
        eventId,
      },
      include: {
        user: true,
        event: true,
      },
    });
    return bookmarks;
  } catch (error) {
    handleError(error, "getBookmarkedEvents");
    return [];
  }
};

export const addOrganizers = async (
  userId: string,
  eventId: string,
  role: "ADMIN" | "MODERATOR" | "CONTRIBUTOR",
  path: string
): Promise<void> => {
  try {
    const organizer = await prisma.organizer.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
        role,
      },
    });
    console.log(organizer);
    revalidatePath(path);
  } catch (error) {
    handleError(error, "addOrganizers");
  }
};

export const getOrganizers = async (eventId: string): Promise<Organizer[]> => {
  try {
    const getAllOrganizers = await prisma.organizer.findMany({
      where: {
        eventId,
      },
      include: {
        user: true,
      },
    });
    return getAllOrganizers;
  } catch (error) {
    handleError(error, "getOrganizers");
    return [];
  }
};

export const authorizeRole = async (
  userId: string,
  eventId: string,
  requiredRoles: $Enums.OrganizerRole[]
): Promise<boolean> => {
  try {
    const organizer = await prisma.organizer.findFirst({
      where: {
        userId,
        eventId,
        role: { in: requiredRoles },
      },
    });
    return !!organizer; // Return true if the user has one of the required roles
  } catch (error) {
    handleError(error, "authorizeRole");
    return false;
  }
};

export const updateRole = async (
  organizerId: string,
  newRole: $Enums.OrganizerRole
): Promise<void> => {
  try {
    const update_Role = await prisma.organizer.update({
      where: {
        id: organizerId,
      },
      data: {
        role: newRole,
      },
    });
    console.log(update_Role);
  } catch (error) {
    handleError(error, "authorizeRole");
  }
};

export const removeRole = async (
  organizerId: string,
  path: string
): Promise<void> => {
  try {
    await prisma.organizer.delete({
      where: {
        id: organizerId,
      },
    });
    revalidatePath(path);
    console.log("Organizer removed!");
  } catch (error) {
    handleError(error, "removeRole");
  }
};

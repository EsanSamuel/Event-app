"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prismadb";
import { EventType, gusetType } from "../zod";
import { getCurrentUser } from "./getCurrentUser.action";
import { v2 as cloudinary } from "cloudinary";
import { $Enums, Event, Guest, Reserve, User } from "@prisma/client";

interface EventProps {
  title: string;
  thumbnail: string | null;
  details: string;
  location: string;
  dateTime: string;
  venueImages: string[];
  capacity: number;
  category: $Enums.EventCategory;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
}

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
    let ImageUrls = [];
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

"use server";
import { revalidatePath } from "next/cache";
import prisma from "../prismadb";
import { EventType, gusetType } from "../zod";
import { getCurrentUser } from "./getCurrentUser.action";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const createEvent = async ({
  title,
  thumbnail,
  details,
  location,
  dateTime,
  venueImages,
  capacity,
  category,
}: EventType) => {
  try {
    const currentUser = await getCurrentUser();
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
    console.log(error);
  }
};

export const getEvents = async () => {
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
    console.log(error);
  }
};

export const getEvent = async (eventId: string) => {
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
    console.log(error);
  }
};

export const addGuest = async ({
  name,
  description,
  image,
  eventId,
  path,
}: gusetType) => {
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
    console.log(error);
  }
};

export const getGuests = async (eventId: string) => {
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
    console.log(error);
  }
};

export const reserveEvent = async (eventId: string, path: string) => {
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
    console.log(Error);
  }
};

export const getReserved = async () => {
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
    console.log(error);
  }
};

export const getAllReserved = async (eventId: string) => {
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
    console.log(error);
  }
};

export const getEventYouReservedFor = async (userId: string) => {
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
    console.log(error);
  }
};

export const getUserEvent = async (userId: string) => {
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
    console.log(error);
  }
};

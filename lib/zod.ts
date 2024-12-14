import { z } from "zod";

export const validateUser = z.object({
  username: z.string().min(1).max(30),
  email: z.string().email(),
  password: z.string().min(1),
});

export type UserType = z.infer<typeof validateUser>;

export const validateUpdateUser = z.object({
  username: z.string().min(1).max(30),
  image: z.string().optional(),
});

export type UpdateUserType = z.infer<typeof validateUpdateUser>;

export const validateEvent = z.object({
  title: z.string().min(1).max(100),
  thumbnail: z.string().optional(),
  details: z.string(),
  location: z.string(),
  dateTime: z.string(),
  venueImages: z.array(z.string()).nullable().optional(),
  capacity: z.number(),
  category: z.enum([
    "Music",
    "Art",
    "Theater",
    "Film",
    "Workshop",
    "Seminar",
    "Class",
    "Sports",
    "Fitness",
    "Adventure",
    "Tech",
    "Business",
    "Networking",
    "Charity",
    "Community",
    "Festival",
    "Religious",
    "Food",
    "Cooking",
  ]),
});

export type EventType = z.infer<typeof validateEvent>;

export const validateGuest = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(100),
  image: z.string().optional(),
  eventId: z.string().min(1).max(100),
  path: z.string(),
});

export type gusetType = z.infer<typeof validateGuest>;

export const validateUpdateEvent = z.object({
  eventId: z.string().min(1).max(100),
  title: z.string().min(1).max(100),
  thumbnail: z.string().optional(),
  details: z.string(),
  location: z.string(),
  dateTime: z.string(),
  venueImages: z.array(z.string()).nullable().optional(),
  capacity: z.number(),
  category: z.enum([
    "Music",
    "Art",
    "Theater",
    "Film",
    "Workshop",
    "Seminar",
    "Class",
    "Sports",
    "Fitness",
    "Adventure",
    "Tech",
    "Business",
    "Networking",
    "Charity",
    "Community",
    "Festival",
    "Religious",
    "Food",
    "Cooking",
  ]),
});

export type UpdateEventType = z.infer<typeof validateUpdateEvent>;

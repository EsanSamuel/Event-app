"use server";
import prisma from "../prismadb";
import { UpdateUserType, UserType } from "../zod";
import bcrypt from "bcryptjs";
import getSession from "./session.action";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const createUser = async ({ username, email, password }: UserType) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 12);

    const createUser = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });

    console.log(createUser);
    return createUser;
  } catch (error) {
    console.log(error);
  }
};

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return users;
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      console.log("No loggedIn user!");
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async ({ username, image, path }: UpdateUserType) => {
  try {
    const session = await getSession();
    const ImageUrl = await cloudinary.uploader.upload(image!);

    const updateUser = await prisma.user.update({
      where: {
        email: session?.user?.email,
      },
      data: {
        username,
        image: ImageUrl.url,
      },
    });

    revalidatePath(path);
    console.log(updateUser);
    return updateUser;
  } catch (error) {
    console.log(error);
  }
};

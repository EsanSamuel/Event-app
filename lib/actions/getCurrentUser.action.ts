"use server";
import prisma from "../prismadb";
import getSession from "./session.action";

export const getCurrentUser = async () => {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      console.log("No loggedIn user!");
    }
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    console.log(currentUser)
    return currentUser;
  } catch (error) {
    console.log(error);
  }
};

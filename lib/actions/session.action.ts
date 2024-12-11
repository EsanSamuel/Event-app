"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../session";

export default async function getSession() {
  return await getServerSession(authOptions);
}

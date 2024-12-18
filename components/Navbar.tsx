"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { IoMdNotificationsOutline } from "react-icons/io";
import { signIn, signOut, useSession } from "next-auth/react";
import AuthForm from "./AuthForm";
import { getCurrentUser } from "@/lib/actions/getCurrentUser.action";
import { userAgent } from "next/server";
import Image from "next/image";
import { User } from "@prisma/client";
import { IoLogOutOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser!);
    };
    getUser();
  }, []);
  return (
    <>
      <div className="flex justify-between bg-white w-full lg:px-10 py-3 px-3 ">
        <h1 className="font-bold text-[20px] ">Event Planner</h1>
        <div className="flex gap-3 items-center justify-end">
          {!session?.user ? (
            <Button
              className="bg-[#121212] px-7 py-5 rounded-full"
              onClick={() => setOpenLoginModal(true)}
            >
              Log in
            </Button>
          ) : (
            <div className="flex gap-2 items-center">
              <IoMdNotificationsOutline size={22} />
              <IoLogOutOutline
                size={22}
                className="cursor-pointer hover:opacity-50"
                onClick={() => signOut()}
              />
              <Image
                src={user?.image!}
                alt={user?.username!}
                width={200}
                height={200}
                className="w-10 h-10 rounded-full"
                onClick={() => router.push("/profile")}
              />
            </div>
          )}
        </div>
      </div>
      {openLoginModal && (
        <div className="">
          <AuthForm />
        </div>
      )}
    </>
  );
};

export default Navbar;

"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { IoMdNotificationsOutline } from "react-icons/io";
import { signIn } from "next-auth/react";
import AuthForm from "./AuthForm";

const Navbar = () => {
  const [openLoginModal, setOpenLoginModal] = useState(false);
  return (
    <>
      <div className="flex justify-between bg-white w-full lg:px-10 py-3 px-3 ">
        <h1 className="font-bold text-[20px] ">Event Planner</h1>
        <div className="flex gap-3 items-center justify-end">
          <Button
            className="bg-[#121212] px-7 py-5 rounded-full"
            onClick={() => setOpenLoginModal(true)}
          >
            Log in
          </Button>
          <IoMdNotificationsOutline size={20} />
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

"use client";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { createUser } from "@/lib/actions/user.actions";
import { UserType, validateUser } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";

type VARIANT = "sign in" | "sign up";

const AuthForm = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [authVariant, setAuthVariant] = useState<VARIANT>("sign up");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserType>({
    resolver: zodResolver(validateUser),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSignIn = async () => {
    try {
      console.log(username, email, password);
      if (authVariant === "sign up") {
        await createUser({ username, email, password });

        await signIn("credentials", {
          email,
          password,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[22px]">
              Create an Account!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] pb-3 ">
              Create an account to list events and do so much more.
            </AlertDialogDescription>
            <Button
              className="bg-white  rounded-full text-black mt-6 flex items-center border-gray-400  gap-4 hover:bg-white"
              type="submit"
              onClick={() => signIn("google")}
            >
              <FcGoogle /> Continue with Google
            </Button>
            <Separator className="mt-5" />

            <div className="flex flex-col gap-4 mt-7">
              <label className="flex flex-col gap-2">
                {errors.username && "Error entering username"}
                <h1 className="text-[12px] text-start">Username</h1>
                <input
                  className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                  placeholder="Enter Username"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <h1 className="text-[12px] text-start">Email</h1>
                <input
                  className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                  placeholder="Enter Email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <label className="flex flex-col gap-2">
                <h1 className="text-[12px] text-start">Password</h1>
                <input
                  className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                  placeholder="Enter Password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <Separator className="mt-5" />
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button className="bg-[#1da1f2]" type="submit" onClick={onSignIn}>
              Sign Up
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default AuthForm;

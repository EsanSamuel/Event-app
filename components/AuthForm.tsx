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
import toast from "react-hot-toast";

type VARIANT = "sign in" | "sign up";

const AuthForm = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [authVariant, setAuthVariant] = useState<VARIANT>("sign in");
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
        toast.success("Account created successfully!");
      } else if (authVariant === "sign in") {
        await signIn("credentials", {
          email,
          password,
        });
      }
      toast.success("Login successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
      console.log(error);
    }
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <form>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[22px]">
              {authVariant === "sign up" ? "Create an Account!" : "Login"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] pb-3 ">
              {authVariant === "sign up"
                ? "Create an account to list events and do so much more."
                : "Login to list events and do so much more."}
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
              {authVariant === "sign up" && (
                <label className="flex flex-col gap-2">
                  {errors.username && "Error entering username"}
                  <h1 className="text-[12px] text-start">Username</h1>
                  <input
                    className="rounded-full py-3 px-5 bg-gray-100 w-full text-[12px]"
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </label>
              )}
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
          <div className="text-center text-[12px]">
            {authVariant === "sign up" ? (
              <h1>
                Already have an account?{" "}
                <span
                  className="ml-1 cursor-pointer"
                  onClick={() => setAuthVariant("sign in")}
                >
                  Login
                </span>
              </h1>
            ) : (
              <h1>
                Dont have an account?{" "}
                <span
                  className="ml-1 cursor-pointer"
                  onClick={() => setAuthVariant("sign up")}
                >
                  Sign in
                </span>
              </h1>
            )}
          </div>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default AuthForm;

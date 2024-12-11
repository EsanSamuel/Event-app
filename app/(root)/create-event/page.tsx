"use client";
import { Button } from "@/components/ui/button";
import runChat from "@/config/gemini";
import { createEvent } from "@/lib/actions/event.actions";
import { $Enums } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { SiGooglegemini } from "react-icons/si";

interface categoryProps {
  category:
    | "Music"
    | "Art"
    | "Theater"
    | "Film"
    | "Workshop"
    | "Seminar"
    | "Class"
    | "Sports"
    | "Fitness"
    | "Adventure"
    | "Tech"
    | "Business"
    | "Networking"
    | "Charity"
    | "Community"
    | "Festival"
    | "Religious"
    | "Food"
    | "Cooking";
}

const page = () => {
  const router = useRouter();
  const [thumbnail, setThumbnail] = React.useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [details, setDetails] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [dateTime, setDateTime] = useState<string>("");
  const [capacity, setCapacity] = useState<number>(0);
  const [category, setCategory] = useState<$Enums.EventCategory | "">("");
  const [venueImages, setVenueImages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.includes("image")) {
      console.log("Select Image only!");
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;

      setThumbnail(result);
    };
  };

  const handleVenueImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validImages: string[] = [];
    const fileReaders: FileReader[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.includes("image")) {
        console.log(`File "${file.name}" is not an image. Skipping.`);
        return;
      }

      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onload = () => {
        if (reader.result) {
          validImages.push(reader.result as string);

          if (validImages.length === fileReaders.length) {
            setVenueImages((prevImages) => [...prevImages, ...validImages]);
            console.log(venueImages);
          }
        }
      };

      reader.readAsDataURL(file);
    });
  };

  const handleChange =
    (args: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | any>) => {
      switch (args) {
        case "title":
          setTitle(e.target.value);
          break;
        case "details":
          setDetails(e.target.value);
          break;
        case "category":
          setCategory(e.target.value as $Enums.EventCategory);
          break;
        case "capacity":
          setCapacity(e.target.valueAsNumber);
          break;
        case "dateTime":
          setDateTime(e.target.value);
          break;
        case "location":
          setLocation(e.target.value);
          break;
        default:
          break;
      }
    };

  const createAiPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const input = `Write a detailed simple description of an event on ${title}
       happening on ${dateTime}. Location: ${location}.
        Add dateTime and location cleverly because it has been added on the event post already`;
      if (title !== "") {
        const response = await runChat(input);
        let responseArray = response.split("**");
        let promptArray: string = "";
        for (let i = 0; i < responseArray.length; i++) {
          if (i === 0 || i % 2 !== 1) {
            promptArray += responseArray[i];
          } else {
            promptArray += responseArray[i];
          }
        }
        let newResponse = promptArray!;
        setDetails(newResponse as string);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      startTransition(async () => {
        await createEvent({
          title,
          thumbnail,
          details,
          location,
          dateTime,
          venueImages,
          capacity,
          category: category as $Enums.EventCategory,
        });
        router.push("/");
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="lg:px-[20%] lg:py-10 p-3 w-full ">
      <h1 className="text-center text-[25px] font-bold ">List an Event!</h1>
      <form className="w-full flex flex-col gap-7 mt-10">
        <div
          className="border-[1px] border-dashed line-break min-h-[150px] max-h-auto
         rounded-[20px] text-center items-center flex justify-center"
        >
          {!thumbnail ? (
            <div className="">
              <h1>Select Image</h1>
              <input
                type="file"
                onChange={handleImageChange}
                className="h-full w-full opacity-0"
              />
            </div>
          ) : (
            <Image
              src={thumbnail}
              alt="thumbnail"
              width={500}
              height={500}
              className="rounded-[10px]"
            />
          )}
        </div>
        <div className="grid  lg:grid-cols-2 grid-cols-1 gap-6">
          <label className="flex flex-col gap-2">
            <h1 className=" text-[14px] text-gray-500">Enter Event title</h1>
            <input
              className="border-[1px] h-[40px] rounded-full px-5 text-[12px]"
              onChange={handleChange("title")}
            />
          </label>
          <label className="flex flex-col gap-2">
            <h1 className=" text-[14px]  text-gray-500">Enter Event Date</h1>
            <input
              className="border-[1px] h-[40px] rounded-full px-5 text-[12px]"
              type="date"
              onChange={handleChange("dateTime")}
            />
          </label>
          <label className="flex flex-col gap-2">
            <h1 className=" text-[14px]  text-gray-500">Enter Location</h1>
            <input
              className="border-[1px] h-[40px] rounded-full px-5 text-[12px]"
              onChange={handleChange("location")}
            />
          </label>
          <label className="flex flex-col gap-2">
            <h1 className=" text-[14px]  text-gray-500">
              Enter Event capacity
            </h1>
            <input
              className="border-[1px] h-[40px] rounded-full px-5 text-[12px]"
              type="number"
              onChange={handleChange("capacity")}
            />
          </label>
          <label className="flex flex-col gap-2">
            <h1 className=" text-[14px]  text-gray-500">Enter Event title</h1>
            <input className="border-[1px] h-[40px] rounded-full px-5 text-[12px]" />
          </label>
          <label className="flex flex-col gap-2">
            <h1 className=" text-[14px]  text-gray-500">
              Select Event category
            </h1>
            <select
              className="border-[1px] h-[40px] rounded-full px-5 text-[12px]"
              onChange={handleChange("category")}
            >
              <option>Select Category</option>Music
              <option>Art</option>
              <option>Theater</option>
              <option>Film</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Class</option>
              <option>Sports</option>
              <option>Fitness</option>
              <option>Adventure</option>
              <option>Tech</option>
              <option>Business</option>
              <option>Networking</option>
              <option>Charity</option>
              <option>Community</option>
              <option>Festival</option>
              <option>Religious</option>
              <option>Food</option>
              <option>Cooking</option>
            </select>
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <h1 className=" text-[14px]  text-gray-500">
            Add venue Image (optional)
          </h1>
          <input
            className="border-[1px] h-[40px] rounded-full px-5 text-[12px] items-center"
            type="file"
            accept="image/*"
            multiple
            onChange={handleVenueImageChange}
          />
          {venueImages.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
              {venueImages.map((image, index) => (
                <div key={index}>
                  <Image
                    src={image}
                    alt="thumbnail"
                    width={500}
                    height={500}
                    className="rounded-[10px] w-full h-[100px]"
                  />
                </div>
              ))}
            </div>
          )}
        </label>
        <label className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h1 className=" text-[14px]  text-gray-500">Enter Event Details</h1>

            <Button
              className="rounded-full bg-[#121212] w-8 h-8"
              onClick={createAiPrompt}
            >
              <SiGooglegemini className="text-white" size={20} />
            </Button>
          </div>
          <textarea
            className="border-[1px] h-[150px] rounded-[20px] px-5 text-[12px]"
            onChange={handleChange("details")}
            value={details}
          ></textarea>
        </label>
        <Button
          className="w-full bg-[#1da1f2] rounded-full"
          onClick={handleCreateEvent}
          disabled={isPending}
        >
          {!isPending ? "Create Event" : "Listing Event..."}
        </Button>
      </form>
    </div>
  );
};

export default page;

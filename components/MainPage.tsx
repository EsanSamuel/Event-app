"use client";
import { Event } from "@prisma/client";
import React from "react";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/actions/event.actions";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilter } from "react-icons/io5";

interface Props {
  events: Event[];
}

const MainPage = ({ events }: Props) => {
  const [search, setSearch] = React.useState("");

  const filterEvents = () => {
    return events.filter((event) => {
      if (search === "") {
        return event;
      } else {
        if (event.title.toLowerCase().includes(search.toLocaleLowerCase())) {
          return event;
        } else if (
          event.category.toLowerCase().includes(search.toLocaleLowerCase())
        ) {
          return event;
        } else {
          if (
            event.location.toLowerCase().includes(search.toLocaleLowerCase())
          ) {
            return event;
          }
        }
      }
    });
  };
  return (
    <>
      <Navbar />
      <div className="lg:px-10 p-3">
        <div className="bg-[#F0F8FF] rounded-[20px]">
          <div className=" flex flex-col lg:px-[20%] p-10">
            <h1 className="lg:text-[40px] text-[25px]  font-bold text-center">
              Your all in one event tracking application!
            </h1>
            <p className="lg:text-[18px] sm:text-[14px] md:text-[16px] text-gray-600 font-light pt-2 pb-5 text-center">
              Explore and search for event you desire to attend!
            </p>
            <div className="flex gap-2 pt-5">
              <div className="bg-white  w-full h-[50px] rounded-full flex flex-row gap-2 px-5  items-center">
                <button className="text-gray-500  bg-white rounded-full">
                  <AiOutlineSearch />
                </button>
                <input
                  className="w-full h-full outline-none"
                  placeholder="Search for events"
                  type="search"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="bg-white p-3 rounded-[10px]">
                <IoFilter size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:px-[15%] px-3 lg:py-10 py-5">
        <h1 className="font-bold text-[20px]">Upcoming events</h1>
        <div className="lg:py-10 py-3 grid lg:grid-cols-4 gap-3 md:grid-cols-3 grid-cols-2 w-full">
          {filterEvents()?.map((event: Event) => (
            <Card key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MainPage;
"use client";
import { Event } from "@prisma/client";
import React from "react";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { getEvents } from "@/lib/actions/event.actions";
import { AiOutlineSearch } from "react-icons/ai";
import { IoFilter } from "react-icons/io5";
import useLocalStorage from "@/hooks/useLocalStorage";
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

interface Props {
  events: Event[];
}

interface FilterProps {
  id: number;
  category: string;
}
[];

const MainPage = ({ events }: Props) => {
  const [search, setSearch] = React.useState("");
  const [filterByCategories, setFilterByCategories] = useLocalStorage<string>(
    "filterCategories",
    ""
  );

  const filterCategories = (category: string) => {
    return filterByCategories
      ? events.filter((event) => event.category === category)
      : events;
  };

  const filterEvents = () => {
    if (!search.trim()) {
      // Return filtered categories if search is empty
      return filterCategories(filterByCategories);
    }

    // Normalize the search term for case-insensitive matching
    const searchTerm = search.trim().toLowerCase();

    // Helper function to check if any field matches the search term
    const matchesSearch = (event: Event) => {
      return [
        event.title.toLowerCase(),
        event.category.toLowerCase(),
        event.location.toLowerCase(),
      ].some((field) => field.includes(searchTerm));
    };

    // Filter categories and apply the search logic
    return filterCategories(filterByCategories).filter(matchesSearch);
  };

  const handleCategoryFilter = (category: string) => {
    //Array of all the categories string
    const categories = [
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
    ];

    //checking if the category passed as an argument is included in the array
    if (categories.includes(category)) {
      //set filterByCategories into the argument passed
      setFilterByCategories(category);
    }
  };

  const categoryArray: FilterProps[] = [
    { id: 1, category: "Music" },
    { id: 2, category: "Art" },
    { id: 3, category: "Theater" },
    { id: 4, category: "Film" },
    { id: 5, category: "Workshop" },
    { id: 6, category: "Class" },
    { id: 7, category: "Sports" },
    { id: 8, category: "Fitness" },
    { id: 9, category: "Adventure" },
    { id: 10, category: "Tech" },
    { id: 11, category: "Business" },
    { id: 12, category: "Networking" },
    { id: 13, category: "Charity" },
    { id: 14, category: "Community" },
    { id: 15, category: "Festival" },
    { id: 16, category: "Religious" },
    { id: 17, category: "Food" },
    { id: 18, category: "Cooking" },
  ];

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

              <AlertDialog>
                <AlertDialogTrigger className="bg-white p-3 rounded-[10px]">
                  <IoFilter size={24} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Filter Events</AlertDialogTitle>
                    <AlertDialogDescription>
                      Filter Events based on categories or tags
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="grid grid-cols-2 w-full gap-3">
                    {categoryArray?.map((item) => (
                      <Button
                        className="bg-white border-[1px] hover:border-none border-gray-400 text-black hover:text-white hover:bg-[#1da1f2]"
                        key={item.id}
                        onClick={() => handleCategoryFilter(item.category)}
                      >
                        {item.category}
                      </Button>
                    ))}
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#121212]"
                      onClick={() => setFilterByCategories("")}
                    >
                      Clear all Filters
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
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

import { useEffect, useState } from "react";

import axiosInstance from "../utiles/axiosInstance";

export default function CategoriesBar({ onSelectCategory }) {
  // state for the list of categories
  const [categories, setCategories] = useState([]);
  // state for selected category
  const [selected, setSelected] = useState("All");

  // useEffect for gettingtop categories
  useEffect(() => {
    // function for getting categories
    const fetchCategories = async () => {
      try {
        // making request for fetching categories
        const res = await axiosInstance.get("/video/tags/top");
        // setting the array into state of categories
        setCategories(["All", ...res.data.tags]);
      } catch (error) {
        // in case faching of categories fail
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    };
    // calling the fetch function
    fetchCategories();
  }, []);

  // function for handling the selected categories
  const handleClick = (category) => {
    // setting the state to the selected category
    setSelected(category);
    // calling the onSelectCategory function which is passed down through props
    if (onSelectCategory) onSelectCategory(category);
  };

  return (
    // category bar
    <div className="w-full bg-white sticky top-0 z-10">
      {/* contains all the categories */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-4 lg:px-6 py-3 ">
        {/* fetching the categories */}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleClick(cat)}
            className={`px-4 sm:px-5 py-2 rounded-full text-sm sm:text-base font-medium whitespace-nowrap transition-all duration-200
              ${
                selected === cat
                  ? "bg-blue-600 text-white shadow-md "
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}

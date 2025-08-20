import { useEffect, useState } from "react";
import axiosInstance from "../utiles/axiosInstance";

export default function CategoriesBar({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/video/tags/top");
        console.log(res.data.tags);

        setCategories(["All", ...res.data.tags]);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (category) => {
    setSelected(category);
    if (onSelectCategory) onSelectCategory(category);
  };

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide p-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition 
            ${
              selected === cat
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

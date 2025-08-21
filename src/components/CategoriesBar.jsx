// import { useEffect, useState } from "react";
// import axiosInstance from "../utiles/axiosInstance";

// export default function CategoriesBar({ onSelectCategory }) {
//   const [categories, setCategories] = useState([]);
//   const [selected, setSelected] = useState("All");

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await axiosInstance.get("/video/tags/top");
//         setCategories(["All", ...res.data.tags]);
//       } catch (error) {
//         console.error("Failed to fetch categories", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleClick = (category) => {
//     setSelected(category);
//     if (onSelectCategory) onSelectCategory(category);
//   };

//   return (
//     <div className="w-full border-b border-gray-200 bg-white dark:bg-gray-900 sticky top-0 z-10">
//       <div className="flex gap-3 overflow-x-auto scrollbar-hide p-3">
//         {categories.map((cat) => (
//           <button
//             key={cat}
//             onClick={() => handleClick(cat)}
//             className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 
//               ${
//                 selected === cat
//                   ? "bg-black text-white shadow-md dark:bg-blue-500"
//                   : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
//               }`}
//           >
//             {cat}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import axiosInstance from "../utiles/axiosInstance";

export default function CategoriesBar({ onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/video/tags/top");
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
    <div className="w-full bg-white sticky top-0 z-10">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2 sm:px-4 lg:px-6 py-3 ">
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

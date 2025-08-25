import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import CategoriesBar from "../components/CategoriesBar";
import Thumbnail from "../components/Thumbnail";
import Loading from "./Loading";

import axiosInstance from "../utiles/axiosInstance";

// Home Page
export default function HomePage() {
  const [videos, setVideos] = useState([]); // state for videos collection
  const [isLoading, setIsLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // state formanaging error
  // getting search variable from redux store
  const localSearch = useSelector((store) => store.search.value);

  // hook for fetching videos
  useEffect(() => {
    // function used for fetching videos
    const fetchVideos = async () => {
      try {
        // request for serer for fetching vidoes collection
        const res = await axiosInstance.get("/video");
        // setting videos collection in the state
        setVideos(res.data);
      } catch (error) {
        setError("Failed to load the videos");
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  // in case the vidoes are still loading
  if (isLoading) {
    return (
      <>
        <Loading />
      </>
    );
  }
  //  in case we run into error while fetching videos
  if (error) {
    return <div className="text-center text-red-400 p-5">{error}</div>;
  }
  // filtering the videos based on search
  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(localSearch.toLowerCase())
  );
  // function for handling the selected category
  const handleCategorySelect = async (category) => {
    try {
      // request for getting all the video collection
      if (category === "All") {
        const res = await axiosInstance.get("/video");
        // setting video data in the state
        setVideos(res.data);
      } else {
        // getting video collection for selected category
        const res = await axiosInstance.get(`/video/tags/${category}`);

        setVideos(res.data);
      }
    } catch (error) {
      // in case there is error getting videos collection
      setError("Failed to fetch category videos");
    }
  };
  
  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* Category Filter */}
      <div className="sticky z-10 bg-white w-full overflow-x-auto overflow-y-hidden">
        <CategoriesBar onSelectCategory={handleCategorySelect} />
      </div>

      {/* Videos Grid */}
      <div
        className="grid gap-6
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4"
      >
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <Thumbnail key={video._id} video={video} />
          ))
        ) : (
          <p className="col-span-full p-5 text-center text-gray-500">
            No videos found matching "{localSearch}"
          </p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import Thumbnail from "../components/Thumbnail";
import axiosInstance from "../utiles/axiosInstance";
import { useSelector } from "react-redux";
import CategoriesBar from "../components/CategoriesBar";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const localSearch = useSelector((store) => store.search.value);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get("/video");

        console.log(res.data);

        setVideos(res.data);
      } catch (error) {
        setError("Failed to load the videos");
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  if (Loading) {
    return (
      <div className="flex justify-center items-center animate-pulse text-black">
        Loading videos...
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filteredVideos = videos.filter((video) =>
    video.title.toLowerCase().includes(localSearch.toLowerCase())
  );

  const handleCategorySelect = async (category) => {
    try {
      if (category === "All") {
        const res = await axiosInstance.get("/video");
        

        setVideos(res.data);
      } else {
        const res = await axiosInstance.get(`/video/tags/${category}`);
        
        setVideos(res.data);
      }
    } catch (error) {
      setError("Failed to fetch category videos");
    }
  };
  return (
    <>
      <CategoriesBar onSelectCategory={handleCategorySelect} />
      <div className="grid grid-cols-3 gap-7">
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <Thumbnail key={video._id} video={video} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No videos found matching "{localSearch}"
          </p>
        )}
      </div>
    </>
  );
}

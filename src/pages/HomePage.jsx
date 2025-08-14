import { useEffect, useState } from "react";
import Thumbnail from "../components/Thumbnail";
import axiosInstance from "../utiles/axiosInstance";

export default function HomePage() {
  const [videos, setVideos] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <div className="flex justify-center items-center animate-pulse text-black">Loading videos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-7">
        {videos.map((video) => (
          <Thumbnail key={video._id} video={video} />
        ))}
      </div>
    </>
  );
}

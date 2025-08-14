import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Thumbnail({ video }) {
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`flex origin-top mt-8 transform flex-col justify-center items-center hover:drop-shadow-2xl hover:-translate-y-0.5 p-2 transition-all duration-1000 rounded-xl ${
        loaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      onClick={() => navigate(`/video/${video._id}`)}
    >
      <img src={video.thumbnailUrl} className="w-96 rounded-lg" />
      <div className="flex justify-evenly items-start gap-16 mt-4 w-full px-3">
        <div className="flex items-start gap-6 ">
          <img
            src={video.channelId.channelAvatar}
            alt=""
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="font-extrabold text-xl">{video.title}</h2>
            <p className="text-[#717171]">{video.channelId.channelName}</p>
            <p className="text-[#717171]">4.4M views • 4 days ago</p>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-300 rounded-full transition-all duration-300">
          <BsThreeDotsVertical className="text-xl" />
        </button>
      </div>
    </div>
  );
}

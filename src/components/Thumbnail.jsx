import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../assets/default-avatar.jpg";
import { formatDistanceToNow } from "date-fns";
import formatViews from "../utiles/formatViews";
import formatDuration from "../utiles/formatDuration";

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
      className={`flex flex-col p-4 cursor-pointer transition-all duration-700 transform ${
        loaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
      }`}
      onClick={() => navigate(`/video/${video?._id}`)}
    >
      {/* Thumbnail */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <img
          src={video?.thumbnailUrl}
          loading="lazy"
          alt={video?.title}
          className="w-full h-full object-cover aspect-video rounded-xl transition-transform duration-500 hover:scale-105 hover:ring-2 hover:ring-blue-600"
        />
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
          {formatDuration(video.duration)}
        </span>
      </div>

      {/* Video Info */}
      <div className="flex justify-between items-start gap-3 mt-3 px-1">
        <div className="flex items-start gap-3">
          {/* Channel Avatar */}

          <div className="bg-blue-600 aspect-video flex justify-center items-center cursor-pointer w-10 h-10 text-lg rounded-full transition">
            {video?.channelId?.channelAvatar ? (
              <img
                src={video?.channelId?.channelAvatar || defaultAvatar}
                loading="lazy"
                alt={video?.channelId?.channelName}
                className="w-full h-full object-cover rounded-full border border-gray-700"
              />
            ) : (
              <span className="text-white font-bold">
                {video?.channelId?.channelName?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <h2 className="font-semibold truncate text-sm sm:text-base line-clamp-2">
              {video?.title}
            </h2>
            <p className="text-gray-400 truncate text-sm">
              {video?.channelId?.channelName}
            </p>
            {/* <p className="text-gray-500 text-xs">4.4M views • 4 days ago</p> */}
            <p className="text-gray-500 text-sm">
              {formatViews(video?.views?.length || 0)} views •{" "}
              {formatDistanceToNow(new Date(video?.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

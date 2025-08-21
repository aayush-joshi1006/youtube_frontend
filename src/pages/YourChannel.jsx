import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import Loading from "./Loading";
import { formatDistanceToNow } from "date-fns";
import formatDuration from "../utiles/formatDuration.js";
import formatViews from "../utiles/formatViews.js";

export default function YourChannel() {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let fetchChannel = async () => {
      try {
        const res = await axiosInstance.get(`/channel/${id}`);
        setChannel(res.data.channel);
      } catch (error) {
        setError(error.response?.data.message || "Something went wrong");
        console.error(
          "Registration failed ",
          error.response?.data || error.message
        );
      }
    };
    if (id) fetchChannel();
  }, [id]);

  console.log(channel);

  useEffect(() => {
    if (channel) {
      setMessage(
        `Joined ${formatDistanceToNow(new Date(channel?.createdAt), {
          addSuffix: true,
        })}`
      );
    }
  }, [channel]);

  if (error) return <div> Error: {error}</div>;
  if (!channel) return <Loading />;

  return (
    // <>
    //   <div
    //     className="h-64 relative border-b-2 shadow-xl"
    //     style={{ backgroundImage: `url(${channel.channelBanner})` }}
    //   >
    //     <img
    //       src={channel.channelAvatar}
    //       alt="Profile pic"
    //       className="w-32 h-32 rounded-full object-cover object-center absolute -bottom-14 left-16 border shadow-2xl"
    //     />

    //     <div className="absolute -bottom-24 left-48">
    //       <h2 className="text-2xl font-bold">{channel.channelName}</h2>
    //       <p className="text-gray-500 italic">{channel.description}</p>
    //       <p className="font-extralight italic text-sm">{message}</p>
    //     </div>
    //   </div>
    //   <section className="grid grid-cols-3 gap-7 mt-32 px-5 container mx-auto">
    //     {channel.videos.map((video) => (
    //       <div
    //         key={video._id}
    //         onClick={() => navigate(`/video/${video._id}`)}
    //         className={`flex relative origin-top transform flex-col justify-center items-center hover:drop-shadow-2xl hover:-translate-y-0.5 p-2 transition-all duration-1000 rounded-xl ${
    //           loaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
    //         }`}
    //       >
    //         <img src={video.thumbnailUrl} alt="" className="w-96 rounded-lg" />
    //         <span className="bg-black text-white absolute bottom-20 right-14 p-1 rounded-lg">
    //           {formatDuration(video.duration)}
    //         </span>
    //         <div className="flex flex-col justify-center items-start px-14 w-full mt-4">
    //           <h2 className="font-extrabold text-xl">{video.title}</h2>
    //           <p className="text-[#717171]">
    //             {video.views.length} views •{" "}
    //             {`${formatDistanceToNow(new Date(video.createdAt), {
    //               addSuffix: true,
    //             })}`}
    //           </p>
    //         </div>
    //       </div>
    //     ))}
    //   </section>
    // </>
    <>
      <div
        className="relative h-64 border-b-2 shadow-xl"
        style={{
          backgroundImage: `url(${channel.channelBanner})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* Avatar */}
        <img
          src={channel.channelAvatar}
          alt="Profile pic"
          className="w-32 h-32 rounded-full object-cover object-center absolute -bottom-14 left-6 border-4 border-white shadow-xl"
        />

        {/* Channel Info */}
        <div className="absolute -bottom-24 left-44 pr-6 flex flex-col max-w-xl">
          <h2 className="text-2xl font-bold">{channel.channelName}</h2>
          <p className="text-gray-600 italic line-clamp-2">
            {channel.description}
          </p>
          <p className="text-sm text-gray-500 italic">{message}</p>
        </div>
      </div>

      {/* Videos Section */}
      <section
        className="grid gap-6
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4 mt-32 "
      >
        {channel.videos.map((video) => (
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
            <div className="flex flex-col gap-1 mt-3 px-1">
              <h2 className="font-semibold truncate text-sm sm:text-base line-clamp-2">
                {video?.title}
              </h2>
              <p className="text-gray-500 text-sm">
                {formatViews(video?.views?.length || 0)} views •{" "}
                {formatDistanceToNow(new Date(video?.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

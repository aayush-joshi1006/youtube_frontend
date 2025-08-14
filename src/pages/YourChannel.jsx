import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import Loading from "./Loading";
import { formatDistanceToNow } from "date-fns";
import formatDuration from "../utiles/formatDuration.js";

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
    <>
      <div
        className="h-64 relative border-b-2 shadow-xl"
        style={{ backgroundImage: `url(${channel.channelBanner})` }}
      >
        <img
          src={channel.channelAvatar}
          alt="Profile pic"
          className="w-32 h-32 rounded-full object-cover object-center absolute -bottom-14 left-16 border shadow-2xl"
        />

        <div className="absolute -bottom-24 left-48">
          <h2 className="text-2xl font-bold">{channel.channelName}</h2>
          <p className="text-gray-500 italic">{channel.description}</p>
          <p className="font-extralight italic text-sm">{message}</p>
        </div>
      </div>
      <section className="grid grid-cols-3 gap-7 mt-32 px-5 container mx-auto">
        {channel.videos.map((video) => (
          <div
            key={video._id}
            onClick={() => navigate(`/video/${video._id}`)}
            className={`flex relative origin-top transform flex-col justify-center items-center hover:drop-shadow-2xl hover:-translate-y-0.5 p-2 transition-all duration-1000 rounded-xl ${
              loaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
          >
            <img src={video.thumbnailUrl} alt="" className="w-96 rounded-lg" />
            <span className="bg-black text-white absolute bottom-20 right-14 p-1 rounded-lg">
              {formatDuration(video.duration)}
            </span>
            <div className="flex flex-col justify-center items-start px-14 w-full mt-4">
              <h2 className="font-extrabold text-xl">{video.title}</h2>
              <p className="text-[#717171]">
                {video.views.length} views •{" "}
                {`${formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}`}
              </p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

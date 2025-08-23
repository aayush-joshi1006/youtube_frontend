import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import Comments from "../components/Comments";
import defaultAvatar from "../assets/default-avatar.jpg";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";
import { formatDistanceToNow } from "date-fns";
import formatViews from "../utiles/formatViews";
import { useSelector } from "react-redux";
import Loading from "./Loading";
import { toast } from "react-toastify";

export default function Video() {
  const { id } = useParams();

  const [videoDetail, setVideoDetail] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const navigate = useNavigate();
  const currentUser = useSelector((store) => store.user.user);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/video/${id}`);
        setVideoDetail(res.data);
      } catch (error) {
        toast.error(
          "Unable to fetch the Video",
          error.response?.data?.message || error.message
        );
        setErrorMessage(
          error.response?.data?.message || "Unable to fetch video"
        );
      }
    };
    fetchVideo();
  }, [id]);

  useEffect(() => {
    const addView = async () => {
      if (currentUser && videoDetail?._id) {
        try {
          await axiosInstance.put(`/video/${videoDetail?._id}/view`);
        } catch (err) {
          toast.error("Error updating view:", err);
        }
      }
    };

    addView();
  }, [currentUser, videoDetail?._id]);

  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }

  if (!videoDetail) {
    return <Loading />;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Video Player */}
      <div className="w-full flex justify-center bg-black">
        <video
          controls
          autoPlay
          muted
          className="w-full max-w-7xl rounded-lg shadow-xl aspect-video"
          src={videoDetail.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Video Title */}
        <h1 className="text-2xl font-semibold mb-3 text-gray-900">
          {videoDetail.title || "Untitled Video"}
        </h1>
        <p className="text-gray-500 text-sm mb-4">
          {formatViews(videoDetail?.views?.length || 0)} views •{" "}
          {formatDistanceToNow(new Date(videoDetail?.createdAt), {
            addSuffix: true,
          })}
        </p>

        {/* Video Info Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4 gap-3">
          <div className="flex items-center justify-between gap-3 w-full sm:justify-start">
            {/* Left side (avatar + name) */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                navigate(`/channel/${videoDetail?.channelId?._id}`)
              }
            >
              <img
                src={videoDetail?.channelId?.channelAvatar || defaultAvatar}
                alt="Channel Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-gray-900 font-semibold">
                  {videoDetail.channelId?.channelName || "Unknown Channel"}
                </h2>
              </div>
            </div>

            {/* Subscribe button */}
            <button className="bg-red-600 text-white px-4 py-1.5 rounded-full font-medium hover:bg-red-700 transition">
              Subscribe
            </button>
          </div>

          {/* Right side: likes/dislikes */}

          <div className="flex items-center gap-4 text-xl mt-3">
            <button className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition">
              <AiFillLike /> <span>{videoDetail.likes?.length || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-700 hover:text-red-600 transition">
              <AiFillDislike /> <span>{videoDetail.dislikes?.length || 0}</span>
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 bg-white rounded-xl shadow-md p-5 mb-6">
          <p className="text-gray-700 leading-relaxed">
            {showFullDesc
              ? videoDetail.description
              : videoDetail.description?.slice(0, 150)}
            {videoDetail.description?.length > 150 && (
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="ml-2 text-blue-600 font-medium"
              >
                {showFullDesc ? "Show less" : "Show more"}
              </button>
            )}
          </p>
          {videoDetail?.tags && videoDetail.tags.length > 0 && (
            <p className="text-blue-600">
              {videoDetail.tags
                .filter((tag) => tag && tag.trim() !== "") // remove empty strings
                .slice(0, 2) // only first two
                .map((tag, index) => `#${tag}`)
                .join(" ")}
            </p>
          )}
        </div>

        {/* Comments */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Comments</h2>
          <Comments videoId={videoDetail._id} />
        </div>
      </div>
    </div>
  );
}

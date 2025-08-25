import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import { formatDistanceToNow } from "date-fns";

import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

import { toast } from "react-toastify";

import formatViews from "../utiles/formatViews";
import Loading from "./Loading";
import axiosInstance from "../utiles/axiosInstance";
import Comments from "../components/Comments";
import defaultAvatar from "../assets/default-avatar.jpg";

// Video Play page
export default function Video() {
  // getting video id from url
  const { id } = useParams();

  const [videoDetail, setVideoDetail] = useState(null); // state for storing video details
  const [errorMessage, setErrorMessage] = useState(""); /// state for managing error
  const [showFullDesc, setShowFullDesc] = useState(false); // state for show more button

  const navigate = useNavigate(); // initilizing navigation method
  // getting current user from redux store
  const currentUser = useSelector((store) => store.user.user);

  // hook for fetching video details
  useEffect(() => {
    // function for fetching video details
    const fetchVideo = async () => {
      try {
        // request to server for fetching video details with the help of video id
        const res = await axiosInstance.get(`/video/${id}`);
        // setting into the video details state
        setVideoDetail(res.data);
      } catch (error) {
        // handling error
        toast.error(
          "Unable to fetch the Video",
          error.response?.data?.message || error.message
        );
        setErrorMessage(
          error.response?.data?.message || "Unable to fetch video"
        );
      }
    };
    // calling the fetch video details function here
    fetchVideo();
  }, [id]);

  // hook for incresing views of the video
  useEffect(() => {
    // function for incresing video views
    const addView = async () => {
      // checking if valid user and video id exists
      if (currentUser && videoDetail?._id) {
        try {
          // addig user id to the views array
          await axiosInstance.put(`/video/${videoDetail?._id}/view`);
        } catch (error) {
          // handling error
          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Something went wrong"
          );
        }
      }
    };

    addView();
  }, [currentUser, videoDetail?._id]);

  // Handling error while fetching video details
  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }
  // for managing the loading state
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
        {/* upload date and views */}
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
              {/* Channel avatar */}
              <img
                src={videoDetail?.channelId?.channelAvatar || defaultAvatar}
                alt="Channel Avatar"
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                {/* channel name */}
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
          {/* Video description */}
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
          {/* tags of the videos */}
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

        {/* Comments Section */}
        <div className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-lg font-semibold mb-4 text-gray-900">Comments</h2>
          <Comments videoId={videoDetail._id} />
        </div>
      </div>
    </div>
  );
}

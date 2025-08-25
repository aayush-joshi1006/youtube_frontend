import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";

import { formatDistanceToNow } from "date-fns";

import { BsThreeDotsVertical } from "react-icons/bs";

import { toast } from "react-toastify";

import EditVideo from "../components/EditVideo.jsx";
import Loading from "./Loading";
import axiosInstance from "../utiles/axiosInstance";
import formatDuration from "../utiles/formatDuration.js";
import formatViews from "../utiles/formatViews.js";
import defaultAvatar from "../assets/default-avatar.jpg";
import NotFoundImage from "../assets/NotFound.avif";

export default function YourChannel() {
  // getting channel id from the url
  const { id } = useParams();

  const [channel, setChannel] = useState(null); // for managing channel details
  const [message, setMessage] = useState(""); // for setting the channel created time

  const [error, setError] = useState(null); // for managing the error
  const [loaded, setLoaded] = useState(false); // for managing laoding state of videos

  const [openDropdown, setOpenDropdown] = useState(null); // dropdown menu for videos

  const [targetVideo, setTargetVideo] = useState(null); // target id of video to be deleted
  const [showConfirm, setShowConfirm] = useState(false); // for displaying the confirm dialog box

  const [showEdit, setShowEdit] = useState(false); // showing the edit dialog box
  const [editingVideo, setEditingVideo] = useState(null); // taget id of video details to be editted

  const dropdownRef = useRef(null); // reference for dropdown

  const navigate = useNavigate(); // initializing navigation instance
  // getting current user from redux store
  const currentUser = useSelector((store) => store.user.user);

  // 0.3 seconds delay before videos load
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // hook for fetching channel details
  useEffect(() => {
    // function for fetching channel details
    let fetchChannel = async () => {
      try {
        // request to the server for getting channel details
        const res = await axiosInstance.get(`/channel/${id}`);
        // setting the state of channel details
        setChannel(res.data.channel);
      } catch (error) {
        // handling the errors here
        setError(error.response?.data.message || "Something went wrong");
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    };
    // only run the fetch channel details if there is a id present
    if (id) fetchChannel();
  }, [id]);

  // for managing the the state of when the user joined
  useEffect(() => {
    if (channel) {
      setMessage(
        `Joined ${formatDistanceToNow(new Date(channel?.createdAt), {
          addSuffix: true,
        })}`
      );
    }
  }, [channel]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    }

    if (openDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Auto close dropdown after 3 seconds
  useEffect(() => {
    if (openDropdown) {
      const timer = setTimeout(() => setOpenDropdown(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [openDropdown]);

  // handlingthe click function so that delete dialog can be viewed
  const handleDeleteClick = (videoId) => {
    setTargetVideo(videoId);
    setShowConfirm(true);
  };

  // function for handling the deleting of the video
  const confirmDelete = async () => {
    try {
      // sending delete request for deleting the video
      await axiosInstance.delete(`/video/delete/${targetVideo}`);
      // removing video data from the frontend
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== targetVideo),
      }));

      toast.success("Video deleted successfully");
    } catch (error) {
      // handling the error while deleting video
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      setShowConfirm(false);
      setTargetVideo(null);
    }
  };

  // function for opening the edit video dialog box
  const handleEditClick = (video) => {
    setEditingVideo(video);
    setShowEdit(true);
  };

  // in case there is error while fetching channel details or any other errors
  if (error)
    return <div className="text-center mt-4 text-red-500"> Error: {error}</div>;
  // while the channel is not loaded
  if (!channel) return <Loading />;

  return (
    <>
      {/* Background banner */}
      <div
        className="relative h-64 border-b-2 shadow-xl"
        style={{
          backgroundImage: `url(${channel.channelBanner || NotFoundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

        {/* channel Avatar */}
        <img
          src={channel.channelAvatar || defaultAvatar}
          alt="Profile pic"
          className="w-32 h-32 rounded-full object-cover object-center absolute -bottom-14 left-6 border-4 border-white shadow-xl"
        />

        {/* Channel Info */}
        <div className="absolute -bottom-26 left-44 pr-6 flex flex-col max-w-xl">
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
        {/* conditional render of videos in the channel */}
        {channel?.videos.map((video) => (
          <div
            className={`flex flex-col p-4 cursor-pointer transition-all duration-700 transform ${
              loaded ? "scale-100 opacity-100" : "scale-0 opacity-0"
            }`}
            onClick={() => navigate(`/video/${video?._id}`)}
            key={video?._id}
          >
            {/* Thumbnail */}
            <div className="relative w-full overflow-hidden rounded-xl">
              <img
                src={video?.thumbnailUrl}
                loading="lazy"
                alt={video?.title}
                className="w-full h-full object-cover aspect-video rounded-xl transition-transform duration-500 hover:scale-105 hover:ring-2 hover:ring-blue-600"
              />
              {/* video duration */}
              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md">
                {formatDuration(video.duration)}
              </span>
            </div>

            {/* Video Info */}
            <div className="flex justify-between items-center">
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
              {/* only if user id matches with the channel owner */}
              {currentUser?.channel === channel?._id ? (
                // dropdown menu
                <div
                  className="flex relative justify-center items-center p-1 hover:bg-gray-300 rounded-full cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(
                      openDropdown === video._id ? null : video._id
                    );
                  }}
                >
                  <BsThreeDotsVertical />

                  {openDropdown === video._id && (
                    <div
                      className="absolute right-7 bottom-0 bg-white border rounded-md shadow-lg z-50 w-32"
                      onClick={(e) => e.stopPropagation()}
                      ref={dropdownRef}
                    >
                      {/* Edit button */}
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          handleEditClick(video);
                          setOpenDropdown(null);
                        }}
                      >
                        Edit
                      </button>
                      {/* Delete button */}
                      <button
                        className="w-full px-4 py-2 text-left text-red-500 hover:bg-red-100"
                        onClick={() => handleDeleteClick(video._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
        {/* delete video dialog box */}
        {showConfirm && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowConfirm(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Delete video?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                This action can’t be undone.
              </p>

              <div className="mt-6 flex justify-end gap-3">
                {/* Cancel button */}
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                {/* Delete video button */}
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit video dialog box */}
        {showEdit && editingVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowEdit(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Render EditVideo Component */}
              <EditVideo
                video={editingVideo}
                onClose={() => setShowEdit(false)}
                onUpdate={(updated) => {
                  // update local state immediately after save
                  setChannel((prev) => ({
                    ...prev,
                    videos: prev.videos.map((v) =>
                      v._id === updated._id ? updated : v
                    ),
                  }));
                  setShowEdit(false);
                }}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

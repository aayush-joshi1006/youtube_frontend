import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import Loading from "./Loading";
import { formatDistanceToNow } from "date-fns";
import formatDuration from "../utiles/formatDuration.js";
import formatViews from "../utiles/formatViews.js";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useSelector } from "react-redux";
import EditVideo from "../components/EditVideo.jsx";

export default function YourChannel() {
  const { id } = useParams();

  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetVideo, setTargetVideo] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);

  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const currentUser = useSelector((store) => store.user.user);

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
        console.log(res.data);
        
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

  useEffect(() => {
    if (channel) {
      setMessage(
        `Joined ${formatDistanceToNow(new Date(channel?.createdAt), {
          addSuffix: true,
        })}`
      );
    }
  }, [channel]);

  // --- Close dropdown on outside click
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

  // --- Auto close after 3 seconds
  useEffect(() => {
    if (openDropdown) {
      const timer = setTimeout(() => setOpenDropdown(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [openDropdown]);

  const handleDeleteClick = (videoId) => {
    setTargetVideo(videoId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setChannel((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== targetVideo),
      }));

      await axiosInstance.delete(`/video/delete/${targetVideo}`);
    } catch (error) {
      console.error("Error deleting video", error);
      alert(error.response?.data?.message || "Failed to delete video");
    } finally {
      setShowConfirm(false);
      setTargetVideo(null);
    }
  };

  const handleEditClick = (video) => {
    setEditingVideo(video);
    setShowEdit(true);
  };

  if (error) return <div> Error: {error}</div>;
  if (!channel) return <Loading />;

  return (
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
        {channel.videos.map((video) => (
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
              {currentUser.channel === channel._id ? (
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
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-100"
                        onClick={() => {
                          handleEditClick(video);
                          setOpenDropdown(null);
                        }}
                      >
                        Edit
                      </button>
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
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
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

        {showEdit && editingVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => setShowEdit(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Import & Render EditVideo Component */}
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

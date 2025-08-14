import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import { addUser } from "../utiles/userSlice";

export default function CreateChannel() {
  const user = useSelector((store) => store.user.user);

  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelAvatar, setChannelAvatar] = useState(null);
  const [channelBanner, setChannelBanner] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.isChannelCreated) {
      navigate(`/channel/${user.channel}`);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setStatusMessage("");

    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("description", description);
    if (channelAvatar) formData.append("channelAvatar", channelAvatar);
    if (channelBanner) formData.append("channelBanner", channelBanner);

    try {
      const res = await axiosInstance.post("/channel/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const persent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(persent);
        },
      });
      console.log("Channel created", res.data);
      setUploadProgress("Channel Created Successfully");

      setUploadProgress(null);
      setStatusMessage("Created Channel Successfully");
      setChannelName("");
      setDescription("");
      setChannelAvatar(null);
      setChannelBanner(null);

      const { data } = await axiosInstance.get("/user");
      dispatch(addUser(data.user));
      navigate(`/channel/${res.data.channel._id}`);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Upload failed. Try again.";
      console.error("Upload Failed:", errorMsg);
      setStatusMessage(errorMsg);
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <form
        className="max-w-md mx-auto h-[80vh] flex justify-center items-center flex-col "
        onSubmit={handleSubmit}
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="channel_name"
            id="channel_name"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
          />
          <label
            htmlFor="channel_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Channel Name (*)
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <textarea
            type="text"
            name="channel_description"
            id="channel_description"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <label
            htmlFor="channel_description"
            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Description (*)
          </label>
        </div>

        <div className="w-full">
          <label
            className="block mb-2 text-sm text-gray-500"
            htmlFor="image_avatar"
          >
            Upload Avatar:{" "}
            <span className="text-xs text-red-600">
              Only JPEG/JPG/PNG/WEBP allowed. (MAX. 5MB).
            </span>
          </label>
          <input
            className="block w-full p-1 text-sm text-gray-900 border py-1 border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
            aria-describedby="image_avatar_help"
            id="image_avatar"
            type="file"
            onChange={(e) => setChannelAvatar(e.target.files[0])}
          />
        </div>

        <div className="w-full my-4">
          <label
            className="block mb-2 text-sm text-gray-500"
            htmlFor="image_banner"
          >
            Upload Banner:{" "}
            <span className="text-xs text-red-600">
              Only JPEG/JPG/PNG/WEBP allowed. (MAX. 5MB).
            </span>
          </label>
          <input
            className="block w-full p-1 text-sm text-gray-900 border py-1 border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
            aria-describedby="image_banner_help"
            id="image_banner"
            type="file"
            onChange={(e) => setChannelBanner(e.target.files[0])}
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
    ${
      isUploading
        ? "bg-blue-300 cursor-not-allowed"
        : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
    }
  `}
        >
          {isUploading && typeof uploadProgress === "number"
            ? `Uploading... ${uploadProgress}%`
            : "Submit"}
        </button>
        {statusMessage && (
          <p
            className={`text-sm mt-4 text-center ${
              statusMessage.startsWith("Created")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </form>
    </>
  );
}

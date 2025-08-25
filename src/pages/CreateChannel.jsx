import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import axiosInstance from "../utiles/axiosInstance";
import { addUser } from "../utiles/userSlice";

// create channel page
export default function CreateChannel() {
  // getting current user from store
  const user = useSelector((store) => store.user.user);
  // states for managing data like channel name,description, channel avatar and banner
  const [channelName, setChannelName] = useState("");
  const [description, setDescription] = useState("");
  const [channelAvatar, setChannelAvatar] = useState(null);
  const [channelBanner, setChannelBanner] = useState(null);
  //state for managing the upload progress
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  // initializing dispatch and navigate method
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // hook for managing unauthorized user and those whose channel is already created
  useEffect(() => {
    if (!user) {
      navigate("/login"); // navigate to login page in case user is not looged in
    } else if (user.isChannelCreated) {
      navigate(`/channel/${user.channel}`); // in case channel is already created
    }
  }, [user]);
  // function for handling the submission of form
  const handleSubmit = async (e) => {
    // preventing default behavior of submit
    e.preventDefault();
    // starting the upload state
    setIsUploading(true);
    setStatusMessage("");
    // creating a form data object for easy data submittion
    const formData = new FormData();
    formData.append("channelName", channelName);
    formData.append("description", description);
    if (channelAvatar) formData.append("channelAvatar", channelAvatar);
    if (channelBanner) formData.append("channelBanner", channelBanner);

    try {
      // making request to the server for creating channel
      const res = await axiosInstance.post("/channel/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          // method provided by axios for getting the upload progress
          const persent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(persent);
        },
      });
      setUploadProgress("Channel Created Successfully");

      setUploadProgress(null);
      setStatusMessage("Created Channel Successfully");
      setChannelName("");
      setDescription("");
      setChannelAvatar(null);
      setChannelBanner(null);
      // updating the user in the redux store too
      const { data } = await axiosInstance.get("/user");
      dispatch(addUser(data.user));
      // navigating to the created channel
      navigate(`/channel/${res.data.channel._id}`);
    } catch (error) {
      // in case there is an error while creating the channel
      const errorMsg =
        error.response?.data?.message || "Upload failed. Try again.";
      toast.error("Upload Failed:", errorMsg);
      setStatusMessage(errorMsg);
      setUploadProgress(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] px-4">
      <form
        className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create Your Channel
        </h2>

        {/* Channel Name */}
        <div className="mb-5">
          <label
            htmlFor="channel_name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Channel Name *
          </label>
          <input
            type="text"
            id="channel_name"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            required
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div className="mb-5">
          <label
            htmlFor="channel_description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description *
          </label>
          <textarea
            id="channel_description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>

        {/* Avatar Upload */}
        <div className="mb-5">
          <label
            htmlFor="image_avatar"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Avatar{" "}
            <span className="text-xs text-gray-500">
              (JPEG/JPG/PNG/WEBP, max 5MB)
            </span>
          </label>
          <input
            type="file"
            id="image_avatar"
            onChange={(e) => setChannelAvatar(e.target.files[0])}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>

        {/* Banner Upload */}
        <div className="mb-6">
          <label
            htmlFor="image_banner"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Upload Banner{" "}
            <span className="text-xs text-gray-500">
              (JPEG/JPG/PNG/WEBP, max 5MB)
            </span>
          </label>
          <input
            type="file"
            id="image_banner"
            onChange={(e) => setChannelBanner(e.target.files[0])}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100"
          />
        </div>

        {/* Progress Bar */}
        {isUploading && typeof uploadProgress === "number" && (
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1 text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold text-white shadow-md transition-colors ${
            isUploading
              ? "bg-indigo-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          }`}
        >
          {isUploading ? "Creating..." : "Create Channel"}
        </button>

        {/* Status */}
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
    </div>
  );
}

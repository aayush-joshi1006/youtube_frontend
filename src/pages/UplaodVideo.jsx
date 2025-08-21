import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";

export default function UplaodVideo() {
  const user = useSelector((store) => store.user.user);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag1, setTag1] = useState("");
  const [tag2, setTag2] = useState("");
  const [videoUpload, setVideoUpload] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (!user.channel) {
      navigate("/createChannel");
    }
  }, [user]);

  const validateFile = (file) => {
    const validTypes = ["video/mp4", "video/quicktime", "video/mov"];
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Only MP4/MOV/QUICKTIME allowed.";
    }
    if (file.size > maxSize) {
      return "File size exceeds 100MB limit.";
    }
    return null;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) {
      setStatusMessage(error);
      setVideoUpload(null);
    } else {
      setStatusMessage("");
      setVideoUpload(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // setIsUploading(true);
    // setStatusMessage("");

    // let trimmedTitle = title.trim();
    // let trimmedDescription = description.trim();

    // if (!trimmedTitle || !trimmedDescription) return;

    // if (!videoUpload) return;

    // let tags = [tag1.trim(), tag2.trim()].filter((tag) => tag.length > 0);

    // let formData = new FormData();
    // formData.append("title", trimmedTitle);
    // formData.append("description", trimmedDescription);
    // formData.append("video", videoUpload);
    // formData.append("tags", tag1);
    // formData.append("tags", tag2);

    if (!title.trim() || !description.trim() || !videoUpload) {
      setStatusMessage("Please fill in all required fields.");
      return;
    }

    setIsUploading(true);
    setStatusMessage("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("video", videoUpload);
    if (tag1) formData.append("tags", tag1.trim());
    if (tag2) formData.append("tags", tag2.trim());

    try {
      const res = await axiosInstance.post("/video/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const present = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(present);
        },
      });
      console.log("Video Uploaded", res.data);
      setUploadProgress("Video Uploaded Successfully");

      setUploadProgress(null);
      setStatusMessage("Video Uploaded Successfully");
      setTitle("");
      setDescription("");
      setTag1("");
      setTag2("");
      setVideoUpload(null);

      navigate("/");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Upload failed. Try again.";
      console.error("Upload Failed:", errorMsg);
      setStatusMessage(errorMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  return (
    //   <>
    //     <div className="h-[80vh] flex justify-center items-center flex-col">
    //       <form className="max-w-sm mx-auto " onSubmit={handleSubmit}>
    //         <div className="mb-5">
    //           <label
    //             for="title"
    //             className="block mb-2 text-sm font-medium text-gray-900"
    //           >
    //             Title (*)
    //           </label>
    //           <input
    //             type="text"
    //             id="title"
    //             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //             placeholder=""
    //             value={title}
    //             onChange={(e) => setTitle(e.target.value)}
    //             required
    //           />
    //         </div>
    //         <div className="mb-5">
    //           <label
    //             for="description"
    //             className="block mb-2 text-sm font-medium text-gray-900"
    //           >
    //             Description (*)
    //           </label>
    //           <textarea
    //             type="text"
    //             id="title"
    //             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
    //             placeholder=""
    //             required
    //             value={description}
    //             onChange={(e) => setDescription(e.target.value)}
    //             rows="4"
    //           ></textarea>
    //         </div>

    //         <div className="mb-5">
    //           <label className="block mb-2 text-sm font-medium text-gray-900">
    //             Tags
    //           </label>
    //           <div className="flex gap-3">
    //             <input
    //               type="text"
    //               placeholder="Tag 1"
    //               value={tag1}
    //               onChange={(e) => setTag1(e.target.value)}
    //               className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
    //             />
    //             <input
    //               type="text"
    //               placeholder="Tag 2"
    //               value={tag2}
    //               onChange={(e) => setTag2(e.target.value)}
    //               className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
    //             />
    //           </div>
    //         </div>

    //         <div className="w-full">
    //           <label
    //             className="block mb-2 text-sm text-gray-500"
    //             htmlFor="video_upload"
    //           >
    //             Upload Video:{" "}
    //             <span className="text-xs text-red-600">
    //               Only MP4/MOV/QUICKTIME allowed. (MAX. 100MB).
    //             </span>
    //           </label>
    //           <input
    //             className="block w-full p-1 text-sm text-gray-900 border py-1 border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
    //             aria-describedby="video_upload_help"
    //             id="video_upload"
    //             type="file"
    //             onChange={(e) => setVideoUpload(e.target.files[0])}
    //           />
    //         </div>

    //         <button
    //           type="submit"
    //           disabled={isUploading}
    //           className={`text-white font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center
    //   ${
    //     isUploading
    //       ? "bg-blue-300 cursor-not-allowed"
    //       : "bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
    //   }
    // `}
    //         >
    //           {isUploading && typeof uploadProgress === "number"
    //             ? `Uploading... ${uploadProgress}%`
    //             : "Submit"}
    //         </button>
    //         {statusMessage && (
    //           <p
    //             className={`text-sm mt-4 text-center ${
    //               statusMessage.startsWith("Created")
    //                 ? "text-green-600"
    //                 : "text-red-600"
    //             }`}
    //           >
    //             {statusMessage}
    //           </p>
    //         )}
    //       </form>
    //     </div>
    //   </>
    <div className="h-[80vh] flex justify-center items-center">
      <form
        className="max-w-md w-full bg-white p-6 rounded-lg shadow-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-lg font-semibold mb-4">Upload a Video</h2>

        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Title (*)
          </label>
          <input
            type="text"
            id="title"
            className="w-full border rounded-lg p-2.5 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isUploading}
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Description (*)
          </label>
          <textarea
            id="description"
            rows="4"
            className="w-full border rounded-lg p-2.5 text-sm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isUploading}
            required
          />
        </div>

        {/* Tags */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tag 1"
              value={tag1}
              onChange={(e) => setTag1(e.target.value)}
              className="flex-1 border rounded-lg p-2.5 text-sm"
              disabled={isUploading}
            />
            <input
              type="text"
              placeholder="Tag 2"
              value={tag2}
              onChange={(e) => setTag2(e.target.value)}
              className="flex-1 border rounded-lg p-2.5 text-sm"
              disabled={isUploading}
            />
          </div>
        </div>

        {/* Video Upload */}
        <div className="mb-4">
          <label
            htmlFor="video_upload"
            className="block mb-2 text-sm text-gray-500"
          >
            Upload Video:{" "}
            <span className="text-xs text-red-600">
              Only MP4/MOV/QUICKTIME allowed. (MAX. 100MB).
            </span>
          </label>
          <input
            id="video_upload"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="w-full border rounded-lg text-sm p-2"
          />
        </div>

        {/* Progress Bar */}
        {isUploading && typeof uploadProgress === "number" && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full py-2.5 rounded-lg text-white font-medium ${
            isUploading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading && typeof uploadProgress === "number"
            ? `Uploading... ${uploadProgress}%`
            : "Upload Video"}
        </button>

        {/* Status Message */}
        {statusMessage && (
          <p
            className={`text-sm mt-3 text-center ${
              statusMessage.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {statusMessage}
          </p>
        )}
      </form>
    </div>
  );
}

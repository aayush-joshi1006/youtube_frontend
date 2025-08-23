import React, { useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import {toast} from "react-toastify"

export default function EditVideo({ video, onClose, onUpdate }) {
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [tags, setTags] = useState(() => {
    const initial = video?.tags || [];
    return [initial[0] || "", initial[1] || ""];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

     setLoading(true);
     setError("");
     const cleanedTags = [
       ...new Set(tags.map((t) => t.trim()).filter(Boolean)),
     ].slice(0, 2);

    try {
      const res = await axiosInstance.put(`/video/${video._id}`, {
        title: title.trim(),
        description: description.trim(),
        tags: cleanedTags,
      });

      onUpdate(res.data.video);
    toast.success("Edit Successful")
      onClose();
    } catch (err) {
      toast.error("Error updating video:", err);
      setError(err.response?.data?.message || "Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Edit Video</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter video title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter video description"
          />
        </div>

        {/* Tags (2 inputs side by side) */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tags[0]}
              onChange={(e) => setTags([e.target.value, tags[1]])}
              className="w-1/2 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tag 1"
            />
            <input
              type="text"
              value={tags[1]}
              onChange={(e) => setTags([tags[0], e.target.value])}
              className="w-1/2 rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tag 2"
            />
          </div>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";
import defaultAvatar from "../assets/default-avatar.jpg";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [currentComment, setCurrentComment] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [targetComment, setTargetComment] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const user = useSelector((store) => store.user.user);
  const navigate = useNavigate();
  const menuRefs = useRef({});

  useEffect(() => {
    function handleClickOutside(e) {
      if (openMenuId) {
        const menuEl = menuRefs.current[openMenuId];
        if (menuEl && !menuEl.contains(e.target)) {
          setOpenMenuId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenuId]);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axiosInstance.get(`/comment?videoId=${videoId}`);
        setComments(res.data.comments || []);
        console.log(res.data);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      }
    };
    getAllComments();
  }, [videoId]);

  const addComment = async () => {
    const trimmedComment = currentComment.trim();
    if (!trimmedComment) return;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const res = await axiosInstance.post(`/comment?videoId=${videoId}`, {
        text: trimmedComment,
      });
      setComments((prev) => [res.data.newComment, ...prev]);
      setCurrentComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (commentId) => {
    setTargetComment(commentId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      setComments((prev) => prev.filter((c) => c._id !== targetComment));
      await axiosInstance.delete(`/comment/${targetComment}`);
    } catch (error) {
      console.error(error);
    } finally {
      setShowConfirm(false);
      setTargetComment(null);
    }
  };

  const handleEditClick = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const handleSaveEdit = async (commentId) => {
    try {
      const { data } = await axiosInstance.put(`/comment/${commentId}`, {
        text: editText,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );
      setEditingId(null);
      setEditText("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Comment Input */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
        />
        <button
          onClick={addComment}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Comment
        </button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="rounded-lg bg-gray-50 p-4 shadow-sm border flex justify-between items-start"
          >
            <div className="flex-1 flex gap-3">
              {/* Channel Avatar */}
              <img
                src={
                  comment.user?.channel?.channelAvatar || defaultAvatar
                }
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-800">
                    {comment.user?.username || "Anonymous"}
                  </p>
                  <span className="text-sm text-gray-500">
                   {formatDistanceToNow(new Date(comment?.createdAt), {
                               addSuffix: true,
                             })}
                  </span>
                </div>

                {editingId === comment._id ? (
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 rounded border px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-1">{comment.text}</p>
                )}
              </div>
            </div>

            {/* Menu */}
            <div
              className="relative"
              ref={(el) => (menuRefs.current[comment._id] = el)}
            >
              {user?._id === comment.user?._id && (
                <button
                  onClick={() => setOpenMenuId(comment._id)}
                  className="p-2 rounded-full hover:bg-gray-200"
                >
                  <CiMenuKebab />
                </button>
              )}
              {openMenuId === comment._id && (
                <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow-md z-10">
                  <button
                    onClick={() => {
                      handleEditClick(comment);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteClick(comment._id);
                      setOpenMenuId(null);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Confirm Delete Modal */}
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
              Delete comment?
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
    </div>
  );
}

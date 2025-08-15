import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  useEffect(() => {
    const getAllComments = async () => {
      try {
        const res = await axiosInstance.get(`/comment?videoId=${videoId}`);
        console.log("comments:", res.data);
        setComments(res.data.comments || []);
      } catch (error) {
        console.error(
          "Unable to fetch comments",
          error.response?.data?.message || error.message
        );
        setError(error.response?.data?.message || error.message);
      }
    };
    getAllComments();
  }, [videoId]);

  useEffect(() => {
    if (!openMenuId) return;

    const timer = setTimeout(() => {
      setOpenMenuId(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [openMenuId]);

  const addComment = async () => {
    const trimmedComment = currentComment.trim();
    if (!trimmedComment) return;

    if (!user) {
      navigate("/login");
      return; // prevent posting
    }

    try {
      const res = await axiosInstance.post(`/comment?videoId=${videoId}`, {
        text: trimmedComment,
      });
      console.log("current comment: ", res.data);

      setComments((prev) => [res.data.newComment, ...prev]);
      setCurrentComment("");
    } catch (error) {
      console.error(
        "Unable to post comment",
        error.response?.data?.message || error.message
      );
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
      console.error("Error editing comment:", err);
    }
  };

  return (
    <div>
      {/* Comment Input */}
      <div>
        <input
          type="text"
          value={currentComment}
          onChange={(e) => setCurrentComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={addComment}>Add Comment</button>
      </div>

      {/* Error message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Comment List */}
      <div>
        {comments.length === 0 ? (
          <p>No comments yet</p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border-b py-2 flex justify-between items-start"
            >
              <div className="flex-1">
                <strong>{comment.user?.username || "Anonymous"}:</strong>{" "}
                {editingId === comment._id ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="border rounded px-2 py-1 flex-1"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(comment._id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
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
                  <span>{comment.text}</span>
                )}
              </div>

              <div
                className="relative"
                ref={(el) => (menuRefs.current[comment._id] = el)}
              >
                {user?._id === comment.user?._id && (
                  <button onClick={() => setOpenMenuId(comment._id)}>
                    <CiMenuKebab />
                  </button>
                )}
                {openMenuId === comment._id && (
                  <div className="absolute right-0 mt-2 w-28 bg-white border rounded shadow z-10">
                    <button
                      onClick={() => {
                        handleEditClick(comment);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-gray-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        handleDeleteClick(comment._id);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-3 py-1 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowConfirm(false)}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Delete comment?</h3>
            <p className="mt-1 text-sm text-gray-600">
              This action can’t be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-xl border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
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

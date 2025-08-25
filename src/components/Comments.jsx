import React, { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

import { CiMenuKebab } from "react-icons/ci";
import { formatDistanceToNow } from "date-fns";

import { toast } from "react-toastify";

import defaultAvatar from "../assets/default-avatar.jpg";
import axiosInstance from "../utiles/axiosInstance";

// component for managing comments
export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]); // state for all the comments
  const [currentComment, setCurrentComment] = useState(""); // state for comment input
  const [error, setError] = useState(null); // state for managing error

  const [openMenuId, setOpenMenuId] = useState(null); // state for the dropdown menu of the comment

  const [showConfirm, setShowConfirm] = useState(false); //state for the popup of delete confirmation
  const [targetComment, setTargetComment] = useState(null); // target comment that need to be deleted

  const [editingId, setEditingId] = useState(null); // comment ID that nned to be edited
  const [editText, setEditText] = useState(""); // state of new text of the comment

  const user = useSelector((store) => store.user.user); // getting current logged in user

  const navigate = useNavigate(); // navigation initilzation

  const menuRefs = useRef({}); // reference for dropdown menu

  //  for managing the outside click of dropdown menu of comment
  useEffect(() => {
    function handleClickOutside(e) {
      if (openMenuId) {
        const menuEl = menuRefs.current[openMenuId]; // getting the node of the reference
        if (menuEl && !menuEl.contains(e.target)) {
          // checking if node exists and taget is not the reference
          setOpenMenuId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside); // adding mouse click event
    return () => document.removeEventListener("mousedown", handleClickOutside); // unmounds the click event listener
  }, [openMenuId]);

  // hook for getting all the comments
  useEffect(() => {
    const getAllComments = async () => {
      try {
        // request for feching comments of a video
        const res = await axiosInstance.get(`/comment?videoId=${videoId}`);
        // setting the comments in the state
        setComments(res.data.comments || []);
      } catch (error) {
        // handling error in case fetch fails
        toast.error(error.response?.data?.message || error.message);
      }
    };
    // calling the getAllComments function
    getAllComments();
  }, [videoId]);

  // function for adding a comment
  const addComment = async () => {
    // using trim methtod for removing extra spacing
    const trimmedComment = currentComment.trim();
    // in case comment is not valid exiting the function
    if (!trimmedComment) return;
    // varifying if the user is logged in
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // making request to the backend for adding comment to the video
      const res = await axiosInstance.post(`/comment?videoId=${videoId}`, {
        text: trimmedComment,
      });
      // updating the state of the list of comment
      setComments((prev) => [res.data.newComment, ...prev]);
      // nortification for sucessfull comment
      toast.success("Comment added successfully");
      // seting the input field to empty string
      setCurrentComment("");
    } catch (error) {
      // in case comment is not added successfully
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  };

  // function for opening configuration box for deleting comment
  const handleDeleteClick = (commentId) => {
    // setting the state of comment id that need to be deleted
    setTargetComment(commentId);
    // making the confirmation box visible
    setShowConfirm(true);
  };

  // function for deleting the selected comment
  const confirmDelete = async () => {
    try {
      // removing the comment from the display
      setComments((prev) => prev.filter((c) => c._id !== targetComment));
      // making the request to the database for removing the comment
      await axiosInstance.delete(`/comment/${targetComment}`);
      // providing the successful deletion message
      toast.success("Comment deleted successfully");
    } catch (error) {
      // in case comment doesn't get deleted
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    } finally {
      // settingthe diplay of popup box as false
      setShowConfirm(false);
      // setting the state of taget comment as null
      setTargetComment(null);
    }
  };

  // function for enabling editing of comment
  const handleEditClick = (comment) => {
    // seeting the state of taget comment id to be deleted
    setEditingId(comment._id);
    // setting the value of input as the text of comment
    setEditText(comment.text);
  };
  // in case editing of the comment is canceled
  const handleCancelEdit = () => {
    // setingthe target edit id as null
    setEditingId(null);
    // settng the ediit text to empty string
    setEditText("");
  };

  // function for making the changes in the comment to databse
  const handleSaveEdit = async (commentId) => {
    try {
      // sending the request from deleting the comment
      const { data } = await axiosInstance.put(`/comment/${commentId}`, {
        text: editText,
      });
      // updating the comments in the frontend
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? data.comment : c))
      );
      // setting tagret comment id to null
      setEditingId(null);
      // settubg the edut text as enpty string
      setEditText("");
      // on successfully updating the comment
      toast.success("Comment editted");
    } catch (error) {
      // in case error occura while updating the comment
      toast.error(
        error.response?.data?.message || error.message || "Something went wrong"
      );
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
                src={comment.user?.channel?.channelAvatar || defaultAvatar}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {/* user name */}
                  <p className="font-semibold text-gray-800">
                    {comment.user?.username || "Anonymous"}
                  </p>
                  {/* commented on */}
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(comment?.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {/* for enabling editing and the text of the comment */}
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

            {/* drop dowm menu edit and delete option */}
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

      {/* Confirm Delete display box */}
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

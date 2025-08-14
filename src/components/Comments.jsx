import React, { useEffect, useState } from "react";
import axiosInstance from "../utiles/axiosInstance";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CiMenuKebab } from "react-icons/ci";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(null);
  const [currentComment, setCurrentComment] = useState("");

  const user = useSelector((store) => store.user.user);
  const navigate = useNavigate();

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
            <div key={comment._id} className="border-b py-2 flex justify-between">
              <p>
                <strong>{comment.user?.username || "Anonymous"}:</strong>{" "}
                {comment.text}
              </p>
              <span>{user?._id === comment.user?._id && <CiMenuKebab />}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

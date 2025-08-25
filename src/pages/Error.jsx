import React from "react";
import { useNavigate } from "react-router-dom";

// Error page
export default function Error() {
  // initializing navigate method
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center p-6">
      <h1 className="text-4xl font-bold text-red-500 mb-4">
        Oops! Something went wrong
      </h1>
      <p className="text-gray-600 mb-6">
        The page you are looking for might be unavailable or doesn’t exist.
      </p>
      {/* button for navigating back to homepage */}
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all"
      >
        Back to Homepage
      </button>
    </div>
  );
}

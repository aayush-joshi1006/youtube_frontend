import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utiles/axiosInstance";
import Comments from "../components/Comments";

export default function Video() {
  const { id } = useParams();

  const [videoDetail, setVideoDetail] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get(`/video/${id}`);
        console.log(res.data);
        setVideoDetail(res.data);
      } catch (error) {
        console.error(
          "Unable to fetch the Video",
          error.response?.data?.message || error.message
        );
        setErrorMessage(
          error.response?.data?.message || "Unable to fetch video"
        );
      }
    };
    fetchVideo();
  }, [id]);

  if (errorMessage) {
    return <div className="text-red-500 text-center mt-4">{errorMessage}</div>;
  }

  if (!videoDetail) {
    return <div className="text-center mt-4">Loading video...</div>;
  }

  return (
    <>
      <div>
        <video
          controls
          className="w-full shadow-lg h-[80vh]"
          src={videoDetail.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="flex justify-between items-center px-5">
        <div>
          <p>{videoDetail.description}</p>
          <Comments videoId={videoDetail._id} />
        </div>
        <div>Recommended videos</div>
      </div>
    </>
  );
}

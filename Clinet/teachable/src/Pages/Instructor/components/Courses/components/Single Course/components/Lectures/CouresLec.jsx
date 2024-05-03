/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import "./style/couresLec.css";
import http from "../../../../../../../../Helper/http";
import { useParams } from "react-router";
import ReactPlayer from "react-player";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { HiOutlineArchiveBoxXMark } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { FaDownload } from "react-icons/fa6";

const CouresLec = () => {
  const { id } = useParams();
  const videosQueueRef = useRef(null);

  const [modules, setModules] = useState({
    loading: false,
    data: [],
    errorMsg: "",
  });
  const [reloadData, setReloadData] = useState(true);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Call all modules
  useEffect(() => {
    if (reloadData) {
      setModules({ ...modules, loading: true });
      http
        .GET("courses/" + id + "/modules")
        .then((res) => {
          console.log(res.data.data.data);
          setModules({
            ...modules,
            loading: false,
            data: res.data.data.data.reverse(),
          });
          setReloadData(false);
        })
        .catch((err) => {
          console.log(err);
          setModules({
            ...modules,
            loading: false,
            errorMsg: "Something went wrong",
          });
          setReloadData(false);
        });
    }
  }, [reloadData]);

  useEffect(() => {
    // Scroll the videos queue to make the current playing video appear at the top
    if (videosQueueRef.current) {
      videosQueueRef.current.children[currentVideoIndex]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentVideoIndex]);

  const handleNextVideo = () => {
    if (currentVideoIndex < modules.data.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePreviousVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  const handleVideoClick = (index) => {
    setCurrentVideoIndex(index);
  };

  function getYouTubeThumbnail(url) {
    const videoIdMatch = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );
    if (!videoIdMatch) {
      console.log("Invalid YouTube URL");
      return;
    }
    const videoId = videoIdMatch[1];
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  return (
    <section className="couresLec-section">
      <div className="container">
        {/* handelErrors */}
        {modules.errorMsg !== "" && (
          <Alert severity="error">{modules.errorMsg}</Alert>
        )}
        {/* if no modules */}
        {modules.data.length === 0 &&
          modules.errorMsg === "" &&
          modules.loading === false && (
            <div className="no-modules">
              <span>No Lecturs</span>
              <HiOutlineArchiveBoxXMark />
            </div>
          )}
        {/* if loading and there is data*/}
        {modules.data.length > 0 &&
          modules.errorMsg === "" &&
          modules.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {/* if loading and there is no data */}
        {modules.data.length === 0 &&
          modules.errorMsg === "" &&
          modules.loading === true && (
            <CircularProgress
              sx={{
                margin: "auto",
                display: "block",
              }}
              size={60}
              color="inherit"
            />
          )}
        {/* if there is modules */}
        {modules.data.length > 0 &&
          modules.errorMsg === "" &&
          modules.loading === false && (
            <>
              <div className="header">
                <h3>Lectures Videos</h3>
              </div>
              <div className="videos-container">
                <div className="current-video-play">
                  {modules.data.length > 0 && (
                    <ReactPlayer
                      controls
                      width={"100%"}
                      height={"50vh"}
                      url={modules.data[currentVideoIndex].video}
                    />
                  )}
                  <div className="under-video">
                    <span>{modules.data[currentVideoIndex].title}</span>
                    <Link
                      to={modules.data[currentVideoIndex].file}
                      target="_blank"
                    >
                      download materials
                      <FaDownload />
                    </Link>
                  </div>
                  <div className="video-controls">
                    <button
                      onClick={handlePreviousVideo}
                      disabled={currentVideoIndex === 0}
                    >
                      <IoIosArrowBack />
                    </button>
                    <button
                      onClick={handleNextVideo}
                      disabled={currentVideoIndex === modules.data.length - 1}
                    >
                      <IoIosArrowForward />
                    </button>
                  </div>
                </div>
                <div className="videos-queue" ref={videosQueueRef}>
                  {modules.data.map((video, index) => (
                    <button
                      key={video._id}
                      onClick={() => handleVideoClick(index)}
                      className={`video-item ${
                        index === currentVideoIndex ? "current-video" : ""
                      }`}
                    >
                      <img
                        src={getYouTubeThumbnail(video.video)}
                        alt="Thumbnail"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
      </div>
    </section>
  );
};

export default CouresLec;

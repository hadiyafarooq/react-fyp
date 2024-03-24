import React, { useRef, useEffect, useState } from 'react';

function WebcamComponent() {
  const videoRef = useRef(null);
  const videoStreamRef = useRef(null);
  const [isVideoActive, setIsVideoActive] = useState(false);

  useEffect(() => {
    if (isVideoActive && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((streamObj) => {
          if (videoRef.current) {
            videoRef.current.srcObject = streamObj;
            videoStreamRef.current = streamObj;
          }
        })
        .catch((error) => console.error('Error accessing webcam:', error));
    }

    // Cleanup function to stop the video stream when the component unmounts
    return () => {
      if (videoStreamRef.current) {
        videoStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isVideoActive]);

  const startVideoFeed = () => {
    setIsVideoActive(true);
  };

  const stopVideoFeed = () => {
    setIsVideoActive(false);
    if (videoStreamRef.current) {
      videoStreamRef.current.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div>
      <h1>Webcam Feed</h1>
      <video ref={videoRef} autoPlay />
      {isVideoActive ? (
        <button onClick={stopVideoFeed}>Stop Video Feed</button>
      ) : (
        <button onClick={startVideoFeed}>Start Video Feed</button>
      )}
    </div>
  );
}

export default WebcamComponent;

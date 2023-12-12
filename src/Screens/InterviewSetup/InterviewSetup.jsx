// import React, { useState, useRef, useEffect } from "react";
// import './InterviewSetup.css';
// import { Link } from 'react-router-dom'
// const mimeType = "video/webm";

// const InterviewSetup = () => {
//   const [permission, setPermission] = useState(false);
//   const mediaRecorder = useRef(null);
//   const [recordingStatus, setRecordingStatus] = useState("inactive");
//   const [stream, setStream] = useState(null);
//   const liveVideoFeed = useRef(null);
//   const [recordedVideo, setRecordedVideo] = useState(null);

//   useEffect(() => {
//     if (liveVideoFeed.current) {
//       liveVideoFeed.current.srcObject = permission ? stream : null;
//     }
//   }, [stream, permission]);

//   const getCameraAndMicrophonePermission = async () => {
//     setRecordedVideo(null);
//     if ("MediaRecorder" in window) {
//       try {
//         const videoConstraints = {
//           audio: true,
//           video: true,
//         };
//         const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);
//         setPermission(true);
//         const combinedStream = new MediaStream([
//           ...videoStream.getVideoTracks(),
//           ...audioStream.getAudioTracks(),
//         ]);
//         setStream(combinedStream);
//       } catch (err) {
//         alert(err.message);
//       }
//     } else {
//       alert("The MediaRecorder API is not supported in your browser.");
//     }
//   };

//   const startRecording = () => {
//     setRecordingStatus("recording");
    
//     if (stream) {
//       const media = new MediaRecorder(stream, { type: mimeType });
//       mediaRecorder.current = media;
//       mediaRecorder.current.start();
//       let localVideoChunks = [];

//       mediaRecorder.current.ondataavailable = (event) => {
//         if (typeof event.data === "undefined") return;
//         if (event.data.size === 0) return;
//         localVideoChunks.push(event.data);
//       };

//       mediaRecorder.current.onstop = () => {
//         const videoBlob = new Blob(localVideoChunks, { type: mimeType });
//         const videoUrl = URL.createObjectURL(videoBlob);
//         setRecordedVideo(videoUrl);
//       };
//     }
//   };

//   const stopRecording = () => {
//     setRecordingStatus("inactive");
//     if (mediaRecorder.current) {
//       mediaRecorder.current.stop();
//     }
//     setStream(null);
//   };

//   const downloadVideo = () => {
//     if (recordedVideo) {
//       const a = document.createElement("a");
//       a.href = recordedVideo;
//       a.download = "recorded_video.webm";
//       a.style.display = "none";
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//     }
//     if (stream) {
//       stream.getTracks().forEach((track) => track.stop());
//     }
//     // setStream(null);
//   };

//   return (
//     <div className="Wholescreen">  
//         <div className="StartInterview">
//     <div className="interviewsetupbody">
//       <div>
//         {!permission ? (
//           <button className="Interviewbutton" onClick={getCameraAndMicrophonePermission}>
//             Get Microphone and Camera Access
//           </button>
//         ) : (
//           <div className="live-video">
//             <video ref={liveVideoFeed} controls autoPlay>
//               {permission && <source src={recordedVideo} type="video/webm" />}
//               Your browser does not support the video tag.
//             </video>
//           </div>
//         )}
//         <div className="buttons">
//           {permission && recordingStatus === "inactive" ? (
//             <button className="Interviewbutton" onClick={startRecording}>
//               Start Recording
//             </button> 
//           ) : null}
//           {recordingStatus === "recording" ? (
//             <button className="Interviewbutton" onClick={stopRecording}>
//               Stop Recording
//             </button>
//           ) : null}
//           {recordedVideo && (
//             <Link to="/IntervieweeDashboard">
//               <button className="Interviewbutton" onClick={downloadVideo}>
//                 Submit Interview
//               </button>
//             </Link>
//           )}
//         </div>
//       </div>
//     </div>
//     </div>
// </div>
//   );
// };

// export default InterviewSetup;

import React, { useState, useRef, useEffect } from "react";
import './InterviewSetup.css';
import { Link } from 'react-router-dom'
const mimeType = "video/webm";


const InterviewSetup = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const liveVideoFeed = useRef(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [questions, setQuestions] = useState([
    "Explain Use Cases in C++",
    "Describe Core Philosophy of C++?",
    "Enlist Data Types in C++",
    "Enlist Loop Constructs in Java",
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState(Array(questions.length).fill(""));

    const handleResponseChange = (event) => {
      const updatedResponses = [...userResponses];
      updatedResponses[currentQuestionIndex] = event.target.value;
      setUserResponses(updatedResponses);
    };
  
    const handleNextQuestion = () => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    };

  useEffect(() => {
    if (liveVideoFeed.current) {
      liveVideoFeed.current.srcObject = permission ? stream : null;
    }
  }, [stream, permission]);

  const getCameraAndMicrophonePermission = async () => {
    setRecordedVideo(null);
    if ("MediaRecorder" in window) {
      try {
        const videoConstraints = {
          audio: true,
          video: true,
        };
        const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const videoStream = await navigator.mediaDevices.getUserMedia(videoConstraints);
        setPermission(true);
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);
        setStream(combinedStream);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = () => {
    setRecordingStatus("recording");
    setShowChatbot(true);
    if (stream) {
      const media = new MediaRecorder(stream, { type: mimeType });
      mediaRecorder.current = media;
      mediaRecorder.current.start();
      let localVideoChunks = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (typeof event.data === "undefined") return;
        if (event.data.size === 0) return;
        localVideoChunks.push(event.data);
      };

      mediaRecorder.current.onstop = () => {
        const videoBlob = new Blob(localVideoChunks, { type: mimeType });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRecordedVideo(videoUrl);
       
      };
    }
  };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    setShowChatbot(false);
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
    }
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();

      audioTracks.forEach((track) => track.stop());
      videoTracks.forEach((track) => track.stop());
  
      setStream(null);
    }
  };

  const downloadVideo = () => {
    if (recordedVideo) {
      const a = document.createElement("a");
      a.href = recordedVideo;
      a.download = "recorded_video.webm";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  return (
    <div className="Wholescreen">  
        <div className="StartInterview">
    <div className="interviewsetupbody">
      <div>
        {!permission ? (
          <button className="Interviewbutton" onClick={getCameraAndMicrophonePermission}>
            Get Microphone and Camera Access
          </button>
        ) : (
          <div className="live-video">
            <video ref={liveVideoFeed} controls autoPlay>
              {permission && <source src={recordedVideo} type="video/webm" />}
              Your browser does not support the video tag.
            </video>
          </div>
        )}
        <div className="buttons">
          {permission && recordingStatus === "inactive" ? (
            <button className="Interviewbutton" onClick={startRecording}>
              Start Recording
            </button> 
          ) : null}
          {recordingStatus === "recording" ? (
            <button className="Interviewbutton" onClick={stopRecording}>
              Stop Recording
            </button>
          ) : null}
          {recordedVideo && (
            <Link to="/IntervieweeDashboard">
              <button className="Interviewbutton" onClick={downloadVideo}>
                Submit Interview
              </button>
            </Link>
          )}
        </div>
    {showChatbot && (
        <div className="chatbot-container">
          {currentQuestionIndex < questions.length ? (
            <div className="question">
              <p>{questions[currentQuestionIndex]}</p>
              <textarea
                placeholder="Your answer..."
                value={userResponses[currentQuestionIndex]}
                onChange={handleResponseChange}
              />
              <button className="Interviewbutton" onClick={handleNextQuestion}>Next</button>
            </div>
          ) : (
            <div className="thank-you">
              <p>Thank you for your responses!</p>
            </div>
          )}
        </div>
      )}
  </div>
  </div>
      </div>
      </div>
  );
};

export default InterviewSetup;

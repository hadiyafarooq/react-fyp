
import React, { useState, useRef, useEffect } from "react";
import './InterviewSetup.css';
import { Link } from 'react-router-dom'
import axios from "axios";
import Fade from "react-reveal/Fade";
const mimeType = "video/webm";


const InterviewSetup = () => {
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const liveVideoFeed = useRef(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const [questions, setQuestions] = useState([
    "Hello, How are you doing today?",
  ]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState(Array(questions.length).fill(""));

    const handleResponseChange = (event) => {
      const updatedResponses = [...userResponses];
      updatedResponses[currentQuestionIndex] = event.target.value;
      setUserResponses(updatedResponses);
    };
  
    const handleNextQuestion = () => {
      console.log(questions.length)
      if (currentQuestionIndex < questions.length - 50) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);        
      }
    };

    useEffect(() => {
      // Update the live video feed when stream or permission changes
      if (liveVideoFeed.current) {
        liveVideoFeed.current.srcObject = permission ? stream : null;
      }
    }, [stream, permission]); // Dependencies: stream and permission
  
    useEffect(() => {
      // Log the updated questions state
      console.log(questions);
    }, [questions]);

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

  const startRecording = async (e) => {
    
    e.preventDefault();
    try {
    
      // Make sure you have the correct endpoint and data format for your backend
      const response = await axios.post("http://127.0.0.1:5001/Questions", config);
  
      if (response && response.data.success) {
        const newQuestions = response.data.questions;
      
        // Create an array of question strings with indices
        const newQuestionsStrings = newQuestions.map((questionObj, index) => {
          const questionString = questionObj.question.replace(/["']/g, '');
          return `${questionString}`; // Adding 1 to index for human-friendly numbering
        });
      
        // Update the state by appending each new question string one by one
        setQuestions((prevQuestions) => {
          const updatedQuestions = [...prevQuestions, ...newQuestionsStrings];
          return updatedQuestions;
        });
      
        setShowChatbot(true);
        setRecordingStatus("recording");
      }else {
        setShowChatbot(false);
      }
    } catch (error) {
      console.error("Error during POST request:", error.message);
    }
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

    // WRITE LOGIC OF CALLING SCRIPT HERE
    
  };



  return (
    <Fade left duration={1000} delay={200}>
    <div className="Wholescreen">  
        <div className="StartInterview">
    <div className="interviewsetupbody">
      <div>
        {!permission ? (
          <button className="InterviewbuttonMic" onClick={getCameraAndMicrophonePermission}>
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
  {permission && !recordedVideo && recordingStatus === "inactive" && (
    <button className="Interviewbuttonstart" onClick={(e) => startRecording(e)}>
      Start Recording
    </button>
  )}

  {/* THIS IS STOP RECORDING BUTTON */}

  {recordingStatus === "recording" && (
    <button className="Interviewbuttonstop" onClick={stopRecording}>
      Stop Recording
    </button>
  )}

  {recordedVideo && (
    <Link to="/IntervieweeDashboard">
      <button className="Interviewbuttondownload" onClick={downloadVideo}>
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
              <button className="Interviewbuttonnext" onClick={handleNextQuestion}>Next</button>
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
      </Fade>
  );
};

export default InterviewSetup;

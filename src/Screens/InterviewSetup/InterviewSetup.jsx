
import React, { useState, useRef, useEffect } from "react";
import './InterviewSetup.css';
import { Link } from 'react-router-dom'
import axios from "axios";
import Fade from "react-reveal/Fade";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
const mimeType = "video/webm";


const InterviewSetup = () => {

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState(["Hello, How are you doing today?"]);
  const [permission, setPermission] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const mediaRecorder = useRef(null);
  const [stream, setStream] = useState(null);
  const liveVideoFeed = useRef(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();


  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };





  const handleNextQuestion = () => {
    uploadTranscriptToServer();
    setCurrentQuestionIndex(prevIndex => prevIndex + 1);

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

    if (!browserSupportsSpeechRecognition) {
      return null
    }

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

      SpeechRecognition.startListening({ continuous: true });
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
    // if (stream) {
    //   const media = new MediaRecorder(stream, { type: 'video/webm' });
    //   mediaRecorder.current = media;
    //   mediaRecorder.current.start();
    //   let localVideoChunks = [];

    //   mediaRecorder.current.ondataavailable = (event) => {
    //     if (typeof event.data === "undefined") return;
    //     if (event.data.size === 0) return;
    //     localVideoChunks.push(event.data);
    //   };

    //   mediaRecorder.current.onstop = () => {
    //     const videoBlob = new Blob(localVideoChunks, { type: 'video/webm' });
        
    //     // const videoUrl = URL.createObjectURL(videoBlob);
    //     // THIS IS CHANGED FOR THE SERVER.
    //     setRecordedVideo(videoBlob);
       
    //   };
    // }


    if (stream) {
      const videoMedia = new MediaRecorder(stream, { type: 'video/webm' });
      const audioMedia = new MediaRecorder(stream, { type: 'audio/wav' }); // Adjust type as needed
  
      mediaRecorder.current = { video: videoMedia, audio: audioMedia };
  
      let localVideoChunks = [];
      let localAudioChunks = [];
  
      mediaRecorder.current.video.ondataavailable = (event) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localVideoChunks.push(event.data);
      };
  
      mediaRecorder.current.audio.ondataavailable = (event) => {
          if (typeof event.data === "undefined") return;
          if (event.data.size === 0) return;
          localAudioChunks.push(event.data);
      };
  
      mediaRecorder.current.video.onstop = () => {
          const videoBlob = new Blob(localVideoChunks, { type: 'video/webm' });
          setRecordedVideo(videoBlob);
      };
  
      mediaRecorder.current.audio.onstop = () => {
          const audioBlob = new Blob(localAudioChunks, { type: 'audio/wav' }); // Adjust type as needed
          setRecordedAudio(audioBlob);
      };
  
      mediaRecorder.current.video.start();
      mediaRecorder.current.audio.start();
  }

  

  };

  

  const stopRecording = () => {
    uploadTranscriptToServer();
    SpeechRecognition.stopListening();
    setRecordingStatus("inactive");
    setShowChatbot(false);
    if (mediaRecorder.current) {
        if (mediaRecorder.current.video) {
            mediaRecorder.current.video.stop();
        }
        if (mediaRecorder.current.audio) {
            mediaRecorder.current.audio.stop();
        }
    }
    if (stream) {
        const audioTracks = stream.getAudioTracks();
        const videoTracks = stream.getVideoTracks();

        audioTracks.forEach((track) => track.stop());
        videoTracks.forEach((track) => track.stop());
        setStream(null);
    }
};

  const uploadVideoToServer = (recordedVideo) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append('video', recordedVideo, "recorded_video.webm");

    console.log('formdata', formData.get('video'))
  
    // Make a POST request to the server
    fetch('http://localhost:5001/upload', {
      method: 'POST',
      body: formData,
    })
    .then(response => {
      if (response.ok) {
        console.log('Video uploaded successfully');
        
      } else {
        console.error('Failed to upload video');
        
      }
    })
    .catch(error => {
      console.error('Error uploading video:', error);
      
    });
  };


  const uploadAudioToServer = (recordedAudio) => {
    // Create a FormData object
    const formData = new FormData();
    formData.append('audio', recordedAudio, "recorded_audio.wav");

    console.log('formdata', formData.get('audio'))

    // Make a POST request to the server
    fetch('http://localhost:5001/upload-audio', {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                console.log('Audio uploaded successfully');

            } else {
                console.error('Failed to upload audio');

            }
        })
        .catch(error => {
            console.error('Error uploading audio:', error);

        });
};


  const uploadTranscriptToServer = async () => {
    try {
      const serverUrl = 'http://localhost:5001/upload-transcript';
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain', // Set Content-Type to indicate plain text
        },
        body: transcript
      });
    
      if (response.ok) {
        // Clear the transcript
        console.log('Transcript posted successfully:', transcript);
        resetTranscript();
      } else {
        console.error('Failed to post transcript:', response.statusText);
      }
    } catch (error) {
      console.error('Error posting transcript:', error.message);
    }
  };
  

  


  const SendAudioVideo = () => {
      uploadTranscriptToServer();
      uploadVideoToServer(recordedVideo);
      uploadAudioToServer(recordedAudio);
      
  
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());  
    }
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
    <button className="Interviewbuttonstart" onClick={(e) => {startRecording(e)}}>
      Start Recording
    </button>
  )}



  {recordingStatus === "recording" && (
    <button className="Interviewbuttonstop" onClick={stopRecording}>
      Stop Recording
    </button>
  )}

  {recordedVideo && (
    <Link to="/IntervieweeDashboard">
      <button className="Interviewbuttondownload" onClick={SendAudioVideo}>
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


import React, { useState } from 'react';

function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const recognition = new window.webkitSpeechRecognition();

  recognition.onresult = function(event) {
    const currentTranscript = event.results[0][0].transcript;
    setTranscript(currentTranscript);
  }

  const startListening = () => {
    recognition.start();
    
  }

  return (
    <div>
      <h1>Speech to Text</h1>
      <button onClick={startListening}>Start Listening</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
}

export default SpeechToText;

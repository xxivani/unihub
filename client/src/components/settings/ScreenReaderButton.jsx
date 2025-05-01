import React, { useState } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import "./ScreenReaderButton.css";

const ScreenReaderButton = () => {
  const [isReading, setIsReading] = useState(false);

  const handleClick = () => {
    const textContent = document.body.innerText;

    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance(textContent);
        speech.lang = 'en-US';
        speech.volume = 0.7;
        speech.rate = 1;

        speech.onend = () => {
          setIsReading(false);
        };

        window.speechSynthesis.speak(speech);
        setIsReading(true);
      } else {
        alert("Screen Reader is not supported in your browser.");
      }
    }
  };

  return (
    <button onClick={handleClick} className="screen-reader-button">
      {isReading ? <FaVolumeMute /> : <FaVolumeUp />}
    </button>
  );
};

export default ScreenReaderButton;

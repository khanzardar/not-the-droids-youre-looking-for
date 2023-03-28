import React, { useEffect } from "react";

const AudioAnswer = ({ answer, loading }) => {
  useEffect(() => {
    if (!loading && answer) {
      const speechSynthesis = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(answer);
      speechSynthesis.speak(utterance);
    }
  }, [answer, loading]);
};

export default AudioAnswer;

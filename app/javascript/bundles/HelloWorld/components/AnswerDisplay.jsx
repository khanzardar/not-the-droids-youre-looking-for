import React from "react";
import "../styles.css";

const AnswerDisplay = ({ answer, loading }) => {
  let displayContent;

  if (loading) {
    displayContent = <span>Loading...</span>;
  } else if (answer) {
    displayContent = `Answer: ${answer}`;
  } else {
    displayContent = "Sorry, I'm unable to find a response to that question.";
  }

  return <div className="answer">{displayContent}</div>;
};

export default AnswerDisplay;

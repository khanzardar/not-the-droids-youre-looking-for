import React from "react";

const AnswerDisplay = ({ answer }) => {
  return (
    <div>
      {answer
        ? `Answer: ${answer}`
        : "Sorry, I'm unable to find a response to that question"}
    </div>
  );
};

export default AnswerDisplay;

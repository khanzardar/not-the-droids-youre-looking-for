import React, { useState } from "react";
import axios from "axios";

const QuestionInput = ({ setAnswer }) => {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const csrfToken = document.querySelector("meta[name=csrf-token]").content;
      const response = await axios.post(
        "/answers/find",
        { question },
        {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
        }
      );
      // console.log(
      //   `Response to QuestionInput from server: ${JSON.stringify(response)}`
      // );
      setAnswer(response.data.answer);
    } catch (err) {
      console.error(`There was an error fetching answer: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Ask question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default QuestionInput;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { styles } from "../new-styles.module.scss";

const QuestionInput = ({ setAnswer, setLoading, loading }) => {
  const [question, setQuestion] = useState("");
  const [submit, setSubmit] = useState(false);

  const questionsArray = [
    "What is a minimalist entrepreneur?",
    "What is your definition of community?",
    "How do I decide what kind of business I should start?",
  ];

  useEffect(() => {
    if (submit) {
      handleSubmit(new Event("submit", { cancelable: true }));
      setSubmit(false);
    }
  }, [submit]);

  const handleLucky = async () => {
    const randomIndex = Math.floor(Math.random() * questionsArray.length);
    const randomQuestion = questionsArray[randomIndex];
    setQuestion(randomQuestion);
    setSubmit(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your question here..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className={styles.inputField}
      />
      <button className={styles.button} type="submit" disabled={loading}>
        Ask question
      </button>
      <button
        className={styles.button}
        type="button"
        disabled={loading}
        onClick={handleLucky}
      >
        I'm feeling lucky
      </button>
    </form>
  );
};

export default QuestionInput;

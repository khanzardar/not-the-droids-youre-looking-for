import React, { useState } from "react";

import QuestionInput from "./components/QuestionInput";
import AnswerDisplay from "./components/AnswerDisplay";

const App = () => {
  const [answer, setAnswer] = useState("");

  return (
    <div>
      <QuestionInput setAnswer={setAnswer} />
      <AnswerDisplay answer={answer} />
    </div>
  );
};

export default App;

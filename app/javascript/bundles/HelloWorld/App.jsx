import React, { useState } from "react";

import QuestionInput from "./components/QuestionInput";
import AnswerDisplay from "./components/AnswerDisplay";
import AudioAnswer from "./components/SynthesizeSpeech";

const App = () => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <QuestionInput
        setAnswer={setAnswer}
        setLoading={setLoading}
        loading={loading}
      />
      <AnswerDisplay answer={answer} loading={loading} />
      <AudioAnswer answer={answer} loading={loading} />
    </div>
  );
};

export default App;

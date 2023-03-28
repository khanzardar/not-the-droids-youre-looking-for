import React, { useState } from "react";

import QuestionInput from "./components/QuestionInput";
import AnswerDisplay from "./components/AnswerDisplay";
import AudioAnswer from "./components/SynthesizeSpeech";

import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  alight-items: center;
  justify-content: center;
`;

const App = () => {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Container>
      <QuestionInput
        setAnswer={setAnswer}
        setLoading={setLoading}
        loading={loading}
      />
      <AnswerDisplay answer={answer} loading={loading} />
      <AudioAnswer answer={answer} loading={loading} />
    </Container>
  );
};

export default App;

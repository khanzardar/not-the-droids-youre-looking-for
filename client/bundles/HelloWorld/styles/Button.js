import styled from "styled-components";

export const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin: 10px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 4px;
  &:hover {
    background-color: #45a049;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

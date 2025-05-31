import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import Chat from "../components/Chat";

export default function Home() {
  const [initialPrompt, setInitialPrompt] = useState("");
  const [finalPrompt, setFinalPrompt] = useState(initialPrompt);

  useEffect(() => {
    if (localStorage.getItem("prompt")) {
      setInitialPrompt(localStorage.getItem("prompt"));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem("prompt", finalPrompt);
  }, [finalPrompt]);

  return (
    <div>
      <h1>Prompt</h1>
      <Chat
        initialPrompt={initialPrompt}
        setFinalPrompt={setFinalPrompt}
      ></Chat>
    </div>
  );
}

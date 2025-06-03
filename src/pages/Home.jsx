import React, { useEffect, useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [initialPrompt, setInitialPrompt] = useState("");
  const [host, setHost] = useState("http://127.0.0.1:11434");

  useEffect(() => {
    if (localStorage.getItem("prompt")) {
      setInitialPrompt(localStorage.getItem("prompt"));
    }
  }, []);

  const setFinalPrompt = (value) => {
    localStorage.setItem("prompt", value);
  };

  return (
    <div>
      <h1>Interactive LLM</h1>
      <Chat
        initialPrompt={initialPrompt}
        setFinalPrompt={setFinalPrompt}
        host={host}
      ></Chat>
      <input
        type="text"
        value={host}
        onChange={(e) => setHost(e.target.value)}
      ></input>
    </div>
  );
}

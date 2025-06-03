import React, { useEffect, useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [initialPrompt, setInitialPrompt] = useState("");

  useEffect(() => {
    if (localStorage.getItem("prompt")) {
      setInitialPrompt(localStorage.getItem("prompt"));
    }
  }, []);

  const setFinalPrompt = (value) => {
    localStorage.setItem("prompt", value);
  };

  return (
    <Chat initialPrompt={initialPrompt} setFinalPrompt={setFinalPrompt}></Chat>
  );
}

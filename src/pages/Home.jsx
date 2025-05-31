import React, { useState } from "react";
import { NavLink } from "react-router";
import Chat from "../components/Chat";

export default function Home() {
  const [finalPrompt, setFinalPrompt] = useState("");
  return (
    <div>
      <h1>Home</h1>
      <Chat
        initialPrompt="I am a small kid. "
        setFinalPrompt={setFinalPrompt}
      ></Chat>
      <br></br>
      <NavLink to={`/next?prompt=${encodeURI(finalPrompt)}`}>
        Next Level
      </NavLink>
    </div>
  );
}

import React, { useState } from "react";
import { NavLink, useSearchParams } from "react-router";
import Chat from "../components/Chat";

export default function Next() {
  // const { prompt = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams({ prompt: "" });
  const initialPrompt = decodeURI(searchParams.get("prompt"));
  const [finalPrompt, setFinalPrompt] = useState(initialPrompt);

  return (
    <div>
      <h1>Prompt</h1>
      <Chat
        initialPrompt={initialPrompt}
        setFinalPrompt={setFinalPrompt}
      ></Chat>
      <NavLink to={`/next?prompt=${encodeURI(finalPrompt)}`}>
        Next Level
      </NavLink>
    </div>
  );
}

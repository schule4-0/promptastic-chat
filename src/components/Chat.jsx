import React, { useEffect, useState } from "react";
import ollama from "ollama/browser";

// Meine Lieblingsfrage: What time is it?

export default function Chat({
  initialPrompt = "",
  setFinalPrompt = () => {},
}) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [output, setOutput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    setPrompt(initialPrompt);
  }, [initialPrompt]);

  const chat = async () => {
    setOutput("");
    try {
      const response = await ollama.chat({
        model: "qwen3:0.6b",
        messages: [{ role: "user", content: prompt }],
        stream: true,
      });
      let isThinking = false;
      setIsThinking(false);
      let isAnswering = false;
      let answer = "";
      for await (const part of response) {
        answer += part.message.content;
        if (isAnswering) setOutput((output) => output + part.message.content);
        if (isThinking == false && answer.startsWith("<think>")) {
          isThinking = true;
          setIsThinking(true);
        }
        if (isAnswering == false && answer.endsWith("</think>")) {
          isAnswering = true;
          setIsThinking(false);
          console.log("THOUGHTS: " + answer);
        }
      }
      setFinalPrompt(prompt);
    } catch (e) {
      console.error(e);
      setFinalPrompt(initialPrompt);
    }
  };

  return (
    <div>
      {isThinking && <p>thinking...</p>}
      <div>{output}</div>
      <textarea
        onChange={(e) => {
          const current = e.target.value;
          if (current.startsWith(initialPrompt)) {
            setPrompt(current);
          }
        }}
        onKeyDown={(e) => e.key === "Enter" && chat()}
        value={prompt}
        size={120}
        type="text"
      ></textarea>
      <button onClick={chat}>Send</button>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import ollama from "ollama/browser";

// Meine Lieblingsfrage: What time is it?

export default function Chat({
  initialPrompt = "",
  setFinalPrompt = () => {},
  think = false,
}) {
  const [prompt1, setPrompt1] = useState("");
  const [prompt2, setPrompt2] = useState("  ");
  const [output, setOutput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [llm, setLlm] = useState(true);

  const chat = async () => {
    setOutput("");
    const finalPrompt = `${prompt1} ${initialPrompt} ${prompt2}`;
    try {
      const response = await ollama.chat({
        model: "qwen3:0.6b",
        messages: [{ role: "user", content: finalPrompt }],
        stream: true,
        think: think,
      });
      setIsThinking(think);
      let isAnswering = !think;
      let thoughts = "";
      for await (const part of response) {
        if ("thinking" in part.message) thoughts += part.message.thinking;
        if (think && "thinking" in part.message === false) {
          setIsThinking(false);
          isAnswering = true;
        }
        if (isAnswering) setOutput((output) => output + part.message.content);
      }
      console.log(thoughts);
      setFinalPrompt(finalPrompt);
    } catch (e) {
      console.error(e);
      setLlm(false);
      setFinalPrompt(initialPrompt);
    }
  };

  // const onChange = (e) => {
  //   const current = e.target.value;
  //   if (current.startsWith(initialPrompt)) {
  //     setPrompt(current);
  //   }
  // };

  return (
    <div>
      {llm === false && (
        <div style={{ color: "red" }}>
          Can't connect to ollama on port 11434 and run qwen3:0.6b
        </div>
      )}
      {isThinking && <p>thinking...</p>}
      {}
      <div>{output}</div>
      <textarea
        onChange={(e) => setPrompt1(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && chat()}
        value={prompt1}
        size={120}
        type="text"
      ></textarea>
      {initialPrompt && (
        <>
          <div>{initialPrompt}</div>
          <textarea
            onChange={(e) => setPrompt2(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && chat()}
            value={prompt2}
            size={120}
            type="text"
          ></textarea>
        </>
      )}
      <br></br>
      <button onClick={chat}>Send</button>
    </div>
  );
}

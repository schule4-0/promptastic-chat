import React, { useEffect, useState } from "react";
import { Ollama } from "ollama/browser";

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
  const [host, setHost] = useState("http://127.0.0.1:11434");

  const chat = async () => {
    setOutput("");
    const finalPrompt = `${prompt1} ${initialPrompt} ${prompt2}`;
    try {
      const ollamaClient = new Ollama({ host });
      console.log((await ollamaClient.list()).models.map((elm) => elm.model));
      const response = await ollamaClient.chat({
        model: "qwen3:0.6b",
        messages: [{ role: "user", content: finalPrompt }],
        stream: true,
        think: think,
      });
      setLlm(true);
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
  //   } 230, 236, 251
  // };

  return (
    <div className="flex flex-col w-full h-full gap-[25px] p-[20px] bg-[#e6ecfb] rounded-[10px]">
      {llm === false && (
        <div style={{ color: "red" }}>
          Can't connect to ollama on {host} and run qwen3:0.6b
        </div>
      )}
      {isThinking && <p>thinking...</p>}
      {}
      <div className="bg-white rounded-[10px]">
        <textarea
          onChange={(e) => setPrompt1(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && chat()}
          value={prompt1}
          size={140}
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
        <button
          onClick={chat}
          className="bg-green-500 border border-black px-2"
        >
          Send
        </button>
      </div>
      <div className="grow bg-white rounded-[10px]">{output}</div>
      <details>
        <summary>Settings</summary>
        <input
          type="text"
          value={host}
          onChange={(e) => setHost(e.target.value)}
        ></input>
      </details>
    </div>
  );
}

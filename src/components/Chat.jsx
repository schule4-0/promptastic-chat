import React, { useEffect, useState } from 'react'
import { AzureOpenAI } from 'openai'

// Meine Lieblingsfrage: What time is it?

const endpoint = process.env['AZURE_OPENAI_ENDPOINT'] || 'https://promptastic.openai.azure.com/'
const deployment = process.env['DEPLOYMENT'] || 'gpt-4.1-nano'
const apiVersion = process.env['API_VERSION'] || '2025-01-01-preview'

export default function Chat({ initialPrompt = '', setFinalPrompt = () => {} }) {
  const [prompt1, setPrompt1] = useState('')
  const [prompt2, setPrompt2] = useState('  ')
  const [output, setOutput] = useState('')
  const [llm, setLlm] = useState(true)
  const [apiKey, setApiKey] = useState(process.env['AZURE_OPENAI_API_KEY'] || null)

  const chat = async () => {
    setOutput('')
    const finalPrompt = `${prompt1} ${initialPrompt} ${prompt2}`
    try {
      const client = new AzureOpenAI({
        endpoint,
        apiKey,
        apiVersion,
        deployment,
        dangerouslyAllowBrowser: true,
      })
      const result = await client.chat.completions.create({
        stream: true,
        messages: [
          {
            role: 'system',
            content:
              process.env['SYSTEM_PROMPT'] ||
              'Du bist ein KI Agent der Kindern in der Grundschule hilft, das CRAFT Framework zu verstehen, indem du die Prompts der Kinder vervollständigst.',
          },
          {
            role: 'assistant',
            content: finalPrompt,
          },
        ],
        max_tokens: 800,
        temperature: 1, // between 0 and 1. 0 is deterministic
        top_p: 1, // word diversitry
        frequency_penalty: 0, // reduce chance of repeating same text in response
        presence_penalty: 0, // increase likelihood of introducing new topics
        stop: null,
      })

      setLlm(true)
      for await (const event of result) {
        if (event.choices[0]?.delta?.content) {
          setOutput((output) => output + event.choices[0].delta.content)
        }
      }
      setFinalPrompt(finalPrompt)
    } catch (e) {
      console.error(e)
      setLlm(false)
      setFinalPrompt(initialPrompt)
    }
  }

  return (
    <div className="flex flex-col w-full h-full gap-[25px] p-[20px] bg-[#e6ecfb] rounded-[10px]">
      {llm === false && <div style={{ color: 'red' }}>Can't connect to LLM</div>}
      <div className="bg-white rounded-[10px]">
        <textarea
          onChange={(e) => setPrompt1(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && chat()}
          value={prompt1}
          type="text"
          rows={3}
          className="w-full"
        ></textarea>
        {initialPrompt && (
          <>
            <div>{initialPrompt}</div>
            <textarea
              onChange={(e) => setPrompt2(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && chat()}
              value={prompt2}
              type="text"
              rows={3}
              className="w-full"
            ></textarea>
          </>
        )}
        <br></br>
        <button onClick={chat} className="bg-green-500 border border-black px-2">
          Send
        </button>
      </div>
      <div className="grow bg-white rounded-[10px]">{output}</div>
      <details>
        <summary>Settings</summary>
        <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)}></input>
      </details>
    </div>
  )
}

import { useState } from 'react'
import { useLLMOutput } from '@llm-ui/react'
import { markdownLookBack } from '@llm-ui/markdown'
import MarkdownComponent from './MarkdownComponent'
import Input from './Input'

export default function Chat({
  initialPrompt = '',
  setFinalPrompt = () => {},
  askForPassword = () => {},
  clearPrompt = () => {},
}) {
  const [output, setOutput] = useState(localStorage.getItem('lastAnswer') || '')
  const [isStreamFinished, setIsStreamFinished] = useState(false)

  const chat = async () => {
    if (localStorage.getItem('password') == null) {
      return askForPassword()
    }

    const finalPrompt = document.getElementById('inputElement').innerText
    setIsStreamFinished(false)
    setOutput('')
    try {
      // const response = await fetch('/api/chat', {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        body: JSON.stringify({ prompt: finalPrompt }),
        headers: {
          authorization: `Bearer ${localStorage.getItem('password')}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status === 403) {
        return askForPassword()
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      let outputBuffer = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        // Process streaming chunk
        setOutput((output) => output + chunk)
        outputBuffer += chunk
      }

      setIsStreamFinished(true)
      setFinalPrompt(finalPrompt)
      localStorage.setItem('lastAnswer', outputBuffer)
    } catch (e) {
      console.error(e)
      if (e) setFinalPrompt(initialPrompt)
    }
  }

  const { blockMatches } = useLLMOutput({
    llmOutput: output,
    blocks: [],
    fallbackBlock: {
      component: MarkdownComponent, // from Step 1
      lookBack: markdownLookBack(),
    },
    isStreamFinished,
  })

  return (
    <div className="flex flex-col w-full h-full gap-[25px] p-[20px] bg-[#e6ecfb] rounded-[10px]">
      <div className="bg-white rounded-[10px] relative">
        <Input
          id="inputElement"
          initialPrompt={initialPrompt}
          clearInitialPrompt={clearPrompt}
        ></Input>
        <button
          onClick={chat}
          className="absolute right-2 bottom-2 bg-p-blue text-white font-bold hover:bg-p-blue-200 border border-black rounded-[10px] px-2 leading-6"
        >
          Senden
        </button>
      </div>
      <div className="grow bg-white rounded-[10px] prose  max-w-none overflow-y-auto">
        {blockMatches.map((blockMatch, index) => {
          const Component = blockMatch.block.component
          return <Component key={index} blockMatch={blockMatch} />
        })}
      </div>
    </div>
  )
}

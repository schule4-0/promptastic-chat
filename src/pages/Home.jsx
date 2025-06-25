import { useEffect, useState } from 'react'
import Chat from '../components/Chat'
import Modal from '../components/Modal'

export default function Home() {
  const [initialPrompt, setInitialPrompt] = useState('')
  const [modal, setModal] = useState(localStorage.getItem('password') == null)

  useEffect(() => {
    if (localStorage.getItem('prompt')) {
      setInitialPrompt(localStorage.getItem('prompt'))
    }
  }, [])

  const setFinalPrompt = (value) => {
    localStorage.setItem('prompt', value)
  }
  const clearPrompt = () => {
    localStorage.removeItem('prompt')
    setInitialPrompt('')
  }

  return (
    <>
      <Chat
        initialPrompt={initialPrompt}
        setFinalPrompt={setFinalPrompt}
        askForPassword={() => setModal(true)}
        clearPrompt={clearPrompt}
      ></Chat>
      <Modal
        openModal={modal}
        closeModal={() => setModal(false)}
        onCancel={() => setModal(false)}
        showCloseButton={false}
      >
        <div className="flex flex-col p-[20px] bg-[#e6ecfb]">
          <form
            method="dialog"
            className="bg-white rounded-[10px] relative p-10 font-bold"
            onSubmit={(event) => {
              event.preventDefault()
              for (const input of event.currentTarget.elements) {
                if (input.nodeName === 'INPUT' && input.type === 'text') {
                  localStorage.setItem('password', input.value)
                }
              }
              setModal(false)
            }}
          >
            Passwort:<br></br>
            <input
              name="password"
              size="15"
              autoFocus
              required
              type="text"
              className="border-2 font-normal"
            ></input>
            <input
              type="submit"
              className="ml-2 bg-p-blue text-white font-bold hover:bg-p-blue-200 border border-black rounded-[10px] px-2 leading-6"
              value="OK"
            ></input>
          </form>
        </div>
      </Modal>
    </>
  )
}

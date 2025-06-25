import { useEffect, useRef } from 'react'

const Input = ({ id, initialPrompt, clearInitialPrompt }) => {
  const observerRef = useRef()

  const callback = (mutationList, observer) => {
    const targetNode = document.getElementById(id)
    for (const mutation of mutationList) {
      if (mutation.type === 'childList') {
        mutation.removedNodes.forEach((removedNode) => {
          if (
            removedNode instanceof HTMLElement &&
            removedNode.classList.contains('cursor-not-allowed')
          ) {
            console.log('prevent delete')
            try {
              if (mutation.nextSibling) {
                targetNode.insertBefore(removedNode, mutation.nextSibling)
              } else {
                targetNode.appendChild(removedNode)
              }
            } catch (err) {
              console.log(err)
              targetNode.appendChild(removedNode)
            }
          }
        })
      }
    }
  }

  const observe = (targetNode) => {
    observerRef.current.observe(targetNode, { attributes: false, childList: true, subtree: false })
  }
  const stopObserving = () => {
    observerRef.current.disconnect()
  }

  useEffect(() => {
    // disable CTRL+Z because it causes an infinite loop
    document.body.onkeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key == 'z') {
        e.preventDefault()
        return false
      }
    }

    observerRef.current = new MutationObserver(callback)
    observe(document.getElementById(id))
  }, [])

  const handleKeyboardShortcut = (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'E') {
      stopObserving()
      clearInitialPrompt()
    }
  }

  return (
    <div
      id={id}
      className="h-24 overflow-y-auto"
      contentEditable="plaintext-only"
      suppressContentEditableWarning={true}
      onKeyDown={handleKeyboardShortcut}
    >
      {initialPrompt && (
        <span className="cursor-not-allowed bg-orange-100" contentEditable={false}>
          {initialPrompt}
        </span>
      )}
    </div>
  )
}

export default Input

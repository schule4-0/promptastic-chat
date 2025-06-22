import { useEffect } from 'react'

const Input = ({ id, initialPrompt }) => {
  useEffect(() => {
    // disable CTRL+Z because it causes an infinite loop
    document.body.onkeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key == 'z') {
        e.preventDefault()
        return false
      }
    }

    const targetNode = document.getElementById(id)

    const callback = (mutationList, observer) => {
      for (const mutation of mutationList) {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((removedNode) => {
            if (
              removedNode instanceof HTMLElement &&
              removedNode.classList.contains('cursor-not-allowed')
            ) {
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
    const observer = new MutationObserver(callback)

    if (targetNode)
      observer.observe(targetNode, { attributes: false, childList: true, subtree: false })
  }, [])

  return (
    <div
      id={id}
      className="h-24 overflow-y-auto"
      contentEditable="plaintext-only"
      suppressContentEditableWarning={true}
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

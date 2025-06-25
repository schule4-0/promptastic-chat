import { useEffect, useRef } from 'react'

const Modal = ({ openModal, closeModal, children, showCloseButton = true, onCancel = true }) => {
  const ref = useRef()

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal()
    } else {
      ref.current?.close()
    }
  }, [openModal])

  return (
    <dialog ref={ref} onCancel={() => onCancel && closeModal()}>
      {children}
      {showCloseButton && <button onClick={closeModal}>Close</button>}
    </dialog>
  )
}

export default Modal

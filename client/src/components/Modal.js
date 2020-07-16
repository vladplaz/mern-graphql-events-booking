import React from 'react'
import './Modal.css'

export const Modal = ({
                        title, children, canCancel, canConfirm,
                        onCancel, onConfirm, confirmText
                      }) => {
  return (
    <div className="modal">
      <header className="modal-header">
        <h1>{title}</h1>
      </header>
      <section className="modal-content">
        {children}
      </section>
      <section className="modal-actions">
        {
          canCancel &&
          <button className="btn"
                  onClick={onCancel}
          >Cancel</button>
        }
        {
          canConfirm &&
          <button className="btn"
                  onClick={onConfirm}
          >{confirmText}</button>
        }
      </section>
    </div>
  )
}

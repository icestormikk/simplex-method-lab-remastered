import { motion } from 'framer-motion'
import React, { ReactNode } from 'react'

const Modal: React.FC<React.PropsWithChildren<{
  open?: boolean,
  title?: ReactNode
  footer?: ReactNode
  cancelText?: string
  okText?: string
  onCancel?: () => void
  onOk?: () => void
}>> = props => {
  const {
    open = false,
    title,
    children,
    footer,
    cancelText = 'Cancel',
    okText = 'OK',
    onCancel,
    onOk,
  } = props
  const reference = React.useRef<HTMLDivElement>(null)

  React.useEffect(
    () => {
      const handleClickOutside = (event: MouseEvent) => {
        if (reference.current && !reference.current.contains(event.target as Node)) {
          onCancel && onCancel()
        }
      }

      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    },
    [onCancel]
  )

  return (
    open && (
      <motion.div 
        layout 
        initial={{opacity: 0.0}} 
        animate={{opacity: 1.0}}
        exit={{opacity: 0.0}} 
        className='modal'
      >
        <div className='modal-mask' />
        <div className='modal-warp'>
          <motion.div layout className='modal-content' ref={reference}>
            <div 
              className='modal-header'
            >
              <div className='modal-header-text'>{title}</div>
              <span
                className='modal-close'
                onClick={onCancel}
              >
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1" xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M557.312 513.248l265.28-263.904c12.544-12.48 12.608-32.704 0.128-45.248-12.512-12.576-32.704-12.608-45.248-0.128l-265.344 263.936-263.04-263.84C236.64 191.584 216.384 191.52 203.84 204 191.328 216.48 191.296 236.736 203.776 249.28l262.976 263.776L201.6 776.8c-12.544 12.48-12.608 32.704-0.128 45.248 6.24 6.272 14.464 9.44 22.688 9.44 8.16 0 16.32-3.104 22.56-9.312l265.216-263.808 265.44 266.24c6.24 6.272 14.432 9.408 22.656 9.408 8.192 0 16.352-3.136 22.592-9.344 12.512-12.48 12.544-32.704 0.064-45.248L557.312 513.248z" p-id="2764" fill="currentColor">
                  </path>
                </svg>
              </span>
            </div>
            <div className='modal-body'>{children}</div>
            {typeof footer !== 'undefined' ? (
              <div className='modal-footer'>
                <button onClick={onCancel}>{cancelText}</button>
                <button onClick={onOk}>{okText}</button>
              </div>
            ) : footer}
          </motion.div>
        </div>
      </motion.div>
    )
  )
}

export default Modal

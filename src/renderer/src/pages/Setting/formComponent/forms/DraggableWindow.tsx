/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'

const DraggableWindow: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null)

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y)
    })
  }
  return (
    <Draggable bounds={bounds} nodeRef={draggleRef} onStart={onStart}>
      <div
        ref={draggleRef}
        style={{
          position: 'absolute',
          top: '10%',
          borderRadius: '10px',
          left: '10%',
          width: '15%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '10px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          cursor: 'move',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {children}
      </div>
    </Draggable>
  )
}
export default DraggableWindow

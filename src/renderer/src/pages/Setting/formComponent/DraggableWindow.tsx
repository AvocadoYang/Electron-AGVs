/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import { useRef, useState } from 'react'
import type { DraggableData, DraggableEvent } from 'react-draggable'
import Draggable from 'react-draggable'
import './forms/form.css'

const DraggableWindow: React.FC<{ children: React.ReactNode; width: string; isHide: boolean }> = ({
  children,
  width,
  isHide
}) => {
  const [bounds, setBounds] = useState({ left: 0, top: 0, bottom: 0, right: 0 })
  const draggleRef = useRef<HTMLDivElement>(null)

  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const target = _event.target as HTMLElement
    if (!target) return
    // if (
    //   target.closest('span') ||
    //   target.closest('a') ||
    //   target.closest('th') ||
    //   target.closest('td') ||
    //   target.closest('svg') ||
    //   target.closest('path') ||
    //   target.closest('.ant-table-column-sorters.ant-tooltip-open')
    // ) {
    //   return
    // }
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
        className="draggable-style"
        ref={draggleRef}
        style={{
          position: 'absolute',
          top: '10%',
          borderRadius: '10px',
          left: '10%',
          width: `${width}`,
          maxHeight: '80vh',
          overflow: 'scroll',
          transform: 'translate(-50%, -50%)',
          backgroundColor: `${isHide ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0.85)'}`,
          padding: '10px',
          boxShadow: `${isHide ? '0 5px 15px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.3)'}`,
          cursor: 'move',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: `${isHide ? 'start' : 'center'}`
        }}
      >
        {children}
      </div>
    </Draggable>
  )
}
export default DraggableWindow

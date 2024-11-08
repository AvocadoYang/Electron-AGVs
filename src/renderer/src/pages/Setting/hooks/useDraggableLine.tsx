/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useEffect, RefObject } from 'react'
import { useAtom } from 'jotai'
import { tempEditAndStoredLocation } from '@renderer/utils/gloable'
import { showBlockId as ShowBlockId } from '@renderer/utils/gloable'
import { rad2Deg } from '@renderer/utils/utils'
import { FormInstance } from 'antd'
import { draggableLineInitialPoint, mouseLocation } from './hook'
import { getLocationInfoById } from '@renderer/pages/Setting/utils/utils'

const useDraggableLine = (
  mapRef: RefObject<HTMLDivElement>,
  roadPanelForm: FormInstance<unknown>,
  initPoint: draggableLineInitialPoint,
  setMouseLocation: React.Dispatch<mouseLocation | React.SetStateAction<mouseLocation>>,
  isResizing: boolean,
  setIsResizing: React.Dispatch<boolean>
) => {
  const [showBlockId, setShowBlockId] = useAtom(ShowBlockId)
  const [TempEditAndStoredLocation] = useAtom(tempEditAndStoredLocation)

  const handleMouseUp = (endId: string) => {
    if (endId === '') {
      setShowBlockId('')
      return
    }
    setIsResizing(!isResizing)
    const result = getLocationInfoById(endId, TempEditAndStoredLocation)
    roadPanelForm.setFieldValue('to', result.locationId)
  }

  const mouseMoveEvent = (e: MouseEvent) => {
    if (!isResizing) return
    const rad = Math.atan2(e.clientY - initPoint.clientY, e.clientX - initPoint.clientX)
    const deg = rad2Deg(rad)
    const width = Math.sqrt(
      (e.clientX - initPoint.clientX) ** 2 + (e.clientY - initPoint.clientY) ** 2
    )
    const newLocation = {
      deg,
      width,
      endDisplayX1: e.clientX,
      endDisplayY1: e.clientY
    }
    setMouseLocation(() => {
      return {
        ...newLocation
      }
    })
  }

  const mouseUpEvent = (e: MouseEvent) => {
    e.stopPropagation()
    if (!setShowBlockId || !setIsResizing) return
    const targetTag = (e.target as HTMLInputElement).tagName
    if (targetTag === 'IMG' && (e.target as HTMLInputElement).id === '') {
      setShowBlockId('')
      setMouseLocation({
        deg: 90,
        endDisplayX1: initPoint.clientX,
        endDisplayY1: initPoint.clientY,
        width: 0
      })
      return
    }
    if (showBlockId === (e.target as HTMLInputElement).id) {
      setShowBlockId('')
      setMouseLocation({
        deg: 90,
        endDisplayX1: initPoint.clientX,
        endDisplayY1: initPoint.clientY,
        width: 0
      })
      return
    }
    if (!handleMouseUp) return
    handleMouseUp((e.target as HTMLInputElement).id)
    setIsResizing(false)
  }

  useEffect(() => {
    if (showBlockId === '') return
    let mapPanelRefCopy: HTMLDivElement
    if (mapRef && mapRef.current) {
      mapPanelRefCopy = mapRef.current
      mapPanelRefCopy.addEventListener('mousemove', mouseMoveEvent)
      mapPanelRefCopy.addEventListener('mouseup', mouseUpEvent)
    }
    return () => {
      mapPanelRefCopy.removeEventListener('mousemove', mouseMoveEvent)
      mapPanelRefCopy.removeEventListener('mouseup', mouseUpEvent)
    }
  }, [mapRef, mouseMoveEvent, mouseUpEvent, initPoint, showBlockId])
}

export default useDraggableLine

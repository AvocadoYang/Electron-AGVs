/* eslint-disable @typescript-eslint/explicit-function-return-type */
import useMap from '@renderer/api/useMap'
import { useMemo, useEffect, RefObject } from 'react'
import { useAtom } from 'jotai'
import { tempEditLocationList } from '@renderer/utils/gloable'
import { showBlockId as ShowBlockId } from '@renderer/utils/gloable'
import { useState } from 'react'
import { rad2Deg } from '@renderer/utils/utils'
import { FormInstance } from 'antd'
import { draggableLineInitialPoint, mouseLocation } from './hook'
import { getLocationInfoById } from '@renderer/pages/Setting/utils/utils'

const useDraggableLine = (
  mapRef: RefObject<HTMLDivElement>,
  roadPanelForm: FormInstance<unknown>,
  initPoint: draggableLineInitialPoint,
  setMouseLocation: React.Dispatch<mouseLocation | React.SetStateAction<mouseLocation>>
) => {
  const { data } = useMap()
  const [showBlockId, setShowBlockId] = useAtom(ShowBlockId)
  const [editingLocList] = useAtom(tempEditLocationList)
  const [isResizing, setIsResizing] = useState(false)

  const handleMouseUp = (endId: string) => {
    if (!data) return
    if (endId === '') {
      setShowBlockId('')
      return
    }
    setIsResizing(!isResizing)
    const result = getLocationInfoById(endId, editingLocList)
    roadPanelForm.setFieldValue('to', result.locationId)
  }

  const mouseMoveEvent = () => {
    return (e: MouseEvent) => {
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
  }

  const mouseUpEvent = useMemo(() => {
    return (e: MouseEvent) => {
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
      if (!handleMouseUp) return
      handleMouseUp((e.target as HTMLInputElement).id)
      setIsResizing(false)
    }
  }, [initPoint, setIsResizing, setShowBlockId, handleMouseUp])

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

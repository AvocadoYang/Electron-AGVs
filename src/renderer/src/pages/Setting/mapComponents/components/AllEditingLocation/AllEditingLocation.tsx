/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo, useEffect, useState, useMemo, RefObject, useCallback } from 'react'
import { useAtom } from 'jotai'
import { LocationType } from '@renderer/utils/jotai'
import useMap from '@renderer/api/useMap'
import { FormInstance } from 'antd'
import { nanoid } from 'nanoid'
import { tempEditLocationList } from '@renderer/utils/gloable'
import { rad2Deg, rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { Point, DraggableLine } from './components/PointAndLine'

const AllEditingLocation: React.FC<{
  roadPanelForm: FormInstance<unknown>
  mapRef: RefObject<HTMLDivElement>
  scale: number
}> = ({ roadPanelForm, mapRef, scale }) => {
  const { data } = useMap()
  const [editingLocList] = useAtom(tempEditLocationList)
  const [isResizing, setIsResizing] = useState(false)
  const [showBlockId, setShowBlockId] = useState('')
  const [initPoint, setInitPoint] = useState({} as { clientX: number; clientY: number })

  console.log(12333)
  const [mouseLocation, setMouseLocation] = useState(
    {} as {
      deg?: number | undefined
      width?: number | undefined
      endDisplayX1?: number | undefined
      endDisplayY1?: number | undefined
    }
  )

  const getLocationInfoById = (locationId: string, locationList: Array<LocationType>) => {
    const result = locationList.filter((v) => v.locationId.toString() === locationId)
    return result[0]
  }

  const handleMouseDown = useCallback(
    (startId: string) => {
      if (!data) return
      setIsResizing(true)
      setShowBlockId(startId)
      const result = getLocationInfoById(startId, editingLocList)
      console.log(result)
      roadPanelForm.setFieldValue('x', result.locationId)
    },
    [roadPanelForm]
  )

  const handleMouseUp = useCallback(
    (endId: string) => {
      if (!data) return
      if (endId === '') {
        setShowBlockId('')
        return
      }
      setIsResizing(!isResizing)
      const result = getLocationInfoById(endId, editingLocList)

      roadPanelForm.setFieldValue('to', result.locationId)
    },
    [roadPanelForm]
  )

  const mouseMoveEvent = useMemo(() => {
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
  }, [isResizing, initPoint])

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

  if (!data) return null
  return (
    <>
      {editingLocList.map((loc) => {
        const [displayX, displayY] = rosCoord2DisplayCoord({
          x: loc.x,
          y: loc.y,
          mapHeight: data?.mapHeight,
          mapOriginX: data?.mapOriginX,
          mapOriginY: data.mapOriginY,
          mapResolution: data.mapResolution
        })
        return (
          <div
            draggable={false}
            onDragStart={(event) => {
              event.preventDefault()
            }}
            key={loc.locationId}
          >
            <Point
              id={loc.locationId.toString()}
              canRotate={loc.canRotate}
              left={displayX}
              top={displayY}
              key={nanoid()}
              onMouseDown={(e) => {
                setInitPoint({ clientX: e.clientX, clientY: e.clientY })
                handleMouseDown((e.target as HTMLInputElement).id)
              }}
            ></Point>
            <DraggableLine
              id={loc.locationId.toString()}
              left={displayX}
              top={displayY}
              scale={scale}
              deg={mouseLocation.deg}
              width={mouseLocation.width}
              showblockid={showBlockId}
              key={nanoid()}
            ></DraggableLine>
          </div>
        )
      })}
    </>
  )
}

export default memo(AllEditingLocation)

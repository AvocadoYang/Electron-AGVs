/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { memo } from 'react'
import { useAtom } from 'jotai'
import useMap from '@renderer/api/useMap'
import { nanoid } from 'nanoid'
import { tempEditLocationList, showBlockId as ShowBlockId } from '@renderer/utils/gloable'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { Point, DraggableLine } from './components/PointAndLine'
import { draggableLineInitialPoint, mouseLocation } from '@renderer/pages/Setting/hooks/hook'

const AllEditingLocation: React.FC<{
  scale: number
  setInitPoint: React.Dispatch<draggableLineInitialPoint>
  handleMouseDown: (startId: string) => void
  mouseLocation: mouseLocation
}> = ({ scale, setInitPoint, handleMouseDown, mouseLocation }) => {
  const { data } = useMap()
  const [showBlockId] = useAtom(ShowBlockId)

  const [editingLocList] = useAtom(tempEditLocationList)

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
            style={{ borderRadius: '50%'}}
          >
            <Point
              id={loc.locationId.toString()}
              canrotate={`${loc.canRotate}`}
              $left={displayX}
              $top={displayY}
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
              deg={mouseLocation.deg as number}
              width={mouseLocation.width as number}
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

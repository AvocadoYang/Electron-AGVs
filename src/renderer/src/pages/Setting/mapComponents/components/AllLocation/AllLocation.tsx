/* eslint-disable react/prop-types */
import useMap from '@renderer/api/useMap'
// import { Location } from './components'
import { nanoid } from 'nanoid'
import { memo } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { showBlockId as ShowBlockId, tooltipProp } from '@renderer/utils/gloable'
import { draggableLineInitialPoint, mouseLocation } from '@renderer/pages/Setting/hooks/hook'
import { Point, DraggableLine } from './components/PointAndLine'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { EditRoadPanelSwitch, EditZoneSwitch } from '@renderer/utils/siderGloble'

const AllLocation: React.FC<{
  scale: number
  setInitPoint: React.Dispatch<draggableLineInitialPoint>
  handleMouseDown: (startId: string) => void
  mouseLocation: mouseLocation
}> = ({ scale, setInitPoint, handleMouseDown, mouseLocation }) => {
  const openEditRoadPanel = useAtomValue(EditRoadPanelSwitch)
  const setTooltip = useSetAtom(tooltipProp)
  const { data } = useMap()
  const openEditZone = useAtomValue(EditZoneSwitch)
  const [showBlockId] = useAtom(ShowBlockId)

  const handleEnter = (locationId: string, x: number, y: number) => {
    setTooltip({
      x,
      y,
      locationId
    })
  }

  const handleLeave = () => {
    setTooltip(null)
  }

  if (!data) return
  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === 'Extra')
        .map((loc) => {
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
              key={loc.locationId}
              onDragStart={(event) => {
                event.preventDefault()
              }}
              style={{ borderRadius: '50%' }}
            >
              <Point
                id={loc.locationId.toString()}
                canrotate={`${loc.canRotate}`}
                left={displayX}
                top={displayY}
                key={nanoid()}
                onMouseEnter={() => handleEnter(loc.locationId, loc.x, loc.y)}
                onMouseLeave={() => handleLeave()}
                onMouseDown={(e) => {
                  if (!openEditRoadPanel || openEditZone) return
                  setInitPoint({ clientX: e.clientX, clientY: e.clientY })
                  handleMouseDown((e.target as HTMLInputElement).id)
                }}
              ></Point>
              <DraggableLine
                id={loc.locationId.toString()}
                left={displayX}
                top={displayY}
                scale={scale}
                openEditRoadPanel={openEditRoadPanel}
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

export default memo(AllLocation)

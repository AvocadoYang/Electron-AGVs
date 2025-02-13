import useMap from '@renderer/api/useMap'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { memo } from 'react'
import Cargo from './Cargo'
import { cargoStyle, showBlockId as ShowBlockId, tooltipProp } from '@renderer/utils/gloable'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { EditRoadPanelSwitch } from '@renderer/utils/siderGloble'
import { draggableLineInitialPoint, mouseLocation } from '../hooks/hook'
import {
  DraggableLine,
  Point
} from '../mapComponents/components/AllLocation/components/PointAndLine'
import { nanoid } from 'nanoid'
import useLoc, { LocWithoutArr } from '@renderer/api/useLoc'
import useCargoInfo from '@renderer/sockets/useCargoInfo'

const AllCargo: React.FC<{
  scale: number
  setInitPoint: React.Dispatch<draggableLineInitialPoint>
  handleMouseDown: (startId: string) => void
  mouseLocation: mouseLocation
}> = ({ scale, setInitPoint, handleMouseDown, mouseLocation }) => {
  const setTooltip = useSetAtom(tooltipProp)
  const shelfInfo = useCargoInfo()
  const { data } = useMap()
  const cStyle = useAtomValue(cargoStyle)
  const showBlockId = useAtomValue(ShowBlockId)
  const openEditRoadPanel = useAtomValue(EditRoadPanelSwitch)
  const { data: locInfo } = useLoc(undefined)
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
        .filter(({ areaType }) => areaType === '存貨區')
        .map((loc) => {
          const [displayX, displayY] = rosCoord2DisplayCoord({
            x: loc.x,
            y: loc.y,
            mapHeight: data?.mapHeight,
            mapOriginX: data?.mapOriginX,
            mapOriginY: data.mapOriginY,
            mapResolution: data.mapResolution
          })

          const info = locInfo as LocWithoutArr[]

          const translateX = info?.find((i) => i.locationId === loc.locationId)?.translateX || 0
          const translateY = info?.find((i) => i.locationId === loc.locationId)?.translateY || 0
          const rotate = info?.find((i) => i.locationId === loc.locationId)?.rotate || 270
          const LocScale = info?.find((i) => i.locationId === loc.locationId)?.scale || 1

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
                  if (!openEditRoadPanel) return
                  setInitPoint({ clientX: e.clientX, clientY: e.clientY })
                  handleMouseDown((e.target as HTMLInputElement).id)
                }}
              >
                <Cargo
                  locId={loc.locationId}
                  translateX={
                    cStyle && cStyle.locationId === loc.locationId ? cStyle.translateX : translateX
                  }
                  translateY={
                    cStyle && cStyle.locationId === loc.locationId ? cStyle.translateY : translateY
                  }
                  scale={cStyle && cStyle.locationId === loc.locationId ? cStyle.scale : LocScale}
                  rotate={cStyle && cStyle.locationId === loc.locationId ? cStyle.rotate : rotate}
                  shelfInfo={shelfInfo?.find((s) => s.areaId === loc.locationId)}
                />
              </Point>

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

export default memo(AllCargo)

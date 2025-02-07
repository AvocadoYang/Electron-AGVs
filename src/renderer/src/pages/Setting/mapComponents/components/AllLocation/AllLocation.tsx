/* eslint-disable react/prop-types */
import useMap from '@renderer/api/useMap'
// import { Location } from './components'
import { nanoid } from 'nanoid'
import { memo } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { hoverLocation, showBlockId as ShowBlockId } from '@renderer/utils/gloable'
import { draggableLineInitialPoint, mouseLocation } from '@renderer/pages/Setting/hooks/hook'
import { Point, DraggableLine } from './components/PointAndLine'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { isShowLocationTooltip } from '@renderer/utils/siderGloble'
import styled from 'styled-components'

const TooltipWrapper = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;

  &.show {
    opacity: 1;
  }
`
const AllLocation: React.FC<{
  scale: number
  setInitPoint: React.Dispatch<draggableLineInitialPoint>
  handleMouseDown: (startId: string) => void
  mouseLocation: mouseLocation
}> = ({ scale, setInitPoint, handleMouseDown, mouseLocation }) => {
  const showLocationToolTip = useAtomValue(isShowLocationTooltip)
  const [locationIdOnHover, setLocationIdOnHover] = useAtom(hoverLocation)
  const { data } = useMap()
  const [showBlockId] = useAtom(ShowBlockId)
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
              {' '}
              <Point
                id={loc.locationId.toString()}
                canrotate={`${loc.canRotate}`}
                left={displayX}
                top={displayY}
                key={nanoid()}
                onMouseEnter={() => setLocationIdOnHover(loc.locationId)}
                onMouseLeave={() => setLocationIdOnHover('')}
                onMouseDown={(e) => {
                  setInitPoint({ clientX: e.clientX, clientY: e.clientY })
                  handleMouseDown((e.target as HTMLInputElement).id)
                }}
              >
                <TooltipWrapper
                  className={
                    locationIdOnHover.toString() === loc.locationId && showLocationToolTip
                      ? 'show'
                      : ''
                  }
                  style={{ top: -25, left: 10 }}
                >
                  {' '}
                  {loc.locationId}
                </TooltipWrapper>
              </Point>
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

export default memo(AllLocation)

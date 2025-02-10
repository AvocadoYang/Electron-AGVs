import useMap from "@renderer/api/useMap";
import { hoverLocation, TempStoredLocationsForQuickEditPanel } from "@renderer/utils/gloable";
import { isShowLocationTooltip } from "@renderer/utils/siderGloble";
import { rosCoord2DisplayCoord } from "@renderer/utils/utils";
import {  useAtom, useAtomValue } from "jotai";
import { FC, memo, useEffect } from "react";
import { nanoid } from 'nanoid'
import styled from "styled-components";

const PointDiv = styled.div.attrs<{
  left: number
  top: number
  canrotate: string
  hoverLoc?: boolean
}>(({ left, top, canrotate, hoverLoc }) => ({
  style: { left, top, canrotate, hoverLoc }
}))<{
  left: number
  top: number
  canrotate: string
  hoverLoc?: boolean
}>`
  position: absolute;
  width: 5px;
  height: 5px;
  background: green;
  border-radius: 50%;
  z-index: 10;
  transition-duration: 200ms;

  border: ${(props) => (props.hoverLoc ? '5px solid orange' : 'none')};
  &:hover {
    background: green;
    scale: 1.8;
  }
`

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

export const Point = memo(PointDiv)


const TempLocations:FC = () => {
  const [tempStoredLocationsForQuickEditPanel] = useAtom(TempStoredLocationsForQuickEditPanel);
  const { data } = useMap();
  const [locationIdOnHover, setLocationIdOnHover] = useAtom(hoverLocation)
  const showLocationToolTip = useAtomValue(isShowLocationTooltip)

  useEffect(() => {
  }, [tempStoredLocationsForQuickEditPanel])

  if (!tempStoredLocationsForQuickEditPanel.length || !data) return null

  return (
    <>
      {
        tempStoredLocationsForQuickEditPanel.map((loc) => {
          const [displayX, displayY] = rosCoord2DisplayCoord({
            x: loc.x,
            y: loc.y,
            mapHeight: data?.mapHeight,
            mapOriginX: data?.mapOriginX,
            mapOriginY: data.mapOriginY,
            mapResolution: data.mapResolution
          });
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
                onMouseEnter={() => setLocationIdOnHover(loc.locationId)}
                onMouseLeave={() => setLocationIdOnHover('')}
              >
                <TooltipWrapper
                  className={
                    locationIdOnHover.toString() === (loc.locationId).toString() && showLocationToolTip
                      ? 'show'
                      : ''
                  }
                  style={{ top: -25, left: 10 }}
                >
                  {' '}
                  {loc.locationId}
                </TooltipWrapper>
              </Point>
            </div>
          )
        })
      }
    </>
  )
}


export default memo(TempLocations)

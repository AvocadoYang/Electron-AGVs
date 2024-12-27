import { FC } from 'react'
import styled from 'styled-components'
import { nanoid } from 'nanoid'
import { useAtom } from 'jotai'
import { rad2Deg, rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { hoverRoad, tempEditRoads } from '@renderer/utils/gloable'
import useMap from '@renderer/api/useMap'

type LineType = {
  angle: number
  length: number
  x1: number
  y1: number
  roadType?: 'oneWayRoad' | 'twoWayRoad'
  hoverRoad?: boolean
}

const Line = styled.div<LineType>`
  position: absolute;
  background-color: ${(props) => (props.hoverRoad ? 'red' : 'none')};
  width: length;
  z-index: 5;
  pointer-events: none;
  border: ${(props) => (props.hoverRoad ? '2px dashed red' : '2px dashed #74ff4e')};
  transform: ${(props) => `rotate(${props.angle}deg) translateY(-50%)`};
  transform-origin: top left;
  width: ${(props) => props.length}px;
  height: 1px;
  left: ${(props) => props.x1}px;
  top: ${(props) => props.y1}px;

  ::before {
    content: '';
    display: ${(props) => (props.roadType === 'oneWayRoad' ? 'block' : 'none')};
    left: 0px;
    position: absolute;
  }
  ::before {
    border-style: solid;
    border-width: 3px 3px 0 0;
    border-color: #ffd343;
    height: 7px;
    margin-top: -3.5px;
    margin-left: 50%;
    width: 7px;
    transform: rotate(45deg);
  }
`

const AllEditRoads: FC<{}> = () => {
  const { data } = useMap()
  const [hoverR] = useAtom(hoverRoad)
  const [editingRoadList] = useAtom(tempEditRoads)

  if (!data) return null

  return (
    <div draggable={false}>
      {editingRoadList.map((v) => {
        const [displayX1, displayY1] = rosCoord2DisplayCoord({
          x: v.x1,
          y: v.y1,
          mapHeight: data.mapHeight,
          mapOriginX: data.mapOriginX,
          mapOriginY: data.mapOriginY,
          mapResolution: data.mapResolution
        })
        const [displayX2, displayY2] = rosCoord2DisplayCoord({
          x: v.x2,
          y: v.y2,
          mapHeight: data.mapHeight,
          mapOriginX: data.mapOriginX,
          mapOriginY: data.mapOriginY,
          mapResolution: data.mapResolution
        })
        const angle2 = rad2Deg(Math.atan2(displayY2 - displayY1, displayX2 - displayX1))

        const length2 = Math.hypot(displayX1 - displayX2, displayY1 - displayY2)

        return (
          <Line
            key={nanoid()}
            length={length2}
            angle={angle2}
            x1={displayX1}
            y1={displayY1}
            hoverRoad={v.roadId === hoverR}
            roadType={v.roadType}
          />
        )
      })}
    </div>
  )
}

export default AllEditRoads

/* eslint-disable react/prop-types */
import { RefObject, memo } from 'react'
import '../setting.css'
import { MousePoint } from './components'
import styled from 'styled-components'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'

const Container = styled.div.attrs<{ left: number; top: number }>(({ left, top }) => ({
  style: { left, top }
}))<{ left: number; top: number }>`
  position: absolute;
  width: 5px;
  background: #0e1bd3;
  height: 5px;
  border-radius: 50%;
`

const MapView: React.FC<{
  scale: number
  mapRef: RefObject<HTMLDivElement>
  mousePointXY: { x: number; y: number }
  isMousePointStart: boolean,
  showStoredLocation: boolean
}> = ({ scale, mapRef, mousePointXY, isMousePointStart, showStoredLocation }) => {
  console.log(showStoredLocation)
  const [x1, y1] = rosCoord2DisplayCoord({
    x: -63.2114,
    y: -4.52656,
    mapResolution: 0.05,
    mapOriginX: -70.711403,
    mapOriginY: -8.826561,
    mapHeight: 608
  })

  const [x2, y2] = rosCoord2DisplayCoord({
    x: -40.6614,
    y: 9.3734,
    mapResolution: 0.05,
    mapOriginX: -70.711403,
    mapOriginY: -8.826561,
    mapHeight: 608
  })

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: '0% 0%',
        position: 'relative'
      }}
      className="map-view"
      ref={mapRef}
    >
      <img
        src="https://localhost:4000/static/images/ruifang-f2.png"
        draggable={false}
        style={{ userSelect: 'none' }}
      />
      <Container left={x1} top={y1} key={3} />
      <Container left={x2} top={y2} key={4} />
      {isMousePointStart ? (
        <MousePoint x={Number(mousePointXY.x)} y={Number(mousePointXY.y)}></MousePoint>
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(MapView)

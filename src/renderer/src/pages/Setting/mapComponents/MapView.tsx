/* eslint-disable react/prop-types */
import { RefObject, memo } from 'react'
import '../setting.css'
import { MousePoint, AllLocations, MapImage } from './components'

const MapView: React.FC<{
  scale: number
  mapRef: RefObject<HTMLDivElement>
  mousePointXY: { x: number; y: number }
  isMousePointStart: boolean
  showStoredLocation: boolean
}> = ({ scale, mapRef, mousePointXY, isMousePointStart, showStoredLocation }) => {

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
      <MapImage></MapImage>

      {showStoredLocation ? <AllLocations></AllLocations> : <></>}

      {isMousePointStart ? (
        <MousePoint x={Number(mousePointXY.x)} y={Number(mousePointXY.y)}></MousePoint>
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(MapView)

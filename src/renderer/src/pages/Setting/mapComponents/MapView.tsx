/* eslint-disable react/prop-types */
import { RefObject, memo } from 'react'
import '../setting.css'
import { MousePoint, AllLocations } from './components'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import useMap from '@renderer/api/useMap'


const MapView: React.FC<{
  scale: number
  mapRef: RefObject<HTMLDivElement>
  mousePointXY: { x: number; y: number }
  isMousePointStart: boolean
  showStoredLocation: boolean
}> = ({ scale, mapRef, mousePointXY, isMousePointStart, showStoredLocation }) => {
  const { data, isLoading, isError } = useMap()

  if (isLoading)
    return (
      <div
        style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Spin indicator={<LoadingOutlined style={{ fontSize: 55 }} spin />} />
      </div>
    )
  if (isError) return <div className="error-image"></div>
  if (!data) return <div className="error-image"></div>
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
      <img src={`${data.imageUrl}`} draggable={false} style={{ userSelect: 'none' }} />

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

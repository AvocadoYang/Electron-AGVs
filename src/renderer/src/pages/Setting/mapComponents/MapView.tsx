/* eslint-disable react/prop-types */
import '../setting.css'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
const MapView: React.FC<{ scale: number }> = ({ scale }) => {
  const [x1, y1] = rosCoord2DisplayCoord({
    x: -33.1114,
    y: 4.77344,
    mapHeight: 608,
    mapOriginX: -70.711403,
    mapOriginY: -8.826561,
    mapResolution: 0.05
  })

  const [x2, y2] = rosCoord2DisplayCoord({
    x: -25.5614,
    y: 4.92344,
    mapHeight: 608,
    mapOriginX: -70.711403,
    mapOriginY: -8.826561,
    mapResolution: 0.05
  })

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: '0% 0%',
        position: 'relative'
      }}
      className="map-view"
    >
      <img
        src="https://localhost:4000/static/images/rf_map_1.png"
        draggable={false}
        style={{ userSelect: 'none' }}
      />
      <div
        style={{
          position: 'absolute',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'black',
          left: x1,
          top: y1
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'black',
          left: x2,
          top: y2
        }}
      ></div>
    </div>
  )
}

export default MapView

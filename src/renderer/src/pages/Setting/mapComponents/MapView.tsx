/* eslint-disable react/prop-types */
import '../setting.css'
const MapView: React.FC<{ scale: number }> = ({ scale }) => {
  return (
    <div
      style={{
        width: `98%`,
        height: `98%`,
        transform: `scale(${scale})`,
        transformOrigin: '0% 0%'
      }}
      className="map-view"
    ></div>
  )
}

export default MapView

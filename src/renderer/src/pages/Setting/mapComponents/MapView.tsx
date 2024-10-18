/* eslint-disable react/prop-types */
import '../setting.css'
const MapView: React.FC<{ scale: number }> = ({ scale }) => {
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
    </div>
  )
}

export default MapView

/* eslint-disable react/prop-types */
import { RefObject, memo } from 'react'
import '../setting.css'
import { useAtom } from 'jotai'
import { sameVersion } from '@renderer/utils/gloable'
import Cookies from 'js-cookie'
import useVerityVersion from '@renderer/api/useVerityVersion'
import { MousePoint, AllLocations, MapImage } from './components'

const MapView: React.FC<{
  scale: number
  mapRef: RefObject<HTMLDivElement>
  mousePointXY: { x: number; y: number }
  isMousePointStart: boolean
  showStoredLocation: boolean
}> = ({ scale, mapRef, mousePointXY, isMousePointStart, showStoredLocation }) => {
  const { data: currentVersion } = useVerityVersion()
  const [, setSameVersion] = useAtom(sameVersion)

  if (currentVersion) {
    const defaultCookie = Cookies.get('version')

    if (defaultCookie !== undefined && defaultCookie !== currentVersion.version) {
      console.log('version not same')
      setSameVersion(false)
      Cookies.set('version', currentVersion.version) // Update the cookie before reloading
      window.location.reload() // Refresh the page
    }
    if (defaultCookie === undefined) {
      Cookies.set('version', currentVersion.version)
    }
  }

  window.addEventListener('beforeunload', () => {
    if (!currentVersion) return
    Cookies.set('version', currentVersion.version)
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
      <MapImage></MapImage>

      {showStoredLocation ? <AllLocations></AllLocations> : []}

      {isMousePointStart ? (
        <MousePoint x={Number(mousePointXY.x)} y={Number(mousePointXY.y)}></MousePoint>
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(MapView)

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/prop-types */
import { RefObject, memo, useState } from 'react'
import '../setting.css'
import { FormInstance } from 'antd'
import { useAtom } from 'jotai'
import { sameVersion } from '@renderer/utils/gloable'
import {
  StoredLocationSwitch,
  EditingLocationSwitch,
  EditLocationPanelSwitch
} from '@renderer/utils/siderGloble'
import Cookies from 'js-cookie'
import { draggableLineInitialPoint, mouseLocation } from '../hooks/hook'
import { useMousePoint, useDraggableLine } from '../hooks'
import useVerityVersion from '@renderer/api/useVerityVersion'
import { MousePoint, AllStoredLocation, MapImage, AllEditingLocation } from './components'

const MapView: React.FC<{
  scale: number
  roadPanelForm: FormInstance<unknown>
  locationPanelForm: FormInstance<unknown>
  mapRef: RefObject<HTMLDivElement>
  mapWrapRef: RefObject<HTMLDivElement>
}> = ({ scale, mapRef, locationPanelForm, roadPanelForm, mapWrapRef }) => {
  const [mousePointX, setMousePointX] = useState(-3)
  const [mousePointY, setMousePointY] = useState(-3)
  const { data: currentVersion } = useVerityVersion()
  const [initPoint, setInitPoint] = useState({} as draggableLineInitialPoint)
  const [mouseLocation, setMouseLocation] = useState({} as mouseLocation)
  const [, setSameVersion] = useAtom(sameVersion)
  const [openEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [showStoredLocation] = useAtom(StoredLocationSwitch)
  const [showEditingLocation] = useAtom(EditingLocationSwitch)

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

  useMousePoint(
    mapWrapRef,
    mapRef,
    scale,
    setMousePointX,
    setMousePointY,
    locationPanelForm,
    openEditLocationPanel
  )

  useDraggableLine(mapRef, roadPanelForm, initPoint, setMouseLocation)

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

      {showStoredLocation ? <AllStoredLocation /> : []}

      {/* {showStoredLocation ? <AllCargo /> : []} */}

      {showEditingLocation ? (
        <AllEditingLocation mapRef={mapRef} scale={scale} roadPanelForm={roadPanelForm} />
      ) : (
        []
      )}

      {openEditLocationPanel ? (
        <MousePoint x={Number(mousePointX)} y={Number(mousePointY)}></MousePoint>
      ) : (
        <></>
      )}
    </div>
  )
}

export default memo(MapView)

/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import { RefObject, memo, useState } from 'react'
import '../setting.css'
import { FormInstance } from 'antd'
import { useAtom } from 'jotai'
import {
  sameVersion,
  showBlockId as ShowBlockId,
  tempEditAndStoredLocation
} from '@renderer/utils/gloable'
import {
  StoredLocationSwitch,
  EditingLocationSwitch,
  EditLocationPanelSwitch
} from '@renderer/utils/siderGloble'
import useMap from '@renderer/api/useMap'
import Cookies from 'js-cookie'
import { draggableLineInitialPoint, mouseLocation } from '../hooks/hook'
import { useMousePoint, useDraggableLine } from '../hooks'
import { getLocationInfoById } from '@renderer/pages/Setting/utils/utils'
import useVerityVersion from '@renderer/api/useVerityVersion'
import { MousePoint, AllStoredLocation, MapImage, AllEditingLocation } from './components'

const MapView: React.FC<{
  scale: number
  roadPanelForm: FormInstance<unknown>
  locationPanelForm: FormInstance<unknown>
  mapRef: RefObject<HTMLDivElement>
  mapWrapRef: RefObject<HTMLDivElement>
}> = ({ scale, mapRef, locationPanelForm, roadPanelForm, mapWrapRef }) => {
  const { data } = useMap()
  const [mousePointX, setMousePointX] = useState(-3) // MousePoint 編輯點位小紅點
  const [mousePointY, setMousePointY] = useState(-3) // MousePoint 編輯點位小紅點
  const { data: currentVersion } = useVerityVersion()

  /** 路線拖曳相關參數 */
  const [, setShowBlockId] = useAtom(ShowBlockId)
  const [TempEditAndStoredLocation] = useAtom(tempEditAndStoredLocation)
  const [initPoint, setInitPoint] = useState({} as draggableLineInitialPoint)
  const [mouseLocation, setMouseLocation] = useState({} as mouseLocation)
  const [isResizing, setIsResizing] = useState(false)

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

  const handleMouseDown = (startId: string) => {
    if (!data) return
    setIsResizing(true)
    setShowBlockId(startId)
    const result = getLocationInfoById(startId, TempEditAndStoredLocation)
    roadPanelForm.setFieldValue('x', result.locationId)
  }

  useDraggableLine(mapRef, roadPanelForm, initPoint, setMouseLocation, isResizing, setIsResizing)

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

      {showStoredLocation ? (
        <AllStoredLocation
          scale={scale}
          setInitPoint={setInitPoint}
          handleMouseDown={handleMouseDown}
          mouseLocation={mouseLocation}
        />
      ) : (
        []
      )}

      {/* {showStoredLocation ? <AllCargo /> : []} */}

      {showEditingLocation ? (
        <AllEditingLocation
          scale={scale}
          setInitPoint={setInitPoint}
          handleMouseDown={handleMouseDown}
          mouseLocation={mouseLocation}
        />
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

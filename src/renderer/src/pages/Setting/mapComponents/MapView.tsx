/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import { RefObject, memo, useRef, useState } from 'react'
import '../setting.css'
import { FormInstance } from 'antd'
import { useAtom, useAtomValue } from 'jotai'
import { sameVersion, showBlockId as ShowBlockId } from '@renderer/utils/gloable'
import {
  EditLocationPanelSwitch,
  isShowLocation,
  isShowLocationTooltip,
  isShowRoad,
  QuickEditLocationPanelSwitch
} from '@renderer/utils/siderGloble'
import useMap from '@renderer/api/useMap'
import Cookies from 'js-cookie'
import TempLocations from './components/TempResources/TempLocations'
import { draggableLineInitialPoint, mouseLocation } from '../hooks/hook'
import { useMousePoint, useDraggableLine } from '../hooks'
import { getLocationInfoById } from '@renderer/pages/Setting/utils/utils'
import useVerityVersion from '@renderer/api/useVerityVersion'
import { MousePoint, AllLocation, MapImage } from './components'
import { LocationType } from '@renderer/utils/jotai'
import AllRoads from './components/AllRoads/AllRoads'
import AllCargo from '../AllCargo.tsx/AllCargo'
import ToolTip from '../components/ToolTip'

const MapView: React.FC<{
  scale: number
  roadPanelForm: FormInstance<unknown>
  locationPanelForm: FormInstance<unknown>
  mapRef: RefObject<HTMLDivElement>
  mapWrapRef: RefObject<HTMLDivElement>
}> = ({ scale, mapRef, locationPanelForm, roadPanelForm, mapWrapRef }) => {
  const { data } = useMap()
  const { data: currentVersion } = useVerityVersion()

  /** 路線拖曳相關參數 */
  const [, setShowBlockId] = useAtom(ShowBlockId)
  const { data: mapData } = useMap()
  const [initPoint, setInitPoint] = useState({} as draggableLineInitialPoint)
  const [mouseLocation, setMouseLocation] = useState({} as mouseLocation)
  const [isResizing, setIsResizing] = useState(false)
  /** end */

  const mapImageRef = useRef<HTMLImageElement>(null)
  const [, setSameVersion] = useAtom(sameVersion)
  const [openEditLocationPanel] = useAtom(EditLocationPanelSwitch)
  const [openQuickEditLocationPanelSwitch] = useAtom(QuickEditLocationPanelSwitch)
  const showLocationToolTip = useAtomValue(isShowLocationTooltip)
  const showLocation = useAtomValue(isShowLocation)
  const showRoad = useAtomValue(isShowRoad)

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

  useMousePoint(mapWrapRef, mapRef, mapImageRef, scale, locationPanelForm, openEditLocationPanel)

  const handleMouseDown = (startId: string) => {
    if (!data) return
    setIsResizing(true)
    setShowBlockId(startId)
    const result = getLocationInfoById(startId, mapData?.locations as LocationType[])
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
      <MapImage ref={mapImageRef} />

      {showLocation ? (
        <AllLocation
          scale={scale}
          setInitPoint={setInitPoint}
          handleMouseDown={handleMouseDown}
          mouseLocation={mouseLocation}
        />
      ) : (
        []
      )}

      {showLocation ? (
        <AllCargo
          scale={scale}
          setInitPoint={setInitPoint}
          handleMouseDown={handleMouseDown}
          mouseLocation={mouseLocation}
        />
      ) : (
        []
      )}

      {openQuickEditLocationPanelSwitch ? <TempLocations></TempLocations> : []}

      {openEditLocationPanel || openQuickEditLocationPanelSwitch ? (
        //編輯點位跟快速編輯點位時的小紅點
        <MousePoint></MousePoint>
      ) : (
        <></>
      )}

      {showRoad ? <AllRoads /> : []}

      {showLocationToolTip ? <ToolTip /> : []}
    </div>
  )
}

export default memo(MapView)

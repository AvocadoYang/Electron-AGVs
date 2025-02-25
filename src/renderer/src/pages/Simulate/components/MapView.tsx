/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import { memo } from 'react'
import { useAtomValue } from 'jotai'
import { isShowLocationTooltip, isShowRoad } from '@renderer/utils/siderGloble'
import ToolTip from '@renderer/pages/Setting/components/ToolTip'
import AllRoads from '@renderer/pages/Setting/mapComponents/components/AllRoads/AllRoads'
import { MapImage } from '@renderer/pages/Setting/mapComponents/components'

const MapView: React.FC<{
  scale: number
}> = ({ scale }) => {
  const showLocationToolTip = useAtomValue(isShowLocationTooltip)
  const showRoad = useAtomValue(isShowRoad)

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: '0% 0%',
        position: 'relative'
      }}
      className="map-view"
      draggable={false}
    >
      <MapImage />

      {showRoad ? <AllRoads /> : []}

      {showLocationToolTip ? <ToolTip /> : []}
    </div>
  )
}

export default memo(MapView)

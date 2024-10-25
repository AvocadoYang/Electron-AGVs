/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable react/prop-types */
import { Tooltip } from 'antd'
import { memo } from 'react'
import styled from 'styled-components'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { PointInfo, MapInfo } from '../locationInfo'

const Container = styled.div.attrs<{ left: number; top: number; canRotate: boolean }>(
  ({ left, top }) => ({
    style: { left, top }
  })
)<{ left: number; top: number; canRotate: boolean }>`
  position: absolute;
  width: 4.5px;
  background: #1225ce;
  background: ${(prop) => (!prop.canRotate ? '#1225ce' : '#f88f05')};
  height: 4.5px;
  z-index: 20px;
  border-radius: 50%;
`

const Location: React.FC<{ pointInfo: PointInfo; mapInfo: MapInfo }> = ({ pointInfo, mapInfo }) => {
  const [left, top] = rosCoord2DisplayCoord({
    x: pointInfo.x,
    y: pointInfo.y,
    mapHeight: mapInfo.mapHeight,
    mapOriginX: mapInfo.mapOriginX,
    mapOriginY: mapInfo.mapOriginY,
    mapResolution: mapInfo.mapResolution
  })
  return (
    <Tooltip placement="bottom" title={pointInfo.locationId}>
      <Container
        left={left}
        top={top}
        canRotate={pointInfo.canRotate}
        key={pointInfo.locationId}
        className="location-wrap"
      />
    </Tooltip>
  )
}

export default memo(Location)

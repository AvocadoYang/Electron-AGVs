import useMap from '@renderer/api/useMap'
import { Location } from './components'
import { memo } from 'react'

const AllLocation: React.FC = () => {
  const { data } = useMap()
  if (!data) return
  const { mapHeight, mapOriginX, mapOriginY, mapResolution } = data
  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === 'Extra')
        .map(({ x, y, canRotate, areaType, locationId }) => {
          return (
            <Location
              key={locationId}
              pointInfo={{ x, y, canRotate, areaType, locationId }}
              mapInfo={{ mapHeight, mapOriginX, mapOriginY, mapResolution }}
            ></Location>
          )
        })}
    </>
  )
}

export default memo(AllLocation)

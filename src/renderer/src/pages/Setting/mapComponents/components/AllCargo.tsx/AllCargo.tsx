import useMap from '@renderer/api/useMap'
import { memo } from 'react'
import AllCargoFix from './components/AllCargoFix'

const AllLocation: React.FC = () => {
  const { data } = useMap()
  if (!data) return

  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === '存貨區')
        .map(({ locationId }) => {
          return <AllCargoFix key={locationId} locId={locationId} />
        })}
    </>
  )
}

export default memo(AllLocation)

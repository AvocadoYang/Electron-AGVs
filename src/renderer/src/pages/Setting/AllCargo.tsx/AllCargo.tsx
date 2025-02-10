import useMap from '@renderer/api/useMap'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import { FC } from 'react'
import Cargo from './Cargo'
import styled from 'styled-components'

const Container = styled.div.attrs<{
  left: number
  top: number
  display: string
}>(({ left, top, display }) => ({ style: { left, top, display } }))<{
  left: number
  top: number
  display: string
}>`
  position: absolute;
  width: 3px;
  background: #3bbdc1;
  height: 3px;
  border-radius: 50%;
`

const AllCargo: FC = () => {
  const { data } = useMap()
  console.log(data)
  if (!data) return []
  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === '存貨區')
        .map((loc) => {
          console.log(loc.locationId)
          const [left, top] = rosCoord2DisplayCoord({
            x: loc.x,
            y: loc.y,
            mapHeight: data?.mapHeight,
            mapOriginX: data?.mapOriginX,
            mapOriginY: data.mapOriginY,
            mapResolution: data.mapResolution
          })
          return (
            <Container display={'block'} left={left} top={top} key={loc.locationId}>
              <Cargo locId={loc.locationId} />
            </Container>
          )
        })}
    </>
  )
}

export default AllCargo

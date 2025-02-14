import { cargoStyle, shelfSelectedStyleLocationId } from '@renderer/utils/gloable'
import { useAtomValue } from 'jotai'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { rosCoord2DisplayCoord } from '@renderer/utils/utils'
import useMap from '@renderer/api/useMap'
import useShelf from '@renderer/api/useShelf'

const PointDiv = styled.div.attrs<{
  left: number
  top: number
  canrotate: string
}>(({ left, top, canrotate }) => ({
  style: { left, top, canrotate }
}))<{
  left: number
  top: number
  canrotate: string
}>`
  position: absolute;
  width: ${(props) => (props.canrotate === 'true' ? '6.5px' : '5px')};
  height: ${(props) => (props.canrotate === 'true' ? '6.5px' : '5px')};
  background: ${(props) => (props.canrotate === 'true' ? '#f27ef4' : '#1b00ce')};
  border-radius: ${(props) => (props.canrotate === 'true' ? 0 : '50%')};
  z-index: 10;
  transition-duration: 200ms;
`
export const Point = memo(PointDiv)

const Wrapper = styled.div<{
  translatex: number
  translatey: number
  rotate: number
  scale: number
}>`
  position: relative;
  z-index: 1;
  border-radius: 3px;
  display: flex;
  gap: 0.2px;
  flex-direction: row;
  border-radius: 1px;
  transform: ${(props) =>
    `translate(${props.translatex}em, ${props.translatey}em) scale(${props.scale}) rotate(${props.rotate}deg)`};
`

const Block = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: 'auto';
  cursor: 'pointer';
  border: 2px dashed #fd2200;

  position: relative;
  flex-grow: 1;
  transition: transform 0.2s;

  :after {
    width: 98%;
    height: 98%;
    position: absolute;
    background-color: #717171;
    text-align: center;
  }
`

const BlockSpan = styled.span`
  text-align: center;
  user-select: none;
  -webkit-user-select: none;

  min-width: 10px;
  min-height: 10px;
  height: max-content;
  width: max-content;
  margin: 0;
  font-size: 0.6em;
  /* font-weight: bolder; */
  display: inline-block;
  display: inline-block;
  white-space: break-spaces;
  height: 100%;
  text-align: center;
  margin: 0px;

  -webkit-text-stroke-width: 0.1px;
  -webkit-text-stroke-color: #ff0000;
`

const SudoCargo: FC = () => {
  const cStyle = useAtomValue(cargoStyle)
  const { data } = useMap()
  const shelfSelectedStyleId = useAtomValue(shelfSelectedStyleLocationId)
  const { data: shelf } = useShelf()
  if (!cStyle || !data) return

  const currentShelf =
    shelf?.find((v) => v.Loc.locationId === shelfSelectedStyleId)?.ShelfConfig.length || 1

  const [displayX, displayY] = rosCoord2DisplayCoord({
    x: data?.locations.find((v) => v.locationId === shelfSelectedStyleId)?.x || 0,
    y: data?.locations.find((v) => v.locationId === shelfSelectedStyleId)?.y || 0,
    mapHeight: data?.mapHeight,
    mapOriginX: data?.mapOriginX,
    mapOriginY: data.mapOriginY,
    mapResolution: data.mapResolution
  })

  return (
    <Point canrotate="false" left={displayX} top={displayY}>
      <Wrapper
        translatex={cStyle.translateX}
        translatey={cStyle.translateY}
        scale={cStyle.scale}
        rotate={cStyle.rotate}
      >
        {Array.from({ length: currentShelf }, (_, i) => (
          <Block key={i}>
            <BlockSpan></BlockSpan>
          </Block>
        ))}
      </Wrapper>
    </Point>
  )
}

export default SudoCargo

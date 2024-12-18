/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FC, memo } from 'react'
import styled from 'styled-components'
import useMap from '@renderer/api/useMap'

const Container = styled.div.attrs<{ left: number; top: number }>(({ left, top }) => ({
  style: { left, top }
}))<{ left: number; top: number }>`
  position: absolute;
`

const Circle = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  border: 3px solid;
  border-radius: 5px;
  border-color: red;
  background-color: red;
  transform: translate(-50%, -50%);
`

const Point: FC<{
  x: number
  y: number
}> = ({ x, y }) => {
  const { data } = useMap()
  if (!data) return null
  return (
    <Container left={x} top={y}>
      <Circle />
    </Container>
  )
}

export default memo(Point)

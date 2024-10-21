/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { FC } from 'react'
import styled from 'styled-components'
import { useAtom } from 'jotai';
import { startMousePoint } from '@renderer/utils/gloable'

const Container = styled.div.attrs<{ left: number; top: number }>(({ left, top }) => ({
  style: { left, top }
}))<{ left: number; top: number }>`
  position: absolute;
`

type IsDisplay = {
  show: boolean
}

const Circle = styled.div<IsDisplay>`
  position: absolute;
  display: ${(prop) => (prop.show ? 'block' : 'none')};
  width: 8px;
  height: 8px;
  border: 3px solid;
  border-radius: 5px;
  border-color: red;
  background-color: red;
  transform: translate(-50%, -50%);
  cursor: crosshair;
`

const Point: FC<{
  x: number
  y: number
}> = ({ x, y }) => {
  const [isMousePointStart] = useAtom(startMousePoint);

  console.log(isMousePointStart, '@@@@')
  return (
    <Container left={x} top={y}>
      <Circle show={isMousePointStart} />
    </Container>
  )
}

export default Point

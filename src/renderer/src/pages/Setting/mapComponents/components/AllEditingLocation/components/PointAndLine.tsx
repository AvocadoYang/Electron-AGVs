/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components'
import { memo } from 'react'

const PointDiv = styled.div.attrs<{
  left: number
  top: number
  canRotate: boolean
  hoverLoc?: boolean
}>(({ left, top, canRotate, hoverLoc }) => ({
  style: { left, top, canRotate, hoverLoc }
}))<{
  left: number
  top: number
  canRotate: boolean
  hoverLoc?: boolean
}>`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 20px;
  z-index: 10;
  transition-duration: 200ms;

  background: ${(props) => (props.canRotate ? '#f27ef4' : '#1b00ce')};
  border: ${(props) => (props.hoverLoc ? '5px solid #ff0000' : 'none')};
  &:hover {
    background: red;
    scale: 1.8;
  }
`

export const Point = memo(PointDiv)

const DraggableLineDiv = styled.div.attrs<{
  left: number
  top: number
  deg: number
  width: number
  scale?: number
  showblockId?: string
}>(({ left, top }) => ({ style: { left, top } }))<{
  left: number
  top: number
  deg: number | undefined
  width: number | undefined
  scale?: number
  showblockid?: string
}>`
  display: ${(props) => (props.showblockid === props.id ? 'block' : 'none')};
  position: absolute;
  background-color: black;
  width: ${(props) => (props.width ? props.width / (props.scale as number) : 5)}px;
  // width: 15px;
  height: 3px; /* 初始高度 */
  transform-origin: 0 50%;
  transform: rotate(${(props) => (props.deg ? props.deg : 0)}deg);
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    right: 3px;
    bottom: -2.65px;
    transform: rotate(-45deg);
    pointer-events: none;
  }
`


export const DraggableLine = memo(DraggableLineDiv)

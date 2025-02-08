/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components'
import { memo } from 'react'

const PointDiv = styled.div.attrs<{
  left: number
  top: number
  canrotate: string
  hoverLoc?: boolean
}>(({ left, top, canrotate, hoverLoc }) => ({
  style: { left, top, canrotate, hoverLoc }
}))<{
  left: number
  top: number
  canrotate: string
  hoverLoc?: boolean
}>`
  position: absolute;
  width: ${(props) => (props.canrotate === 'true' ? '6.5px' : '5px')};
  height: ${(props) => (props.canrotate === 'true' ? '6.5px' : '5px')};
  background: ${(props) => (props.canrotate === 'true' ? '#f27ef4' : '#1b00ce')};
  border-radius: ${(props) => (props.canrotate === 'true' ? 0 : '50%')};
  z-index: 10;
  transition-duration: 200ms;

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
  showblockid?: string
}>(({ left, top, deg, width, scale }) => ({
  style: {
    left,
    top,
    transform: `rotate(${deg || 0}deg)`,
    width: width ? width / (scale || 1) : 5
  }
}))`
  display: ${(props) => (props.showblockid === props.id ? 'block' : 'none')};
  position: absolute;
  background-color: black;
  height: 3px;
  transform-origin: 0 50%;
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

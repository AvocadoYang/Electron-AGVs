import { FC } from 'react'
import styled, { keyframes } from 'styled-components'
import { HasCargo } from './types'
import { Tooltip } from 'antd'

const blueWhiteAnimation = keyframes`
  0% {
    background-color: #499EEA;
  }
  50% {
    background-color: #DDEEFE;
  }
  100% {
    background-color: #499EEA;
  }
`

const Block = styled.div<HasCargo>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ hasCargo }) => (hasCargo ? '#ffe73c73' : '#f5f5f538')};
  opacity: ${({ clickable }) => (clickable ? 1 : 0.2)};
  pointer-events: ${({ clickable }) => (clickable ? 'auto' : 'none')};
  cursor: ${({ clickable }) => (clickable ? 'pointer' : 'not-allowed')};
  border: ${({ border }) => `2px dashed ${border}`};

  position: relative;
  flex-grow: 1;
  transition: transform 0.2s;

  &:hover {
    transform: ${({ clickable }) => (clickable ? 'scale(1.05)' : 'scale(1)')};
  }
  animation-name: ${({ isOccupy }) => (isOccupy ? blueWhiteAnimation : 'none')};
  animation-duration: ${({ isOccupy }) => (isOccupy ? '0.8s' : '0s')};
  animation-iteration-count: ${({ isOccupy }) => (isOccupy ? 'infinite' : '0')};
  :after {
    content: ${({ isDisable }) => (isDisable ? '"X"' : 'none')};
    width: 98%;
    height: 98%;
    position: absolute;
    background-color: #717171;
    text-align: center;
  }
`

const BlockSpan = styled.span<{ rotate: number; hasCargo: boolean }>`
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
  transform: ${({ rotate }) => `rotate(${-rotate}deg) translateY(1px)`};
  display: inline-block;
  white-space: break-spaces;
  color: ${({ hasCargo }) => (hasCargo ? '#000000fff' : 'black')};
  height: 100%;
  text-align: center;
  margin: 0px;

  -webkit-text-stroke-width: 0.1px;
  -webkit-text-stroke-color: black;
`

const CargoDisplay: FC<{
  level: number
  levelName: string
  cargoValue: boolean
  isDisable: boolean
  isOccupy: boolean
  border: string
  locId: string
  rotate: number
  canClick: boolean
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>, locId: string, level: number) => void
}> = ({
  level,
  levelName,
  cargoValue,
  isDisable,
  isOccupy,
  border,
  locId,
  rotate,
  canClick,
  handleMouseDown
}) => {
  return (
    <Block
      key={level}
      hasCargo={cargoValue}
      isDisable={isDisable}
      isOccupy={isOccupy}
      border={border}
      clickable={canClick}
      onMouseDown={(e) => handleMouseDown(e, locId, level)}
    >
      <Tooltip placement="bottom" title={levelName}>
        <BlockSpan hasCargo={cargoValue} rotate={rotate}>
          {levelName}
        </BlockSpan>
      </Tooltip>
    </Block>
  )
}

export default CargoDisplay

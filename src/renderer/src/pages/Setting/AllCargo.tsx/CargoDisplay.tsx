import { FC } from 'react'
import styled from 'styled-components'
import { HasCargo } from './types'

const Block = styled.div<HasCargo>`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ has_cargo }) => (has_cargo ? '#ffe73c73' : '#f5f5f538')};
  pointer-events: 'auto';
  cursor: 'pointer';
  border: ${({ border }) => `2px dashed ${border}`};

  position: relative;
  flex-grow: 1;
  transition: transform 0.2s;

  :after {
    content: ${({ is_disable }) => (is_disable ? '"X"' : 'none')};
    width: 98%;
    height: 98%;
    position: absolute;
    background-color: #717171;
    text-align: center;
  }
`

const BlockSpan = styled.span<{ rotate: number; has_cargo: boolean }>`
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
  color: ${({ has_cargo }) => (has_cargo ? '#000000fff' : 'black')};
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
  border: string
  locId: string
  rotate: number
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>, locId: string, level: number) => void
}> = ({ level, levelName, cargoValue, isDisable, border, locId, rotate, handleMouseDown }) => {
  return (
    <Block
      key={level}
      has_cargo={cargoValue}
      is_disable={isDisable}
      border={border}
      onMouseDown={(e) => handleMouseDown(e, locId, level)}
    >
      <BlockSpan has_cargo={cargoValue} rotate={rotate} id={locId}>
        {levelName}
      </BlockSpan>
    </Block>
  )
}

export default CargoDisplay

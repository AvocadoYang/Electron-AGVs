/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components'

export const InfoWrap = styled.div.attrs<{
  randomColor: 'string'
  isStop: 'boolean'
}>((props) => {
  return { randomColor: props.randomColor, isStop: props.isStop }
})<{ randomColor: string; isStop: boolean }>`
  margin-bottom: 3%;
  margin-top: 6%;
  z-index: 2;
  /* overflow: hidden; */
  display: flex;
  border-radius: 4px;
  border: ${(props) => `0.15vw solid ${props.randomColor}`};
  width: 90%;
  border-right: ${(props) => `0.35vw solid ${props.randomColor}`};
  background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
  padding: 5px;
  cursor: pointer;
  position: relative;
  opacity: ${(props) => (props.isStop ? '0.3' : '1')};
`

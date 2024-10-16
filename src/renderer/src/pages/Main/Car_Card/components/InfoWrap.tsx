/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components'

export const InfoWrap = styled.div.attrs<{
  randomcolor: string
  isstop: boolean
}>((props) => {
  return { randomcolor: props.randomcolor, isstop: props.isstop }
})<{ randomcolor: string; isstop: boolean }>`
  margin-bottom: 3%;
  margin-top: 6%;
  z-index: 2;
  /* overflow: hidden; */
  border-radius: 4px;
  border: ${(props) => `0.1vw solid ${props.randomcolor}`};
  width: 90%;
  border-right: ${(props) => `0.35vw solid ${props.randomcolor}`};
  background-image: linear-gradient(to top, #dfe9f3 0%, white 100%);
  box-shadow: 2px 3px 3px rgba(0, 0, 0, 0.3);
  padding: 5px;
  cursor: pointer;
  position: relative;
  opacity: ${(props) => (props.isstop ? '0.3' : '1')};
`

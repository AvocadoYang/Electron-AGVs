import styled from 'styled-components';

export const InfoWrap = styled.div.attrs<{
  randomcolor: string;
}>((props) => {
  return { randomcolor: props.randomcolor };
})<{ randomcolor: string }>`
  margin-top: 6%;
  z-index: 2;
  border-radius: 5px;
  border: ${(props) => `0.15vw solid ${props.randomcolor}`};
  min-width: 215px;
  max-width: 235px;
  border-top: ${(props) => `0.45vw solid ${props.randomcolor}`};
  background-color: #ffffff;
  cursor: pointer;
`;

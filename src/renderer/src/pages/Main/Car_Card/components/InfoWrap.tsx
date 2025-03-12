import styled from 'styled-components';

export const InfoWrap = styled.div.attrs<{
  randomcolor: string;
  is_dark: string;
}>((props) => {
  return { randomcolor: props.randomcolor, is_dark: props.is_dark };
})<{ randomcolor: string }>`
  margin-top: 1%;
  z-index: 2;
  border-radius: 5px;
  position: relative;
  border: ${(props) => `0.15vw solid ${props.randomcolor}`};
  min-width: 200px;
  max-width: 220px;
  border-top: ${(props) => `0.45vw solid ${props.randomcolor}`};
  background-color: ${(props) => `${props.is_dark === 'true' ? '#3a3939' : '#ffffff'}`};
  // #262626
  cursor: pointer;
`;

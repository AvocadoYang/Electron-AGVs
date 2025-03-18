import styled from 'styled-components';

export const Car = styled.div.attrs<{ color: string }>(() => ({}))<{
  color: string;
}>`
  height: 3px;
  width: 3px;
  opacity: 0.5;
  background-color: ${(prop) => prop.color};
  transform-origin: 0% 50%;
  transform: scale(11, 7.8);
  /* transform: scale(11, 7.9); */
  position: relative;
  border-radius: 0.1px 0.5px 0.5px 0.1px;
`;

export const Wrapper = styled.div.attrs<{
  left: number;
  top: number;
  yaw: number;
}>(({ left, top }) => ({
  style: { left: `${left}px`, top: `${top}px` },
  draggable: true
}))<{
  left: number;
  top: number;
  yaw: number;
}>`
  z-index: 11;
  position: absolute;
  transform: ${(prop) => {
    return `rotate(${-prop.yaw}deg)`;
  }};
  /* transform-origin: 0% 50%; */
`;

export const Fork = styled.div<{
  direct: 'left' | 'right';
}>`
  position: absolute;
  height: 3px;
  width: 3px;
  left: -13px;
  top: ${(prop) => `${prop.direct === 'left' ? '-6px' : '6px'}`};
  background-color: #ff0000;
  border-radius: 1px 0 0 1px;
  transform-origin: 50% 50%;
  background-color: gray;
  opacity: 0.8;
  transform: scale(8, 2.5);
`;

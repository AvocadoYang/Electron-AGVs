import { FC } from 'react';
import useMap from '@renderer/api/useMap';
import Icon from './Icon';
import { MD5 } from 'crypto-js';
import { hsl } from 'color-convert';
const amrId2Color = (amrId: string) => {
  const seed = parseInt(`0x${MD5(amrId).toString()}`, 16);
  const h = seed % 360;
  const s = (seed % 70) + 80;
  const l = (seed % 60) + 10;
  const color = `#${hsl.hex([h, s, l])}`;
  return color;
};
const AMR: FC<{
  amrId: string;
}> = ({ amrId }) => {
  const { data: map } = useMap();
  const color = amrId2Color(amrId);
  if (!map) return null;

  // 會一直被渲染是正常的 不要包memo
  return <Icon amrId={amrId} color={color}></Icon>;
};
export default AMR;

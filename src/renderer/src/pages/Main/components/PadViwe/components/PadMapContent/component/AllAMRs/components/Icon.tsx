import { FC, memo } from 'react';
import styled from 'styled-components';
import { AGV_HEIGHT, AGV_WIDTH, AMR_FORK_HEIGHT, AMR_FORK_WIDTH } from '@renderer/configs/config';
import { ArrowDownOutlined } from '@ant-design/icons';
import useMap from '@renderer/api/useMap';
import { Spin } from 'antd';
import '../style.css';
import { useAmrPose } from '@renderer/sockets/useAMRInfo';
import { rosCoord2DisplayCoord } from '@renderer/utils/utils';
import { useAtomValue, useSetAtom } from 'jotai';
import { AmrFilterCarCard, hintAmr } from '@renderer/utils/gloable';

const ColorAmr = styled.div.attrs<{
  width: number;
  height: number;
  color: string;
  left: number;
  top: number;
  isAgv: boolean;
  rotate: number;
}>(({ left, top, isAgv, rotate }) => ({
  style: {
    left,
    top,
    transform: `${isAgv ? `rotate(${rotate}deg)` : `translate(15%, -40%) rotate(${rotate}deg)`}`,
    transition: 'x 1s, y 1s'
  }
}))<{
  width: number;
  height: number;
  color: string;
  isAgv: boolean;
  left: number;
  top: number;
  rotate: number;
}>`
  width: ${(prop) => (prop.isAgv ? prop.width - 5 : prop.width - 14)}px;
  height: ${(prop) => (prop.isAgv ? prop.height : prop.height - 23)}px;
  /* transition: all 0.8s ease-out; */
  cursor: pointer;
  position: absolute;
  z-index: 200000;
  background-color: ${(prop) => prop.color};
  transform-origin: x y;
  border-radius: 2px;
`;

const Tip = styled.div.attrs<{
  left: number;
  top: number;
}>(({ left, top }) => ({
  style: {
    // transform: `translate(15%, -40%) `,
    left: `${left + 2}px`,
    top: `${top - 22}px`,
    transition: 'x 1s, y 1s'
  }
}))<{
  left: number;
  top: number;
}>`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: -150%;
  left: -200%;
`;

const Fork = styled.div<{
  direct: string;
}>`
  height: 55%;
  width: 15%;
  background-color: #424141;
  border-radius: 0px 0px 1px 1px;

  position: absolute;
  left: ${(prop) => (prop.direct === 'left' ? '20%' : '65%')};
  bottom: -53%;
`;

const agvFormate = (x1: number, y1: number) => {
  const theta = (3 * Math.PI) / 2;
  const x = x1 * Math.cos(theta) - y1 * Math.sin(theta);
  const y = x1 * Math.sin(theta) + y1 * Math.cos(theta);

  return { x, y };
};

// 此component 不該一直被render
// 所以把rotate的css屬性移動制上層
const Icon: FC<{
  amrId: string;
  color: string;
}> = ({ amrId, color }) => {
  const { data: map } = useMap();
  const hintAmrId = useAtomValue(hintAmr);
  const setAmrFilterCarCard = useSetAtom(AmrFilterCarCard);

  const { pose } = useAmrPose(amrId);

  if (!pose || !map) return null;

  const { x: newX, y: newY } = agvFormate(pose.x, pose.y);
  const [left, top] = rosCoord2DisplayCoord({
    x: amrId.includes('SW15') ? newX + 3.5 : pose.x,
    y: amrId.includes('SW15') ? newY + 0.4 : pose.y,
    mapResolution: map.mapResolution,
    mapOriginX: map.mapOriginX,
    mapOriginY: map.mapOriginY,
    mapHeight: map.mapHeight
  });

  if (!map) return <Spin />;
  return (
    <>
      {hintAmrId === amrId ? (
        <Tip left={left} top={top}>
          <ArrowDownOutlined className="hint-icon" />
        </Tip>
      ) : (
        []
      )}
      <ColorAmr
        onClick={() => {
          setAmrFilterCarCard(amrId);
        }}
        width={
          amrId.includes('SW15')
            ? AGV_WIDTH / map.mapResolution
            : AMR_FORK_WIDTH / map.mapResolution
        }
        height={
          amrId.includes('SW15')
            ? AGV_HEIGHT / map.mapResolution
            : AMR_FORK_HEIGHT / map.mapResolution
        }
        left={left}
        top={top}
        color={color}
        rotate={amrId.includes('SW15') ? 90 - pose.yaw + 180 : 90 - pose.yaw}
        isAgv={amrId.includes('SW15')}
      >
        {amrId.includes('anfa') ? <Fork direct="left"></Fork> : null}
        {amrId.includes('anfa') ? <Fork direct="right"></Fork> : null}
      </ColorAmr>
    </>
  );
};

export default memo(Icon);

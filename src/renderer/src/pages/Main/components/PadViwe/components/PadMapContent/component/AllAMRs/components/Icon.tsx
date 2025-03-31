import { FC, memo, useMemo } from 'react';
import styled from 'styled-components';
import { AGV_HEIGHT, AGV_WIDTH, AMR_FORK_HEIGHT, AMR_FORK_WIDTH } from '@renderer/configs/config';
import useMap from '@renderer/api/useMap';

import { useAtom } from 'jotai';
import { AmrFilterCarCard } from '@renderer/utils/gloable';
import { useAmrPose } from '@renderer/sockets/useAMRInfo';

const ColorAmr = styled.div.attrs<{
  width: number;
  height: number;
  color: string;
  left: number;
  top: number;
  is_agv: string;
  rotate: number;
}>(({ left, top, is_agv, rotate, width, height }) => ({
  style: {
    width: `${is_agv === 'true' ? width - 5 : width - 14}px`,
    height: `${is_agv === 'true' ? height : height - 23}px`,
    left,
    top,
    transform: `${is_agv === 'true' ? `rotate(${rotate}deg)` : `translate(-40%, -50%) rotate(${rotate}deg) `}`,
    transition: 'x 1s, y 1s'
  }
}))<{
  width: number;
  height: number;
  color: string;
  is_agv: string;
  left: number;
  top: number;
  rotate: number;
}>`
  width: ${(prop) => (prop.is_agv === 'true' ? prop.width - 5 : prop.width - 14)}px;
  height: ${(prop) => (prop.is_agv === 'true' ? prop.height : prop.height - 23)}px;
  /* transition: all 0.8s ease-out; */
  cursor: pointer;
  position: absolute;
  z-index: 200000;
  background-color: ${(prop) => prop.color};
  transform-origin: x y;
  border-radius: 2px;
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

// 此component 不該一直被render
// 所以把rotate的css屬性移動制上層
const Icon: FC<{
  amrId: string;
  color: string;
  left: number;
  top: number;
}> = ({ amrId, color, left, top }) => {
  const { data: map } = useMap();
  const { pose } = useAmrPose(amrId);
  const [amrFilterCarCard, setAmrFilterCarCard] = useAtom(AmrFilterCarCard);
  const needOpacity = useMemo(() => {
    if (!amrFilterCarCard.size) {
      return false;
    }
    return amrFilterCarCard.has(amrId) ? false : true;
  }, [amrFilterCarCard]);

  if (!map || !pose) return null;
  return (
    <>
      <ColorAmr
        className={`${needOpacity ? 'opacity-icon' : ''}`}
        onClick={() => {
          setAmrFilterCarCard((pre) => {
            if (pre.has(amrId)) {
              pre.delete(amrId);
              return new Set([...pre]);
            } else {
              pre.add(amrId);
              return new Set([...pre]);
            }
          });
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
        is_agv={amrId.includes('SW15').toString()}
      >
        {amrId.includes('anfa') ? <Fork direct="left"></Fork> : null}
        {amrId.includes('anfa') ? <Fork direct="right"></Fork> : null}
      </ColorAmr>
    </>
  );
};

export default memo(Icon);

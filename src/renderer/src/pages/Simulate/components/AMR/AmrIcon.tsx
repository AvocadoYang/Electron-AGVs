import { FC, memo } from 'react';
import styled from 'styled-components';
import { Spin, Tooltip } from 'antd';
import useMap from '@renderer/api/useMap';

const AMR_FORK_WIDTH = 1.4; // meter
const AMR_FORK_HEIGHT = 2; // meter
const AGV_WIDTH = 1.2; // meter
const AGV_HEIGHT = 1; // meter

const ColorAmr = styled.div<{
  width: number;
  height: number;
  color: string;
  $is_agv: boolean;
}>`
  width: 1.2em;
  min-height: 1.5em;
  display: flex;
  border: ${(prop) => (prop.$is_agv ? '1px solid gray' : 'none')};
  justify-content: ${(prop) => (prop.$is_agv ? 'space-evenly' : 'space-around')};
  position: relative;
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

const AmrIcon: FC<{
  amrId: string;
  color: string;
}> = ({ amrId, color }) => {
  const { data: map } = useMap();

  if (!map) return <Spin />;
  return (
    <Tooltip title={amrId} placement="right">
      <ColorAmr
        draggable
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
        color={color}
        $is_agv={amrId.includes('SW15')}
      >
        {amrId.includes('anfa') ? <Fork direct="left"></Fork> : null}
        {amrId.includes('anfa') ? <Fork direct="right"></Fork> : null}
      </ColorAmr>
    </Tooltip>
  );
};

export default memo(AmrIcon, (prev, next) => prev.color == next.color);

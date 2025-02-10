import { Tooltip } from 'antd';
import { useAtom } from 'jotai';
import { FC } from 'react';
import styled from 'styled-components';
import useMap from '~/api/useMap';
import { fastShelve, fastShelveRoad } from '~/configs/globalState';
import { rad2Deg, rosCoord2DisplayCoord } from '~/helpers';

const Container = styled.div.attrs<{
  left: number;
  top: number;
  canRotate: boolean;
}>(({ left, top, canRotate }) => ({
  style: { left, top, canRotate },
}))<{
  left: number;
  top: number;
  canRotate: boolean;
}>`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 20px;
  z-index: 10;
  transition-duration: 200ms;

  background: ${(props) => (props.canRotate ? '#f27ef4' : '#9b00ce')};
  &:hover {
    background: red;
    scale: 1.8;
  }
`;

type LineType = {
  angle: number;
  length: number;
  x1: number;
  y1: number;
  roadType?: 'oneWayRoad' | 'twoWayRoad';
  hoverRoad?: boolean;
};

const EditLine = styled.div<LineType>`
  position: absolute;
  width: length;
  z-index: 5;
  pointer-events: none;
  border: 2px dashed #ffa74e;

  transform: ${(props) => `rotate(${props.angle}deg) translateY(-50%)`};
  transform-origin: top left;
  width: ${(props) => props.length}px;
  height: 1px;
  left: ${(props) => props.x1}px;
  top: ${(props) => props.y1}px;

  ::before {
    content: '';
    display: block;
    left: 0px;
    position: absolute;
  }
  ::before {
    border-style: solid;
    border-width: 3px 3px 0 0;
    border-color: #ffd343;
    height: 3px;
    margin-top: -3.5px;
    margin-left: 50%;
    width: 3px;
    transform: rotate(45deg);
  }
`;

const Line = styled.div<LineType>`
  position: absolute;
  background-color: ${(props) => (props.hoverRoad ? 'red' : 'none')};
  width: length;
  z-index: 5;
  pointer-events: none;
  border: ${(props) =>
    props.hoverRoad ? '2px dashed red' : '2px dashed #f04eff'};
  transform: ${(props) => `rotate(${props.angle}deg) translateY(-50%)`};
  transform-origin: top left;
  width: ${(props) => props.length}px;
  height: 1px;
  left: ${(props) => props.x1}px;
  top: ${(props) => props.y1}px;

  ::before {
    content: '';
    display: ${(props) => (props.roadType === 'oneWayRoad' ? 'block' : 'none')};
    left: 0px;
    position: absolute;
  }
  ::before {
    border-style: solid;
    border-width: 3px 3px 0 0;
    border-color: #ffd343;
    height: 7px;
    margin-top: -3.5px;
    margin-left: 50%;
    width: 7px;
    transform: rotate(45deg);
  }
`;

type Point2Type = {
  x: number;
  y: number;
};

const FastCargo: FC<{
  startPoint?: Point2Type;
  length?: number;
  angle?: number;
}> = ({ startPoint, length, angle }) => {
  const { data } = useMap();
  const [fs] = useAtom(fastShelve);
  const [fsr] = useAtom(fastShelveRoad);

  if (length === undefined || angle === undefined || !startPoint) return [];
  if (fs.length === 0 || !data) return [];
  return (
    <>
      {fs.map((v) => {
        const [displayX1, displayY1] = rosCoord2DisplayCoord({
          x: v.x,
          y: v.y,
          mapHeight: data.mapHeight,
          mapOriginX: data.mapOriginX,
          mapOriginY: data.mapOriginY,
          mapResolution: data.mapResolution,
        });
        // console.log('render');
        return (
          // Tooltip當右側顯示點位提示框開啟時彈出
          <Tooltip title={v.locationId} id={v.locationId.toString()}>
            <Container
              id={v.locationId?.toString()}
              canRotate={v.canRotate}
              data-id={v.locationId?.toString()}
              left={displayX1}
              top={displayY1}
              key={v.locationId}
            />
          </Tooltip>
        );
      })}

      <EditLine
        length={length}
        angle={angle}
        x1={startPoint?.x}
        y1={startPoint?.y}
      />
      {fsr.map((v) => {
        const [displayX1, displayY1] = rosCoord2DisplayCoord({
          x: v.x1,
          y: v.y1,
          mapHeight: data.mapHeight,
          mapOriginX: data.mapOriginX,
          mapOriginY: data.mapOriginY,
          mapResolution: data.mapResolution,
        });
        const [displayX2, displayY2] = rosCoord2DisplayCoord({
          x: v.x2,
          y: v.y2,
          mapHeight: data.mapHeight,
          mapOriginX: data.mapOriginX,
          mapOriginY: data.mapOriginY,
          mapResolution: data.mapResolution,
        });
        const angle2 = rad2Deg(
          Math.atan2(displayY2 - displayY1, displayX2 - displayX1),
        );

        const length2 = Math.hypot(
          displayX1 - displayX2,
          displayY1 - displayY2,
        );

        return (
          <Line
            key={v.roadId}
            length={length2}
            angle={angle2}
            x1={displayX1}
            y1={displayY1}
            roadType={v.roadType}
          />
        );
      })}
    </>
  );
};

export default FastCargo;

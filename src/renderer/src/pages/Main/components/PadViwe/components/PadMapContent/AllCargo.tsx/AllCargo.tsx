import useMap from '@renderer/api/useMap';
import { rosCoord2DisplayCoord } from '@renderer/utils/utils';
import { memo } from 'react';
import Cargo from './Cargo';
import { useAtomValue, useSetAtom } from 'jotai';
import { isShowLocation } from '@renderer/utils/siderGloble';
import { nanoid } from 'nanoid';
import useLoc, { LocWithoutArr } from '@renderer/api/useLoc';
import useCargoInfo from '@renderer/sockets/useCargoInfo';
import styled from 'styled-components';
import { tooltipProp } from '@renderer/utils/gloable';

const PointDiv = styled.div.attrs<{
  left: number;
  top: number;
  canrotate: string;
}>(({ left, top, canrotate }) => ({
  style: { left, top, canrotate }
}))<{
  left: number;
  top: number;
  canrotate: string;
}>`
  position: absolute;
  width: 5px;
  height: 5px;
  background: ${(props) => (props.canrotate === 'true' ? '#ebac5b' : '#1b00ce')};
  border-radius: 50%;
  z-index: 10;
  transition-duration: 200ms;
  &:hover {
    background: red;
    scale: 1.8;
  }
`;

export const Point = memo(PointDiv);

const AllCargo: React.FC = () => {
  const shelfInfo = useCargoInfo();
  const showLocation = useAtomValue(isShowLocation);
  const { data } = useMap();
  const setTooltip = useSetAtom(tooltipProp);

  const handleEnter = (locationId: string, x: number, y: number) => {
    setTooltip({
      x,
      y,
      locationId
    });
  };

  const handleLeave = () => {
    setTooltip(null);
  };
  const { data: locInfo } = useLoc(undefined);

  if (!data || !showLocation) return;
  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === '存貨區')
        .map((loc) => {
          const [displayX, displayY] = rosCoord2DisplayCoord({
            x: loc.x,
            y: loc.y,
            mapHeight: data?.mapHeight,
            mapOriginX: data?.mapOriginX,
            mapOriginY: data.mapOriginY,
            mapResolution: data.mapResolution
          });

          const info = locInfo as LocWithoutArr[];

          const translateX = info?.find((i) => i.locationId === loc.locationId)?.translateX || 0;
          const translateY = info?.find((i) => i.locationId === loc.locationId)?.translateY || 0;
          const rotate = info?.find((i) => i.locationId === loc.locationId)?.rotate || 270;
          const LocScale = info?.find((i) => i.locationId === loc.locationId)?.scale || 1;
          return (
            <div
              draggable={false}
              key={loc.locationId}
              onDragStart={(event) => {
                event.preventDefault();
              }}
              style={{ borderRadius: '50%' }}
            >
              <Point
                id={loc.locationId.toString()}
                canrotate={`${loc.canRotate}`}
                left={displayX}
                top={displayY}
                key={nanoid()}
                onMouseEnter={() => handleEnter(loc.locationId, loc.x, loc.y)}
                onMouseLeave={() => handleLeave()}
              >
                <Cargo
                  id={loc.id}
                  locId={loc.locationId}
                  translateX={translateX}
                  translateY={translateY}
                  scale={LocScale}
                  rotate={rotate}
                  shelfInfo={shelfInfo?.find((s) => s.areaId === loc.locationId)}
                />
              </Point>
            </div>
          );
        })}
    </>
  );
};

export default memo(AllCargo);

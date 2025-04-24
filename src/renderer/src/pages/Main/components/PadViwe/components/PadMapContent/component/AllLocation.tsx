import useMap from '@renderer/api/useMap';
import { rosCoord2DisplayCoord } from '@renderer/utils/utils';
import { memo, useCallback } from 'react';
import { nanoid } from 'nanoid';
import { Point } from '@renderer/pages/Setting/mapComponents/components/AllLocation/components/PointAndLine';
import { useSetAtom } from 'jotai';
import { tooltipProp } from '@renderer/utils/gloable';

const AllLocation = () => {
  const { data } = useMap();
  const setTooltip = useSetAtom(tooltipProp);

  const handleEnter = useCallback((locationId: string, x: number, y: number) => {
    setTooltip({
      x,
      y,
      locationId
    });
  }, []);

  const handleLeave = useCallback(() => {
    setTooltip(null);
  }, []);

  if (!data) return;

  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === 'Extra' || '預派點')
        .map((loc) => {
          const [displayX, displayY] = rosCoord2DisplayCoord({
            x: loc.x,
            y: loc.y,
            mapHeight: data?.mapHeight,
            mapOriginX: data?.mapOriginX,
            mapOriginY: data.mapOriginY,
            mapResolution: data.mapResolution
          });

          return (
            <Point
              id={loc.locationId.toString()}
              canrotate={`${loc.canRotate}`}
              onMouseEnter={() => handleEnter(loc.locationId, loc.x, loc.y)}
              onMouseLeave={() => handleLeave()}
              left={displayX}
              top={displayY}
              key={nanoid()}
            ></Point>
          );
        })}
    </>
  );
};

export default memo(AllLocation);

import useMap from '@renderer/api/useMap';
import { rosCoord2DisplayCoord } from '@renderer/utils/utils';
import { memo } from 'react';
import { nanoid } from 'nanoid';
import { Point } from '@renderer/pages/Setting/mapComponents/components/AllLocation/components/PointAndLine';

const AllLocation = () => {
  const { data } = useMap();
  if (!data) return;

  return (
    <>
      {data.locations
        .filter(({ areaType }) => areaType === 'Extra')
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

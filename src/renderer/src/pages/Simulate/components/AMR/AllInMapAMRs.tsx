import { FC, memo, RefObject } from 'react';
import useScriptRobot from '@renderer/api/useScriptRobot';
import AmrIcon from './AmrIcon';
import { amrId2Color, rosCoord2DisplayCoord } from '@renderer/utils/utils';
import useMap from '@renderer/api/useMap';

const MemoizedAMR = memo(AmrIcon, (prevProps, nextProps) => {
  return prevProps.placement == nextProps.placement && prevProps.amrId == nextProps.amrId;
});

const AllInMapAMRs: FC<{
  scale: number;
  mapRef: RefObject<HTMLDivElement>;
  mapWrapRef: RefObject<HTMLDivElement>;
}> = ({ mapRef, mapWrapRef, scale }) => {
  const { data: robot } = useScriptRobot();
  const { data: map } = useMap();
  if (!map) return null;

  if (!robot) return null;
  return (
    <>
      {robot
        .filter((v) => v?.script_placement_location !== 'unset')
        .map((b) => {
          const detail = map.locations.find((v) => v.locationId === b?.script_placement_location);

          const [left, top] = rosCoord2DisplayCoord({
            x: detail?.x as number,
            y: detail?.y as number,
            mapResolution: map.mapResolution,
            mapOriginX: map.mapOriginX,
            mapOriginY: map.mapOriginY,
            mapHeight: map.mapHeight
          });

          return (
            <MemoizedAMR
              amrId={b?.full_name as string}
              key={b?.id}
              color={amrId2Color(b?.id as string)}
              id={b?.id as string}
              mapRef={mapRef}
              mapWrapRef={mapWrapRef}
              scale={scale}
              left={left - 6}
              top={top - 5}
              placement={b?.script_placement_location as string}
            />
          );
        })}
    </>
  );
};

export default AllInMapAMRs;

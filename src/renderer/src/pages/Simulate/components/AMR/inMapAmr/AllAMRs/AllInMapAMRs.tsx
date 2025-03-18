import { FC, memo, RefObject } from 'react';
import useScriptRobot from '@renderer/api/useScriptRobot';
import { AMR } from '../components';

const MemoizedAMR = memo(AMR, (prevProps, nextProps) => {
  return prevProps.placement === nextProps.placement && prevProps.fullname === nextProps.fullname;
});

const AllInMapAMRs: FC<{
  scale: number;
  mapRef: RefObject<HTMLDivElement>;
  mapWrapRef: RefObject<HTMLDivElement>;
}> = ({ mapRef, mapWrapRef, scale }) => {
  const { data: robot } = useScriptRobot();

  if (!robot) return null;
  return (
    <>
      {robot
        .filter((v) => v?.script_placement_location !== 'unset')
        .map((b) => (
          <MemoizedAMR
            amrId={b?.full_name as string}
            key={b?.id}
            id={b?.id as string}
            mapRef={mapRef}
            mapWrapRef={mapWrapRef}
            scale={scale}
            fullname={b?.full_name as string}
            placement={b?.script_placement_location as string}
          />
        ))}
    </>
  );
};

export default AllInMapAMRs;

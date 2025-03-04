import useMap from '@renderer/api/useMap';
import { useAtomValue } from 'jotai';
import Zone from './components/Zone';
import { FC, memo } from 'react';
import { showAllZonesSwitch } from '@renderer/utils/siderGloble';

const AllZones: FC<{ scale: number }> = ({ scale }) => {
  const { data } = useMap();
  const showAllZones = useAtomValue(showAllZonesSwitch);
  if (!showAllZones || !data) return [];
  return (
    <>
      {data.zones.map((zone) => {
        return <Zone id={zone.name} info={zone} scale={scale} key={zone.id}></Zone>;
      })}
    </>
  );
};

export default memo(AllZones);

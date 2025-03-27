import { memo, RefObject } from 'react';
import { MapImage } from '@renderer/pages/Setting/mapComponents/components';
import '../webview.css';
import { AllZones } from '@renderer/pages/Setting/mapComponents/components';
import AllLocation from '../../PadViwe/components/PadMapContent/component/AllLocation';
import { useAtom, useAtomValue } from 'jotai';
import { AmrFilterCarCard, Scale } from '@renderer/utils/gloable';

import AllRoads from '@renderer/pages/Setting/mapComponents/components/AllRoads/AllRoads';
import AllAMRs from '../../PadViwe/components/PadMapContent/component/AllAMRs/AllAMRs';
import AllCargo from '../../PadViwe/components/PadMapContent/AllCargo.tsx/AllCargo';
const WebMapView: React.FC<{
  mapRef: RefObject<HTMLDivElement>;
}> = ({ mapRef }) => {
  const scale = useAtomValue(Scale);
  const [hintAmrId, setHintAmrId] = useAtom(AmrFilterCarCard);
  return (
    <div
      className="map-view"
      style={{ transform: `scale(${scale})` }}
      draggable={false}
      ref={mapRef}
      onClick={(e) => {
        if (!hintAmrId.size) {
          return;
        }
        if ((e.target as HTMLElement).tagName === 'IMG') {
          setHintAmrId((pre) => {
            pre.clear();
            return new Set([...pre]);
          });
        }
      }}
    >
      <MapImage></MapImage>
      <AllAMRs></AllAMRs>
      <AllCargo></AllCargo>
      <AllLocation></AllLocation>
      <AllRoads></AllRoads>
      <AllZones scale={scale}></AllZones>
    </div>
  );
};

export default memo(WebMapView);

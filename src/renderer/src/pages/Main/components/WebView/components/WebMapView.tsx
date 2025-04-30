import { memo, RefObject } from 'react';
import { MapImage } from '@renderer/pages/Setting/mapComponents/components';
import '../webview.css';
import { AllZones } from '@renderer/pages/Setting/mapComponents/components';
import AllLocation from '../../PadViwe/components/PadMapContent/component/AllLocation';
import { useAtom, useAtomValue } from 'jotai';
import { AmrFilterCarCard, Scale, showZoneForbidden } from '@renderer/utils/gloable';

import AllRoads from '@renderer/pages/Setting/mapComponents/components/AllRoads/AllRoads';
import AllAMRs from '../../PadViwe/components/PadMapContent/component/AllAMRs/AllAMRs';
import AllCargo from '../../PadViwe/components/PadMapContent/AllCargo.tsx/AllCargo';
import ToolTip from '@renderer/pages/Setting/components/ToolTip';
import { isShowLocation, isShowLocationTooltip, isShowRoad } from '@renderer/utils/siderGloble';
import { AllChargeStation } from './AllChargeStation';
import useMap from '@renderer/api/useMap';

const WebMapView: React.FC<{
  mapRef: RefObject<HTMLDivElement>;
}> = ({ mapRef }) => {
  const scale = useAtomValue(Scale);
  const [hintAmrId, setHintAmrId] = useAtom(AmrFilterCarCard);
  const [zoneForbidden, setZoneForbidden] = useAtom(showZoneForbidden);
  const showLocationToolTip = useAtomValue(isShowLocationTooltip);
  const showLocation = useAtomValue(isShowLocation);
  const showRoad = useAtomValue(isShowRoad);
  const { isError } = useMap();

  return (
    <div
      className="map-view"
      style={{ transform: `scale(${scale})` }}
      draggable={false}
      ref={mapRef}
      onClick={(e) => {
        if (zoneForbidden.size) {
          setZoneForbidden(new Set());
        }
        setZoneForbidden(new Set());
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
      {isError ? (
        []
      ) : (
        <>
          <AllAMRs></AllAMRs>
          <AllCargo></AllCargo>
          {showLocation ? <AllLocation></AllLocation> : null}
          {showRoad ? <AllRoads></AllRoads> : null}
          {showLocationToolTip ? <ToolTip /> : []}
          <AllZones scale={scale}></AllZones>
          <AllChargeStation />
        </>
      )}
    </div>
  );
};

export default memo(WebMapView);

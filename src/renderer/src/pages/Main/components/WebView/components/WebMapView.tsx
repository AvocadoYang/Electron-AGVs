import { RefObject } from 'react';
import { MapImage } from '@renderer/pages/Setting/mapComponents/components';
import '../webview.css';
import { AllZones } from '@renderer/pages/Setting/mapComponents/components';
import AllLocation from '../../PadViwe/components/PadMapContent/component/AllLocation';
const WebMapView: React.FC<{
  mapRef: RefObject<HTMLDivElement>;
  scale: number;
}> = ({ mapRef, scale }) => {
  return (
    <div
      className="map-view"
      style={{ transform: `scale(${scale})` }}
      draggable={false}
      ref={mapRef}
    >
      <MapImage></MapImage>
      <AllLocation></AllLocation>
      <AllZones scale={scale}></AllZones>
    </div>
  );
};

export default WebMapView;

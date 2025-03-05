import { memo, RefObject, useRef, useState } from 'react';
import { MapImage } from '@renderer/pages/Setting/mapComponents/components';
import { AllLocation, DragFrame, ZoneIconHint } from './components';
import ToolTip from '@renderer/pages/Setting/components/ToolTip';
import { useAtomValue, useSetAtom } from 'jotai';
import { isShowLocationTooltip, isShowRoad } from '@renderer/utils/siderGloble';
import AllRoads from './components/AllRoads/AllRoads';
import AllCargo from './components/AllCargo.tsx/AllCargo';
import { AllChargeStation } from './components/AllChargeStation';
import CargoModel from './components/AllCargo.tsx/CargoModel';
import { FloatButton } from 'antd';
import { isSelectCargo, SelectByZone, zoneValue } from '../utils/status';
import { FileTextOutlined } from '@ant-design/icons';
import CreateScriptForm from '../components/CreateScriptForm';
import { MouseLocationForFrame, RectInfo } from '@renderer/pages/Setting/hooks/hook';
import useZoneFrame from '../hooks/useZoneFrame';
import ZoneItemTable from './components/ZoneItemTable';

const MapView: React.FC<{
  scale: number;
  mapRef: RefObject<HTMLDivElement>;
  mapWrapRef: RefObject<HTMLDivElement>;
}> = ({ scale, mapRef, mapWrapRef }) => {
  const showLocationToolTip = useAtomValue(isShowLocationTooltip);
  const showRoad = useAtomValue(isShowRoad);
  const setIsSelecting = useSetAtom(isSelectCargo);
  const mapImageRef = useRef<HTMLImageElement>(null);

  const openEditZone = useAtomValue(SelectByZone);

  /** 拖曳區域相關參數 */
  const [isDragging, setIsDragging] = useState(false);
  const [, setInitPointRecord] = useState({
    rvizX: 0,
    rvizY: 0
  } as MouseLocationForFrame);
  const [, setEndPointRecord] = useState({
    rvizX: 0,
    rvizY: 0
  } as MouseLocationForFrame);

  const [rectInfo, setRectInfo] = useState({
    axisX: -5000,
    axisY: -5000,
    width: 0,
    height: 0
  } as RectInfo);
  /** */

  //控制區域圈選
  useZoneFrame(
    mapWrapRef,
    mapRef,
    mapImageRef,
    scale,
    setIsDragging,
    setInitPointRecord,
    setEndPointRecord,
    setRectInfo
  );

  return (
    <div
      style={{
        transform: `scale(${scale})`,
        transformOrigin: '0% 0%',
        position: 'relative'
      }}
      className="map-view"
      ref={mapRef}
      draggable={false}
    >
      <MapImage ref={mapImageRef} />

      <AllLocation />

      {showRoad ? <AllRoads /> : []}

      <AllCargo />

      <AllChargeStation />

      <CargoModel />

      {openEditZone ? (
        //開啟編輯區域時的提示Icon
        <ZoneIconHint
          mapWrapRef={mapWrapRef}
          mapRef={mapRef}
          mapImageRef={mapImageRef}
          scale={scale}
          isDragging={isDragging}
        />
      ) : (
        []
      )}

      {openEditZone ? <DragFrame rectInfo={rectInfo}></DragFrame> : []}

      <FloatButton
        icon={<FileTextOutlined />}
        description="HELP"
        shape="square"
        style={{ insetInlineEnd: 164 }}
        onClick={() => setIsSelecting(true)}
      />

      {showLocationToolTip ? <ToolTip /> : []}
      {/* 一開始創建新的模擬任務的modal 必須填完才能使用 */}
      <CreateScriptForm />
      <ZoneItemTable />
    </div>
  );
};

export default memo(MapView);

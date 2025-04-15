import Header from '@renderer/components/Header';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import MapView from './mapComponents/MapView';
import { FC, useRef } from 'react';
import ZoomPad from './components/ZoomPad';
import MapTitle from './mapComponents/components/MapTitle';
import ZoneItemTable from './mapComponents/components/ZoneItemTable';
import { isSelectCargo } from './utils/status';
import { useAtomValue } from 'jotai';
import { useIsMobile } from '@renderer/hooks/useIsMoblie';
import IdleRobotPanel from './components/AMR/IdleRobotPanel';
import SelectScript from './components/SelectScript';

const Simulate: FC = () => {
  const { isMobile } = useIsMobile();
  const mapRef = useRef(null);
  const mapWrapRef = useRef(null);
  const isSelecting = useAtomValue(isSelectCargo);

  return (
    <Layout style={{ height: `${isMobile ? '100dvh' : '100%'}` }}>
      <Header isMobile={isMobile} />
      <Content>
        <Layout style={{ height: '100%', width: '100%' }}>
          <div
            style={{
              height: '100%',
              width: '100%',
              overflow: 'scroll'
            }}
            draggable={false}
            ref={mapWrapRef}
          >
            <MapView mapRef={mapRef} mapWrapRef={mapWrapRef} />
          </div>

          {/* 選取模擬的名稱會漂浮在地圖右上 */}
          <MapTitle isMobile />

          {/* 選取區域時有包含在內的地點會到這個table  */}
          {isSelecting ? <ZoneItemTable /> : []}

          {/* 左上圓形 切換腳本  */}
          <SelectScript />

          {/* 左側未放置到地圖的車輛表 */}
          <IdleRobotPanel mapRef={mapRef} mapWrapRef={mapWrapRef} />
          <ZoomPad></ZoomPad>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Simulate;

import Header from '@renderer/components/Header';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Toolbar from './components/Toolbar';
import MapView from './mapComponents/MapView';
import { useRef, useState } from 'react';
import ZoomPad from './components/ZoomPad';
import MapTitle from './mapComponents/components/MapTitle';
import ZoneItemTable from './mapComponents/components/ZoneItemTable';
import { isSelectCargo } from './utils/status';
import { useAtomValue } from 'jotai';

const Simulate = () => {
  const [scale, setScale] = useState(1);
  const mapRef = useRef(null);
  const mapWrapRef = useRef(null);
  const isSelecting = useAtomValue(isSelectCargo);

  return (
    <>
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
        <Header></Header>
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
              <MapView mapRef={mapRef} mapWrapRef={mapWrapRef} scale={scale} />
            </div>

            {/* 選取模擬的名稱會漂浮在地圖右上 */}
            <MapTitle />

            {/* 選取區域時有包含在內的地點會到這個table  */}
            {isSelecting ? <ZoneItemTable /> : []}
            <Toolbar />
            <ZoomPad setScale={setScale}></ZoomPad>
          </Layout>
        </Content>
      </Layout>
    </>
  );
};

export default Simulate;

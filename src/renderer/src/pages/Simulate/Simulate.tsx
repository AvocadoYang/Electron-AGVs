import Header from '@renderer/components/Header';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Toolbar from './components/Toolbar';
import MapView from './mapComponents/MapView';
import { useEffect, useRef, useState } from 'react';
import ZoomPad from './components/ZoomPad';
import MapTitle from './mapComponents/components/MapTitle';
import ZoneItemTable from './mapComponents/components/ZoneItemTable';
import { globalRobots, isSelectCargo } from './utils/status';
import { useAtomValue, useSetAtom } from 'jotai';
import { useIsMobile } from '@renderer/hooks/useIsMoblie';
import useScriptRobot from '@renderer/api/useScriptRobot';
import IdleRobotPanel from './components/AMR/idleAmr/IdleRobotPanel';

const Simulate = () => {
  const [scale, setScale] = useState(1);
  const { isMobile } = useIsMobile();
  const mapRef = useRef(null);
  const mapWrapRef = useRef(null);
  const isSelecting = useAtomValue(isSelectCargo);
  const setRobots = useSetAtom(globalRobots);
  const { data: robot, isLoading } = useScriptRobot();

  useEffect(() => {
    if (!robot || isLoading) return;

    setRobots(robot ?? []);
  }, [robot]);

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
            <MapView mapRef={mapRef} mapWrapRef={mapWrapRef} scale={scale} />
          </div>

          {/* 選取模擬的名稱會漂浮在地圖右上 */}
          <MapTitle />

          {/* 選取區域時有包含在內的地點會到這個table  */}
          {isSelecting ? <ZoneItemTable /> : []}
          <Toolbar />
          <IdleRobotPanel mapRef={mapRef} mapWrapRef={mapWrapRef} scale={scale} />
          <ZoomPad setScale={setScale}></ZoomPad>
        </Layout>
      </Content>
    </Layout>
  );
};

export default Simulate;

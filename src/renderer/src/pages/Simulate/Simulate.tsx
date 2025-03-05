import Header from '@renderer/components/Header';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Toolbar from './components/Toolbar';
import MapView from './mapComponents/MapView';
import { useRef, useState } from 'react';
import ZoomPad from './components/ZoomPad';

const Simulate = () => {
  const [scale, setScale] = useState(1);
  const mapRef = useRef(null);
  const mapWrapRef = useRef(null);
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
            <Toolbar />
            <ZoomPad setScale={setScale}></ZoomPad>
          </Layout>
        </Content>
      </Layout>
    </>
  );
};

export default Simulate;

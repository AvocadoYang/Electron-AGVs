import { ConfigProvider, Splitter } from 'antd';
import { memo, useRef, useState } from 'react';
import { Layout } from 'antd';
import './webview.css';
import ZoomPad from './components/ZoomPad';
import WebMapView from './components/WebMapView';
import { useAtomValue } from 'jotai';
import CarCardWrap from '../../Car_Card/CardWrap';
import { darkMode } from '@renderer/utils/gloable';
const { Content } = Layout;
const WebView = () => {
  const mapRef = useRef(null);
  const isDark = useAtomValue(darkMode);
  const [scale, setScale] = useState(1);

  return (
    <Content>
      <ConfigProvider
        theme={{
          components: {
            Splitter: {
              colorFill: `${isDark ? '#ff8800' : 'rgba(0,0,0,0.15)'}`,
              controlItemBgActiveHover: `${isDark ? '#ffa00a' : '#bae0ff'}`,
              controlItemBgHover: `${isDark ? '#262626' : 'rgba(0,0,0,0.04)'}`
            }
          }
        }}
      >
        <Splitter>
          <Splitter.Panel
            defaultSize="14%"
            collapsible={true}
            className={`${isDark ? 'dark-mode-side' : ''}`}
            style={{ overflow: 'hidden', position: 'relative' }}
          >
            <CarCardWrap></CarCardWrap>
          </Splitter.Panel>
          <Splitter.Panel
            defaultSize="68%"
            style={{ position: 'relative', overflow: 'hidden' }}
            className={`${isDark ? 'dark-mode-map' : ''}`}
          >
            <Content className={`map-view-wrap ${isDark ? 'dark-mode-map' : ''}`}>
              <WebMapView mapRef={mapRef} scale={scale}></WebMapView>
            </Content>

            <ZoomPad setScale={setScale}></ZoomPad>
          </Splitter.Panel>
          <Splitter.Panel
            defaultSize="20%"
            min={'1%'}
            className={`${isDark ? 'dark-mode-side' : ''}`}
          >
            234
          </Splitter.Panel>
        </Splitter>
      </ConfigProvider>
    </Content>
  );
};

export default memo(WebView);

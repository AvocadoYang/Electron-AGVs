import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import WebView from './components/WebView/WebView';
import Header from '../../components/Header';
import './components/PadViwe/style.css';
import PadView from './components/PadViwe/PadView';
// import { Scene } from './3D'
// import CarCardWrap from './Car_Card/CardWrap'
// import MissionWrap from './Mission_Card/MissionWrap'
import { useAtom } from 'jotai';
import { viewBtn, ViewBtn } from './global/jotai';
import useResetSiderSwitch from '../Setting/hooks/useResetSiderSwitch';

const Main: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767);
  const [, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight);
    window.addEventListener('resize', updateHeight);

    // 確保初始設定正確
    updateHeight();

    return () => window.removeEventListener('resize', updateHeight);
  }, [isMobile]);

  const [_, setOpenEditLocationPanel] = useAtom(viewBtn);
  useEffect(() => {
    setOpenEditLocationPanel(ViewBtn.missionView);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 767);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useResetSiderSwitch();

  return (
    <Layout style={{ height: `${isMobile ? '100dvh' : '100%'}` }}>
      <Header isMobile={isMobile}></Header>
      {isMobile ? (
        <>
          <Layout style={{ height: '100%' }}>
            <PadView></PadView>
          </Layout>
        </>
      ) : (
        <WebView></WebView>
      )}
    </Layout>
  );
};

export default Main;

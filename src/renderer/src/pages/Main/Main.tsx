import React from 'react'
import { Layout } from 'antd'
import Header from '../../components/Header'
import '../../sockets/test'
import { Scene } from './3D'
import CarCardWrap from './Car_Card/CardWrap'
import MissionWrap from './Mission_Card/MissionWrap'
const { Content } = Layout

const Main: React.FC = () => {
  // const sceneRef = useRef<HTMLDivElement>(null);
  return (
    <Layout style={{ height: '100vh' }}>
      <Header></Header>
      <Content>
        <div style={{ width: '100%', height: '100%', position: 'relative'}}>
          <CarCardWrap></CarCardWrap>
          <Scene></Scene>
          <MissionWrap></MissionWrap>
        </div>
      </Content>
    </Layout>
  )
}

export default Main

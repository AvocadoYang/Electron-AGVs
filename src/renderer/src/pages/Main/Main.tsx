import React from 'react'
import { Layout } from 'antd'
import Header from '../../components/Header'
import '../../sockets/test'
import { Scene } from './3D'
import CarCardWrap from './3D/car_info/CardWrap'
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
        </div>
      </Content>
    </Layout>
  )
}

export default Main

import React, { useState } from 'react'
import { Layout } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider } from './components'
import MapView from './mapComponents/MapView'
import './setting.css'

const { Content } = Layout

const Setting: React.FC = () => {
  const [ scale, setScale ] = useState(1)
  return (
    <Layout style={{ height: '100vh' }}>
      <Header></Header>
      <Content>
        <Layout style={{ height: '100%', width: '100%' }}>
          <Sider></Sider>
          <Content
            style={{
              overflow: 'scroll'
            }}
          >
            <ZoomPad setScale={setScale}></ZoomPad>
            <MapView scale={scale}></MapView>
          </Content>
        </Layout>
      </Content>
    </Layout>
  )
}

export default Setting

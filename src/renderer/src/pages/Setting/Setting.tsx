import React, { useState, useRef } from 'react'
import { Layout } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider } from './components'
import MapView from './mapComponents/MapView'
import { useMousePoint } from './hooks'
import './setting.css'

const { Content } = Layout

const Setting: React.FC = () => {
  const mapRef = useRef(null)
  const mapWrapRef = useRef(null)
  const [mousePointX, setMousePointX] = useState(-3)
  const [mousePointY, setMousePointY] = useState(-3)
  const [scale, setScale] = useState(1)
  useMousePoint(mapWrapRef, mapRef, scale, setMousePointX, setMousePointY)
  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider></Sider>
            <Content
              style={{
                overflow: 'scroll'
              }}
              ref={mapWrapRef}
            >
              <ZoomPad setScale={setScale}></ZoomPad>
              <MapView
                scale={scale}
                mapRef={mapRef}
                mousePointXY={{ x: mousePointX, y: mousePointY }}
              ></MapView>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  )
}

export default Setting

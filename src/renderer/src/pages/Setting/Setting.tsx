import React, { useState, useRef } from 'react'
import { Layout, Form } from 'antd'
import { useAtom } from 'jotai'
import { tempEditLocationList } from '@renderer/utils/gloable'
import Header from '../../components/Header'
import { ZoomPad, Sider } from './components'
import MapView from './mapComponents/MapView'
import { useMousePoint } from './hooks'
import './setting.css'

const { Content } = Layout

const Setting: React.FC = () => {
  const mapRef = useRef(null)
  const mapWrapRef = useRef(null)
  const [locationPanelForm] = Form.useForm()
  const [editingList] = useAtom(tempEditLocationList)
  const [isMousePointStart, setIsMousePointStart] = useState(false)
  const [mousePointX, setMousePointX] = useState(-3)
  const [mousePointY, setMousePointY] = useState(-3)
  const [scale, setScale] = useState(1)
  useMousePoint(mapWrapRef, mapRef, scale, setMousePointX, setMousePointY, locationPanelForm)
  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider
              setIsMousePointStart={setIsMousePointStart}
              isMousePointStart={isMousePointStart}
              forms={{ locationPanelForm }}
            ></Sider>
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
                isMousePointStart={isMousePointStart}
              ></MapView>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  )
}

export default Setting

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useRef } from 'react'
import { Layout, Form } from 'antd'
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
  const [isMousePointStart, setIsMousePointStart] = useState(false)
  const [mousePointX, setMousePointX] = useState(-3)
  const [mousePointY, setMousePointY] = useState(-3)

  const [showStoredLocation, setShowStoredLocation] = useState(false)
  const [showEditingLocation, setShowEditingLocation] = useState(false)
  const [scale, setScale] = useState(1)

  console.log(showEditingLocation)

  useMousePoint(
    mapWrapRef,
    mapRef,
    scale,
    setMousePointX,
    setMousePointY,
    locationPanelForm,
    isMousePointStart
  )

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
              showStoredLocationControl={{
                setShowStoredLocation,
                showStoredLocation
              }}
              showEditingLocationControl={{
                setShowEditingLocation,
                showEditingLocation
              }}
            ></Sider>
            <Content
              style={{
                overflow: 'scroll'
                // backgroundColor: 'white'
              }}
              ref={mapWrapRef}
            >
              <ZoomPad setScale={setScale}></ZoomPad>
              <MapView
                scale={scale}
                mapRef={mapRef}
                mousePointXY={{ x: mousePointX, y: mousePointY }}
                isMousePointStart={isMousePointStart}
                showStoredLocation={showStoredLocation}
              ></MapView>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  )
}

export default Setting

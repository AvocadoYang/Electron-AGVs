/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Form } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider } from './components'
import { useAtom } from 'jotai'
import { tempEditAndStoredLocation, tempEditLocationList } from '@renderer/utils/gloable'
import useMap from '@renderer/api/useMap'
import { EditLocation, EditRoad } from './forms'

import MapView from './mapComponents/MapView'
import { useResetSiderSwitch } from './hooks'
import './setting.css'
const { Content } = Layout
const Setting: React.FC = () => {
  const { data } = useMap()
  const mapRef = useRef(null)
  const [, setTempEditAndStoredLocation] = useAtom(tempEditAndStoredLocation)
  const [TempEditLocationList] = useAtom(tempEditLocationList)

  const mapWrapRef = useRef(null)
  const [locationPanelForm] = Form.useForm()
  const [roadPanelForm] = Form.useForm()

  console.log(roadPanelForm.getFieldsValue())

  const [isMousePointStart, setIsMousePointStart] = useState(false)

  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!data) return
    const storedData = data.locations.map((v) => ({
      locationId: Number(v.locationId),
      x: v.x,
      y: v.y,
      rotation: v.rotation === undefined ? 0 : v.rotation,
      areaType: v.areaType,
      canRotate: v.canRotate
    }))
    setTempEditAndStoredLocation([...storedData, ...TempEditLocationList])
  }, [data])

  useResetSiderSwitch()

  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider
              setIsMousePointStart={setIsMousePointStart}
              isMousePointStart={isMousePointStart}
            ></Sider>
            <Content
              style={{
                overflow: 'scroll',
                backgroundColor: 'white'
              }}
              ref={mapWrapRef}
            >
              <ZoomPad setScale={setScale}></ZoomPad>
              <MapView
                scale={scale}
                mapRef={mapRef}
                mapWrapRef={mapWrapRef}
                roadPanelForm={roadPanelForm}
                locationPanelForm={locationPanelForm}
                isMousePointStart={isMousePointStart}
              ></MapView>
            </Content>
          </Layout>
        </Content>

        {
          /** 1-1 編輯點位的彈跳視窗 */
          <EditLocation
            setIsMousePointStart={setIsMousePointStart}
            isMousePointStart={isMousePointStart}
            locationPanelForm={locationPanelForm}
          ></EditLocation>
        }
        {<EditRoad roadPanelForm={roadPanelForm}></EditRoad>}
      </Layout>
    </>
  )
}

export default Setting

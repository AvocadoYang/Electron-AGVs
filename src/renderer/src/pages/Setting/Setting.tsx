/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Form } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider, FormDrawerBtn } from './components'
import { useAtom } from 'jotai'
import { tempEditAndStoredLocation, tempEditLocationList } from '@renderer/utils/gloable'
import useMap from '@renderer/api/useMap'
import { EditLocationPanel, EditRoadPanel } from './formComponent/forms'
import { FormDrawer } from './formComponent'
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
  }, [data, TempEditLocationList])

  useResetSiderSwitch()

  return (
    <>
      <Layout style={{ height: '100vh' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider></Sider>
            <Content
              style={{
                overflow: 'scroll',
                backgroundColor: 'white'
              }}
              ref={mapWrapRef}
            >
              <ZoomPad setScale={setScale}></ZoomPad>
              <FormDrawerBtn></FormDrawerBtn>
              <MapView
                scale={scale}
                mapRef={mapRef}
                mapWrapRef={mapWrapRef}
                roadPanelForm={roadPanelForm}
                locationPanelForm={locationPanelForm}
              ></MapView>
              <FormDrawer locationPanelForm={locationPanelForm}></FormDrawer>
            </Content>
          </Layout>
        </Content>

        {
          /** 1-1 編輯點位的彈跳視窗 */
          <EditLocationPanel locationPanelForm={locationPanelForm}></EditLocationPanel>
        }
        {
          /** 2-1 編輯路線的彈跳視窗 */
          <EditRoadPanel roadPanelForm={roadPanelForm}></EditRoadPanel>
        }
      </Layout>
    </>
  )
}

export default Setting

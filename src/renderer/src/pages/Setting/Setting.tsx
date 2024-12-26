/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Form, Flex, Splitter, Typography } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider, FormDrawerBtn } from './components'
import { useAtom } from 'jotai'
import { tempEditAndStoredLocation, tempEditLocationList } from '@renderer/utils/gloable'
import useMap from '@renderer/api/useMap'
import { EditLocationPanel, EditRoadPanel } from './formComponent/forms'
import { AllLocationTable } from './formComponent/forms'
import MapView from './mapComponents/MapView'
import { useResetSiderSwitch } from './hooks'
import './setting.css'
const { Content } = Layout

const Desc = (props) => (
  <Flex justify="center" align="center">
    <Typography.Title
      type="secondary"
      level={5}
      style={{
        whiteSpace: 'nowrap'
      }}
    >
      {props.text}
    </Typography.Title>
  </Flex>
)

const Setting: React.FC = () => {
  const { data } = useMap()
  const mapRef = useRef(null)

  const [, setTempEditAndStoredLocation] = useAtom(tempEditAndStoredLocation)
  const [TempEditLocationList] = useAtom(tempEditLocationList)

  const mapWrapRef = useRef(null)
  const [locationPanelForm] = Form.useForm()
  const [roadPanelForm] = Form.useForm()

  const [scale, setScale] = useState(1)
  const [sizes, setSizes] = React.useState(['50%', '50%'])

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
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider></Sider>
            <Content
              style={{
                // overflow: 'scroll',
                backgroundColor: 'white'
              }}
              ref={mapWrapRef}
            >
              <Splitter>
                <Splitter.Panel defaultSize="40%">
                  <Desc text="First" />
                </Splitter.Panel>
                <Splitter.Panel defaultSize="60%" min="20%">
                  <MapView
                    scale={scale}
                    mapRef={mapRef}
                    mapWrapRef={mapWrapRef}
                    roadPanelForm={roadPanelForm}
                    locationPanelForm={locationPanelForm}
                  ></MapView>
                </Splitter.Panel>
              </Splitter>

              <ZoomPad setScale={setScale}></ZoomPad>
              <FormDrawerBtn></FormDrawerBtn>

              {/* <FormDrawer locationPanelForm={locationPanelForm}></FormDrawer> */}
            </Content>
          </Layout>
        </Content>

        {
          /** 1-1 編輯點位的彈跳視窗 */
          <EditLocationPanel locationPanelForm={locationPanelForm}></EditLocationPanel>
        }
        {
          /** 1-4 顯示地點列表 */
          <AllLocationTable locationPanelForm={locationPanelForm}></AllLocationTable>
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

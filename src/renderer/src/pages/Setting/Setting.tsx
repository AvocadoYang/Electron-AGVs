/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Form, Splitter, Flex } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider, FormDrawerBtn } from './components'

import useMap from '@renderer/api/useMap'
import { EditLocationPanel, EditRoadPanel } from './formComponent/forms'
import { AllLocationTable } from './formComponent/forms'
import MapView from './mapComponents/MapView'
import { useResetSiderSwitch } from './hooks'
import './setting.css'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { getMoveIndex } from './utils/utils'
import { formList } from './components/siderElement'
const { Content } = Layout

const Setting: React.FC = () => {
  const { data } = useMap()
  const mapRef = useRef(null)
  const [hasOpenTool, setHasOpenTool] = useState(false)

  const [panelSize, setPanelSize] = useState<string | undefined>('0%')
  const mapWrapRef = useRef(null)
  const [locationPanelForm] = Form.useForm()
  const [roadPanelForm] = Form.useForm()
  const [dataList, setDataList] = useState(formList)
  const [scale, setScale] = useState(1)

  const dragEndEvent = (dragItem) => {
    setDataList((prevDataList) => {
      const moveDataList = [...prevDataList]
      const { activeIndex, overIndex } = getMoveIndex(moveDataList, dragItem)
      const newDataList = arrayMove(moveDataList, activeIndex, overIndex)
      return newDataList
    })
  }

  // useEffect(() => {
  //   if (hasOpenTool) {
  //     setPanelSize('40%')
  //     const timer = setTimeout(() => {
  //       setPanelSize(undefined)
  //     }, 1000)
  //     return () => clearTimeout(timer)
  //   } else {
  //     setPanelSize('0%')
  //   }
  // }, [hasOpenTool])

  useResetSiderSwitch()

  return (
    <>
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider setHasOpenTool={setHasOpenTool} />
            <Content
              style={{
                // overflow: 'scroll',
                backgroundColor: 'white'
              }}
              ref={mapWrapRef}
            >
              <Splitter>
                <Splitter.Panel
                  defaultSize={'50%'}
                  //</Splitter> size={panelSize}
                  style={{ overflowX: 'hidden' }}
                >
                  <DndContext onDragEnd={dragEndEvent} modifiers={[restrictToParentElement]}>
                    <SortableContext
                      items={dataList.map((c) => c.key)}
                      strategy={verticalListSortingStrategy}
                    >
                      {/* 這裡的items接收一個array，這個array的值要和useSortable傳入的id對應 */}
                      <Flex
                        vertical
                        gap="middle"
                        align="start"
                        className="attrs"
                        style={{ padding: '1em' }}
                      >
                        {dataList.map((form) => {
                          if (form.key === 'locationPanel') {
                            /** 1-1 編輯點位的彈跳視窗 */
                            return (
                              <EditLocationPanel
                                locationPanelForm={locationPanelForm}
                                sortableId={form.key}
                                key={form.key}
                              ></EditLocationPanel>
                            )
                          }
                          if (form.key === 'locationList') {
                            /** 1-4 顯示地點列表 */
                            return (
                              <AllLocationTable
                                sortableId={form.key}
                                key={form.key}
                              ></AllLocationTable>
                            )
                          }
                          return null
                        })}
                      </Flex>
                    </SortableContext>
                  </DndContext>
                </Splitter.Panel>
                <Splitter.Panel defaultSize={'100%'}>
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
          /** 1-4 顯示地點列表 */
          // <AllLocationTable locationPanelForm={locationPanelForm}></AllLocationTable>
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

/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState, useRef, useEffect } from 'react'
import { Layout, Form, Splitter, FormInstance } from 'antd'
import Header from '../../components/Header'
import { ZoomPad, Sider, FormDrawerBtn } from './components'
import { useAtom } from 'jotai'
import { tempStoredLocation } from '@renderer/utils/gloable'
import useMap from '@renderer/api/useMap'
import { EditLocationPanel, EditRoadPanel } from './formComponent/forms'
import { AllLocationTable } from './formComponent/forms'
import MapView from './mapComponents/MapView'
import { useResetSiderSwitch } from './hooks'
import './setting.css'
import {CSS} from '@dnd-kit/utilities'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { restrictToParentElement } from '@dnd-kit/modifiers'
const { Content } = Layout

const getMoveIndex = (array, dragItem) => {
  const { active, over } = dragItem;
  let activeIndex = 0;
  let overIndex = 0;
  try {
      // 遍历数组，查找出active和over的index
      array.forEach((item, index) => {
          if (active.id === item.key) {
              activeIndex = index;
          }
          if (over.id === item.key) {
              overIndex = index;
          }
      });
  } catch (error) {
      overIndex = activeIndex; // 如果有问题，则复位
  }
  return { activeIndex, overIndex };
};

 // 拖拽项组件
 const SortableItem: React.FC<{ locationPanelForm: FormInstance<unknown>, itemProps:{
  key: string;
  width: number;
  isChecked: boolean;
  title: string;
}}> = ({itemProps: checkboxItem, locationPanelForm}) => {
  // 父传子，从props里拿，建议使用其他名字（如itemProps）代替props，以免和父组件的props混淆
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
      id: checkboxItem.key, // 这里传入的id属性必须和SortableContext的items数组一一对应
      transition: {
          duration: 500,
          easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
      },
  });
  const styles = {
      transform: CSS.Transform.toString(transform),
      transition,
  };

  return (
        <div ref={setNodeRef} {...attributes} style={styles}>
        <EditLocationPanel locationPanelForm={locationPanelForm} listeners={listeners}></EditLocationPanel>
      </div>

  );
};



const Setting: React.FC = () => {
  const { data } = useMap()
  const mapRef = useRef(null)

  const [, setTempStoredLocation] = useAtom(tempStoredLocation)

  const mapWrapRef = useRef(null)
  const [locationPanelForm] = Form.useForm()
  const [roadPanelForm] = Form.useForm()
  const [dataList, setDataList] = useState([
    { key: 'name', width: 0.25, isChecked: true, title: '姓名' },
    { key: 'age', width: 0.25, isChecked: true, title: '年龄' },
    { key: 'sex', width: 0.25, isChecked: true, title: '性别' },
    { key: 'phone', width: 0.25, isChecked: true, title: '手机号' },
]);


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
    setTempStoredLocation([...storedData])
  }, [data])



  const dragEndEvent = (dragItem) => {
    setDataList((prevDataList) => {
        const moveDataList = [...prevDataList];
        const { activeIndex, overIndex } = getMoveIndex(moveDataList, dragItem);
        const newDataList = arrayMove(moveDataList, activeIndex, overIndex);
        return newDataList;
    });
};



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
                <DndContext onDragEnd={dragEndEvent} modifiers={[restrictToParentElement]}>
                  <SortableContext items={dataList.map((c) => c.key)} strategy={verticalListSortingStrategy}>
                      {/* 这里的items接收一个数组，这个数组的值要和useSortable传入的id属性一一对应 */}
                      <div className="attrs">

                              {dataList.map((checkboxItem) => (
                                  <SortableItem itemProps={checkboxItem} key={checkboxItem.key} locationPanelForm={locationPanelForm} />
                              ))}

                      </div>
                  </SortableContext>
              </DndContext>

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
          // <EditLocationPanel locationPanelForm={locationPanelForm}></EditLocationPanel>
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

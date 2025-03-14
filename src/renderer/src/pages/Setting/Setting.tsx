import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Layout, Form, Splitter, Flex } from 'antd';
import Header from '../../components/Header';
import { ZoomPad, Sider, FormDrawerBtn, ToolComponents } from './components';
import MapView from './mapComponents/MapView';
import { useResetSiderSwitch } from './hooks';
import './setting.css';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToParentElement } from '@dnd-kit/modifiers';
import { getMoveIndex } from './utils/utils';
import { toolbarState } from './components/siderElement';
import { useIsMobile } from '@renderer/hooks/useIsMoblie';
const { Content } = Layout;

const Setting: React.FC = () => {
  const mapRef = useRef(null);
  const [hasOpenTool, setHasOpenTool] = useState(false);
  const mapWrapRef = useRef(null);
  const [locationPanelForm] = Form.useForm();
  const { isMobile } = useIsMobile();
  const [roadPanelForm] = Form.useForm();
  const [zonePanelForm] = Form.useForm();
  const [tagSettingForm] = Form.useForm();
  const [dataList, setDataList] = useState(toolbarState);
  const [scale, setScale] = useState(1);
  const [splitterSize, setSplitterSize] = useState<number[] | string[]>(['0%', '100%']);

  const dragEndEvent = (dragItem) => {
    setDataList((prevDataList) => {
      const moveDataList = prevDataList;
      const { activeIndex, overIndex } = getMoveIndex(moveDataList, dragItem);
      const newDataList = arrayMove(moveDataList, activeIndex, overIndex);
      return newDataList;
    });
  };

  const dndContextMemo = useMemo(() => {
    return (
      <DndContext onDragEnd={dragEndEvent} modifiers={[restrictToParentElement]}>
        <SortableContext items={dataList.map((c) => c.key)} strategy={verticalListSortingStrategy}>
          <Flex vertical gap="middle" align="start" className="attrs" style={{ padding: '1em' }}>
            {
              <ToolComponents
                locationPanelForm={locationPanelForm}
                roadPanelForm={roadPanelForm}
                zonePanelForm={zonePanelForm}
                tagSettingForm={tagSettingForm}
                dataList={dataList}
              />
            }
          </Flex>
        </SortableContext>
      </DndContext>
    );
  }, [dataList, locationPanelForm]);

  useEffect(() => {
    if (hasOpenTool) {
      setSplitterSize(['30%', '100%']);
    } else {
      setSplitterSize(['0%', '100%']);
    }
  }, [hasOpenTool]);

  const updateSize = (size) => {
    setSplitterSize(size);
  };

  useResetSiderSwitch();

  return (
    <>
      <Layout style={{ height: `${isMobile ? '100dvh' : '100%'}` }}>
        <Header isMobile={isMobile}></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <Sider setHasOpenTool={setHasOpenTool} />
            <Content
              style={{
                backgroundColor: 'white'
              }}
            >
              <Splitter onResize={updateSize}>
                <Splitter.Panel
                  size={splitterSize[0]}
                  collapsible={hasOpenTool ? true : false}
                  resizable={hasOpenTool ? true : false}
                  style={{ overflowX: 'hidden' }}
                >
                  {dndContextMemo}
                </Splitter.Panel>
                <Splitter.Panel size={splitterSize[1]} style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      height: '100%',
                      width: '100%',
                      overflow: 'scroll'
                    }}
                    draggable={false}
                    ref={mapWrapRef}
                  >
                    <MapView
                      scale={scale}
                      mapRef={mapRef}
                      mapWrapRef={mapWrapRef}
                      roadPanelForm={roadPanelForm}
                      locationPanelForm={locationPanelForm}
                      zonePanelForm={zonePanelForm}
                    ></MapView>
                  </div>
                </Splitter.Panel>
              </Splitter>
              <ZoomPad setScale={setScale}></ZoomPad>
              <FormDrawerBtn></FormDrawerBtn>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </>
  );
};

export default Setting;

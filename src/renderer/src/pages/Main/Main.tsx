import React, { useEffect, useState } from 'react'
import { Layout, Splitter, Col, Row, Button, Flex } from 'antd'
import Header from '../../components/Header'
import './components/PadViwe/style.css'
import PadView from './components/PadViwe/PadView'
import { Scene } from './3D'
import CarCardWrap from './Car_Card/CardWrap'
import MissionWrap from './Mission_Card/MissionWrap'
import { useAtom } from 'jotai'
import { viewBtn, ViewBtn } from './global/jotai'

const { Content } = Layout

const Main: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 767)
  const [windowHeight, setWindowHeight] = useState(window.innerHeight)

  useEffect(() => {
    const updateHeight = () => setWindowHeight(window.innerHeight)
    window.addEventListener('resize', updateHeight)

    // 確保初始設定正確
    updateHeight()

    return () => window.removeEventListener('resize', updateHeight)
  }, [isMobile])

  const [_, setOpenEditLocationPanel] = useAtom(viewBtn)
  useEffect(() => {
    setOpenEditLocationPanel(ViewBtn.missionView)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 767)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <Layout style={{ height: '100dvh' }}>
      <Header isMobile={isMobile}></Header>
      {isMobile ? (
        <>
          <Layout style={{ height: '100%' }}>
            <PadView></PadView>
          </Layout>
        </>
      ) : (
        <Content>
          <Row style={{ width: '100%', height: '100%' }}>
            <Col span={3} style={{ padding: '20px 15px 0 15px' }}>
              <Flex vertical justify="center" align="center">
                <Button
                  color="default"
                  variant="solid"
                  style={{ width: '80%', fontWeight: 'bold' }}
                >
                  ++快速任務派發
                </Button>
              </Flex>
            </Col>
            <Col span={21}>
              <div style={{ width: '100%', height: '100%' }}>
                <Splitter>
                  <Splitter.Panel defaultSize="75%" style={{ overflowX: 'hidden' }}>
                    324
                  </Splitter.Panel>
                  <Splitter.Panel defaultSize="25%" style={{ overflowX: 'hidden' }} min="25%">
                    234
                  </Splitter.Panel>
                </Splitter>
              </div>
            </Col>
          </Row>
          {/* <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            <CarCardWrap></CarCardWrap>
            <Scene></Scene>
            <MissionWrap></MissionWrap>
            </div> */}
        </Content>
      )}
    </Layout>
  )
}

export default Main

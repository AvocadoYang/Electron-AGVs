import React from 'react'
import { Layout, Splitter, Col, Row, Button, Flex } from 'antd'
import Header from '../../components/Header'
import { Scene } from './3D'
import CarCardWrap from './Car_Card/CardWrap'
import MissionWrap from './Mission_Card/MissionWrap'
const { Content } = Layout

const Main: React.FC = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Header></Header>
      <Content>
              <Row style={{ width: '100%', height: '100%'}}>
                <Col span={3} style={{ padding: '20px 15px 0 15px'}}>
                  <Flex vertical justify='center' align='center'>
                      <Button color="default" variant="solid" style={{ width: '80%', fontWeight: 'bold'}}>
                          ++快速任務派發
                      </Button>
                    </Flex>
                </Col>
                <Col span={21}>
                  <div style={{ width: '100%', height: '100%'}}>
                    <Splitter>
                      <Splitter.Panel defaultSize="75%" style={{overflowX: 'hidden'}}>
                        324
                      </Splitter.Panel>
                      <Splitter.Panel defaultSize="25%" style={{overflowX: 'hidden'}} min="25%">234</Splitter.Panel>
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
    </Layout>
  )
}

export default Main

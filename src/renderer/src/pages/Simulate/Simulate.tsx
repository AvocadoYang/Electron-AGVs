import Header from '@renderer/components/Header'
import { Layout } from 'antd'
import { Content } from 'antd/es/layout/layout'
import Toolbar from './components/Toolbar'
import MapView from './components/MapView'
import { ZoomPad } from '../Setting/components'
import { useState } from 'react'

const Simulate = () => {
  const [scale, setScale] = useState(1)
  return (
    <>
      <Layout style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'relative' }}>
        <Header></Header>
        <Content>
          <Layout style={{ height: '100%', width: '100%' }}>
            <MapView scale={scale} />
            <Toolbar />
            <ZoomPad setScale={setScale}></ZoomPad>
          </Layout>
        </Content>
      </Layout>
    </>
  )
}

export default Simulate

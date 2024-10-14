import React from 'react'
import { Layout } from 'antd'
import Header from '../../components/Header'
const { Content } = Layout

const Main: React.FC = () => {
  // const sceneRef = useRef<HTMLDivElement>(null);
  return (
    <Layout>
      <Header></Header>
      <Content style={{ height: '93.5vh' }}></Content>
    </Layout>
  )
}

export default Main

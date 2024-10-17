import React, { useState } from 'react'
import { Layout, Menu } from 'antd'
import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import '../setting.css'

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1)

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1
        return {
          key: subKey,
          label: `option${subKey}`
        }
      })
    }
  }
)

const { Sider: AntdSider } = Layout

const Sider: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true)
  return (
    <AntdSider
      collapsible
      width={200}
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <Menu mode="inline" style={{ height: '100%', borderRight: 0 }} items={items2} />
    </AntdSider>
  )
}

export default Sider

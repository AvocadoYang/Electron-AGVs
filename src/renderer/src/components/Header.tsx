import { Layout, Menu } from 'antd'
const { Header: AntdHeader } = Layout

const items = new Array(3).fill(null).map((_, index) => ({
  key: index + 1,
  label: `nav ${index + 1}`
}))

const Header: React.FC = () => {
  return (
    <AntdHeader style={{ display: 'flex', alignItems: 'center'
     }}>
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        defaultSelectedKeys={['2']}
        items={items}
        style={{ flex: 1, minWidth: 0 }}
      />
    </AntdHeader>
  )
}

export default Header

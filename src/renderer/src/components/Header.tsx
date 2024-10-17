/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Layout, Menu } from 'antd'
import '../components/component.css'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
const { Header: AntdHeader } = Layout

const Header: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const items = [`${t('page_map')}`, `${t('page_setting')}`].map((name, index) => ({
    key: index + 1,
    label: name
  }))

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case '1':
        navigate('/dashboard')
        break
      case '2':
        navigate('/setting')
        break
      case '3':
        navigate('/path3')
        break
      default:
        break
    }
  }

  return (
    <AntdHeader
      style={{ display: 'flex', alignItems: 'center', padding: '0 1px 0 1px', height: '6%' }}
      className="custom-header"
    >
      <div className="demo-logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        items={items}
        style={{ flex: 1, minWidth: 0 }}
        onClick={handleMenuClick}
        className="custom-menu"
      />
    </AntdHeader>
  )
}

export default Header

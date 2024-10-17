/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Layout, Menu } from 'antd'
import '../components/component.css'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { UserOutlined } from '@ant-design/icons'
const { Header: AntdHeader } = Layout

const Header: React.FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const items = [`${t('page_dashboard')}`, `${t('page_view')}`, `${t('page_setting')}`].map(
    (name, index) => ({
      key: index + 1,
      label: name
    })
  )

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case '1':
        navigate('/dashboard')
        break
      case '2':
        navigate('/view')
        break
      case '3':
        navigate('/setting')
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
      <div
        style={{
          display: 'flex',
          padding: '1px',
          alignItems: 'center',
          justifyContent: 'space-around',
          marginRight: '8px',
          width: '13%'
        }}
      >
        <Select
          defaultValue="ch.tw"
          style={{ width: 120 }}
          onChange={() => console.log(123)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ch.tw', label: 'Chinese' }
          ]}
        />
        <UserOutlined style={{ color: 'blue' }} />
      </div>
    </AntdHeader>
  )
}

export default Header

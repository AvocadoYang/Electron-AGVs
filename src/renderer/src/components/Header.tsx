/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Layout, Menu, Flex } from 'antd'
import '../components/component.css'
import { useNavigate } from 'react-router-dom'
import { Select } from 'antd'
import { memo } from 'react'
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
      style={{ display: 'flex', alignItems: 'center', padding: '0 1px 0 1px' }}
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

      <Flex gap="middle" align="start" style={{ marginRight: '10px' }}>
        <Select
          defaultValue="ch.tw"
          style={{ width: 120 }}
          onChange={() => console.log(123)}
          options={[
            { value: 'en', label: 'English' },
            { value: 'ch.tw', label: 'Chinese' }
          ]}
        />
        <UserOutlined
          style={{ color: 'blue', textAlign: 'center', fontSize: '150%', marginTop: '5px' }}
        />
      </Flex>
    </AntdHeader>
  )
}

export default memo(Header)

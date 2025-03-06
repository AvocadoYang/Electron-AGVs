/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Layout, Menu, Flex, ConfigProvider, Button, Drawer } from 'antd';
import '../components/component.css';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import { memo, useState } from 'react';
import { MenuOutlined, SunOutlined, MoonOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';
const { Header: AntdHeader } = Layout;

const Header: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useAtom(darkMode);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const items = [
    `${t('page_dashboard')}`,
    `${t('page_view')}`,
    `${t('page_setting')}`,
    `${t('page_simulate')}`
  ].map((name, index) => ({
    key: index + 1,
    label: name
  }));

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case '1':
        navigate('/dashboard');
        break;
      case '2':
        navigate('/view');
        break;
      case '3':
        navigate('/setting');
        break;
      case '4':
        navigate('/simulate');
        break;
      default:
        break;
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            // headerBg: '#fc9f13'
          }
        }
      }}
    >
      <AntdHeader
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px'
        }}
        className={`custom-header ${isDark ? 'dark-mode' : ''}`}
      >
        <div className={`demo-logo ${isDark ? 'dark-mode' : ''}`} />

        {/* 行動裝置顯示 Drawer 按鈕 */}
        {isMobile ? (
          <>
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
              <Button
                type="text"
                icon={<MenuOutlined style={{ fontSize: '20px', color: 'white' }} />}
                onClick={() => setDrawerOpen(true)}
              />
              <UserOutlined
                style={{ color: 'blue', textAlign: 'center', fontSize: '150%', marginTop: '5px' }}
              />
            </Flex>
            <Drawer
              title="Menu"
              placement="left"
              onClose={() => setDrawerOpen(false)}
              open={drawerOpen}
              width={250}
            >
              <Menu mode="vertical" items={items} onClick={handleMenuClick} />
            </Drawer>
          </>
        ) : (
          // 桌面版顯示水平選單
          <>
            <Menu
              theme="dark"
              mode="horizontal"
              items={items}
              style={{ flex: 1, minWidth: 0 }}
              onClick={handleMenuClick}
              className="custom-menu"
            />
            <Flex gap="middle" align="start" style={{ marginRight: '10px' }}>
              {isDark ? (
                <SunOutlined className="light-mode-icon" onClick={() => setIsDark(false)} />
              ) : (
                <MoonOutlined className="dark-mode-icon" onClick={() => setIsDark(true)} />
              )}
              <Select
                defaultValue="ch.tw"
                style={{ width: 120 }}
                onChange={() => console.log(123)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'ch.tw', label: 'Chinese' }
                ]}
                className={`${isDark ? 'select-lang' : ''}`}
              />
              <UserOutlined
                style={{ color: 'blue', textAlign: 'center', fontSize: '150%', marginTop: '5px' }}
              />
            </Flex>
          </>
        )}
      </AntdHeader>
    </ConfigProvider>
  );
};

export default memo(Header);

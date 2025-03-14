/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Layout, Menu, Flex, Button, Drawer, Badge, Modal } from 'antd';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
    <>
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
              <Badge count={3} className={`alert-icon`} onClick={showModal}>
                <svg
                  onClick={() => {
                    // setOpenErrorWrap(!openErrorWrap);
                  }}
                  width={30}
                  fill={true ? '#ff7300' : '#f96706'}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  cursor="pointer"
                  className="shake-icon"
                >
                  <title>Alert</title>
                  <path
                    // stroke={true ? '#ff7300' : 'gray'}
                    fill="#ff5e00"
                    d="M6,4V11H4C2.89,11 2,11.89 2,13V17A3,3 0 0,0 5,20A3,3 0 0,0 8,17H10A3,3 0 0,0 13,20A3,3 0 0,0 16,17V13L12,4H6M17,5V19H22V17.5H18.5V5H17M7.5,5.5H11.2L14.5,13H7.5V5.5M5,15.5A1.5,1.5 0 0,1 6.5,17A1.5,1.5 0 0,1 5,18.5A1.5,1.5 0 0,1 3.5,17A1.5,1.5 0 0,1 5,15.5M13,15.5A1.5,1.5 0 0,1 14.5,17A1.5,1.5 0 0,1 13,18.5A1.5,1.5 0 0,1 11.5,17A1.5,1.5 0 0,1 13,15.5Z"
                  />
                </svg>
              </Badge>
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                width={28}
                viewBox="0 0 24 24"
                cursor="pointer"
              >
                <title>Simulation</title>
                <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" />
              </svg> */}
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

      <Modal
        mask={false}
        title="告警提示"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default memo(Header);

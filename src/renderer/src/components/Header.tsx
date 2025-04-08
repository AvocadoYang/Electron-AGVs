/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  Layout,
  Menu,
  Flex,
  Button,
  Drawer,
  Badge,
  Modal,
  Divider,
  Typography,
  List,
  Space,
  Tag,
  message,
  Tooltip
} from 'antd';
import '../components/component.css';
import { useNavigate } from 'react-router-dom';
import { Select } from 'antd';
import { memo, useState } from 'react';
import {
  CarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { UserOutlined } from '@ant-design/icons';
import { useAtom } from 'jotai';
import { AmrFilterCarCard, darkMode } from '@renderer/utils/gloable';
import useMockRobot from '@renderer/api/useMockRobot';
import { useMutation } from '@tanstack/react-query';
import client from '@renderer/api/axiosClient';
import { errorHandler } from '@renderer/utils/utils';
import { ErrorResponse } from '@renderer/utils/globalType';
import useName from '@renderer/api/useAmrName';
const { Header: AntdHeader } = Layout;
const { Title, Text } = Typography;

const Header: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isDark] = useAtom(darkMode);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hintAmrId, setHintAmrId] = useAtom(AmrFilterCarCard);
  //點擊地圖AMR時篩選卡片
  const { data: script, refetch } = useMockRobot();
  const { refetch: amrNameRefetch } = useName();
  const [messageApi, contextHolder] = message.useMessage();

  const simMutation = useMutation({
    mutationFn: (isSimulate: boolean) => {
      return client.post('api/simulate/simulate', { isSimulate });
    },
    onSuccess: () => {
      messageApi.success(t('utils.success'));
      refetch();
      amrNameRefetch();
      setIsSimulateOpen(false);
      if (!hintAmrId.size) {
        return;
      }
      setHintAmrId((pre) => {
        pre.clear();
        return new Set([...pre]);
      });
    },
    onError: (e: ErrorResponse) => errorHandler(e, messageApi)
  });

  const handleSim = () => {
    simMutation.mutate(true);
  };

  const handleAbortSim = () => {
    simMutation.mutate(false);
  };

  const items = [
    `${t('page_view')}`,
    `${t('page_dashboard')}`,
    `${t('page_setting')}`,
    `${t('page_simulate')}`
  ].map((name, index) => ({
    key: index + 1,
    label: name
  }));

  const handleMenuClick = (e: { key: string }) => {
    switch (e.key) {
      case '1':
        navigate('/view');
        break;
      case '2':
        navigate('/dashboard');
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

  const handleChineseItemClick = (value: string) => {
    // eslint-disable-next-line no-void

    if (value === 'en') {
      void i18n.changeLanguage('en');
    } else {
      void i18n.changeLanguage('tw');
    }
  };

  return (
    <>
      {contextHolder}
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
                onChange={(e) => console.log(e)}
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
            <Flex gap="middle" align="center" justify="center" style={{ marginRight: '10px' }}>
              <Badge count={3} className={`alert-icon`} onClick={() => setIsModalOpen(true)}>
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

              {script?.isSimulate ? (
                <Tooltip title={t('header.inactive_sim')}>
                  <svg
                    onClick={() => handleAbortSim()}
                    width={30}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="#ff0000"
                      d="M15.73,3L21,8.27V15.73L15.73,21H8.27L3,15.73V8.27L8.27,3H15.73M15,16V8H13V16H15M11,16V8H9V16H11Z"
                    />
                  </svg>
                </Tooltip>
              ) : (
                <Tooltip title={t('page_simulate')}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={30}
                    viewBox="0 0 24 24"
                    cursor="pointer"
                    onClick={() => setIsSimulateOpen(true)}
                    // style={{ padding: '50%' }}
                  >
                    <path d="M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z" />
                  </svg>
                </Tooltip>
              )}

              {/* {isDark ? (
                <SunOutlined className="light-mode-icon" onClick={() => setIsDark(false)} />
              ) : (
                <MoonOutlined className="dark-mode-icon" onClick={() => setIsDark(true)} />
              )} */}
              <Select
                defaultValue="ch.tw"
                style={{ width: 120 }}
                onChange={(e) => handleChineseItemClick(e)}
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
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>

      <Modal
        open={isSimulateOpen}
        onCancel={() => setIsSimulateOpen(false)}
        footer={null} // Custom footer for better control
        width={450}
        centered
        style={{
          padding: '24px',
          borderRadius: '8px',
          background: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0, color: '#1d39c4' }}>
            <CarOutlined style={{ marginRight: '8px', color: '#1d39c4' }} />
            {t('header.active_sim')}
          </Title>
          <Text type="secondary">{t('header.please_confirm_info')}</Text>
        </div>

        {/* Script Details Section */}
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            {t('header.sim_script')}
          </Text>
          <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
            {script?.scriptName || t('header.no_script_select')}
          </Tag>
        </div>

        {/* Car List Section */}
        <div style={{ marginBottom: '24px' }}>
          <Text strong style={{ display: 'block', marginBottom: '8px' }}>
            {t('header.in_use_robot')}
          </Text>
          {script?.robot && script.robot.length > 0 ? (
            <List
              size="small"
              dataSource={script.robot}
              renderItem={(robot) => (
                <List.Item style={{ padding: '8px 0', borderBottom: 'none' }}>
                  <Text>
                    <CarOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                    {robot.id}
                  </Text>
                </List.Item>
              )}
              style={{
                maxHeight: '150px',
                overflowY: 'auto',
                padding: '8px',
                background: '#f9f9f9',
                borderRadius: '4px'
              }}
            />
          ) : (
            <Text type="secondary"> {t('header.no_robot_select')}</Text>
          )}
        </div>

        {/* Divider */}
        <Divider style={{ margin: '16px 0' }} />

        {/* Action Buttons */}
        <Space style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleSim()}
            style={{
              background: '#1d39c4',
              borderColor: '#1d39c4',
              borderRadius: '4px',
              padding: '0 24px'
            }}
          >
            {t('header.active')}
          </Button>
          <Button
            icon={<CloseCircleOutlined />}
            onClick={() => setIsSimulateOpen(false)}
            style={{
              borderRadius: '4px',
              padding: '0 24px'
            }}
          >
            {t('header.cancel')}
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default memo(Header);

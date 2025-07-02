import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Typography, Tag, Progress, Descriptions, Table, Button, Modal, Flex } from 'antd';
import styled from 'styled-components';
import ReactJsonView from '@uiw/react-json-view';
import {
  ArrowLeftOutlined,
  UpOutlined,
  DownOutlined,
  LeftOutlined,
  RightOutlined,
  RedoOutlined,
  StopOutlined
} from '@ant-design/icons';
import {
  useAmrDetail,
  useAmrPose,
  useIsCarry,
  useIsLogIn,
  useMaintenanceStatus
} from '@renderer/sockets/useAMRInfo';
import { useRecentMission } from '@renderer/sockets/useMissions';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Container = styled.div`
  max-width: 700px;
  margin: 40px auto;
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  max-height: 90vh;
  overflow-y: scroll;

  @media (max-width: 900px) {
    max-width: 98vw;
    padding: 12px;
    margin: 16px auto;
  }
  @media (max-width: 600px) {
    padding: 4vw 2vw;
    border-radius: 8px;
    margin: 8px auto;
  }
`;

const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
`;

const DPad = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  justify-items: center;
  align-items: center;
  width: 180px;
  background: #f9f9f9;
  padding: 8px;

  @media (max-width: 600px) {
    width: 120px;
    gap: 4px;
  }
`;

const DPadRow = styled.div`
  display: flex;
  width: 100%;
  gap: 16px;
  justify-content: center;
  align-items: flex-start;
  margin-bottom: 8px;

  @media (max-width: 600px) {
    gap: 8px;
  }
`;

const DPadMain = styled(DPad)`
  flex: 0 1 70%;
  max-width: 70%;
  height: 14em;
`;

const DPadSide = styled.div`
  flex: 0 1 40%;
  max-width: 380px;
  height: 14em; // increased from 10em
  padding: 0.8em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  background: #f9f9f9;
`;

const PoseWrapper = styled.div`
  max-width: 15em;
  min-width: 15em;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  margin-bottom: 16px;

  .ant-table {
    min-width: 480px;
  }

  @media (max-width: 600px) {
    .ant-table {
      min-width: 360px;
    }
  }
`;

const FixedDescWrapper = styled.div`
  position: relative;
  overflow: hidden;
  padding-right: 24px;

  .ant-descriptions {
    margin-bottom: 0;
  }

  @media (max-width: 600px) {
    padding-right: 16px;
  }
`;

const StatusWrapper = styled.div`
  height: 2em;
  width: 15em;
  text-overflow: clip;
`;

const AmrDetail = () => {
  const { amrId } = useParams<{ amrId: string }>();
  let prefixAmrId = '';
  if (amrId?.startsWith('mock')) {
    prefixAmrId = `#` + amrId.slice(5);
  } else {
    prefixAmrId = amrId || '';
  }

  const amr = useAmrDetail(prefixAmrId || '');
  const currier = useIsCarry(prefixAmrId || '');
  const maintenance = useMaintenanceStatus(prefixAmrId || '');
  const { pose } = useAmrPose(prefixAmrId || '');
  const { recentMission } = useRecentMission(prefixAmrId || '');
  const connectionStatus = useIsLogIn(prefixAmrId || '');
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showCargoMetadata, setShowCargoMetadata] = useState(false);
  const { t } = useTranslation();

  // Prepare table data from recentMission
  const missionTasks = recentMission
    ? [
        {
          key: recentMission.missionId,
          id: recentMission.missionId,
          desc: recentMission.full_name?.join(' / ') || recentMission.sub_name || '-',
          status: recentMission.missionStatus,
          time: recentMission.startedAt
            ? new Date(recentMission.startedAt).toLocaleTimeString()
            : '-'
        }
      ]
    : [];

  return (
    <>
      <Container>
        <Link to="/amr">
          <Button icon={<ArrowLeftOutlined />}>{t('amr_detail.back')}</Button>
        </Link>
        {amr ? (
          <>
            <Flex vertical gap="small">
              <Title level={2} style={{ marginBottom: 0, fontSize: '2rem' }}>
                {prefixAmrId}
              </Title>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  flexWrap: 'wrap',
                  marginBottom: 16
                }}
              >
                <Tag color={connectionStatus.isOnline ? 'green' : 'red'}>
                  {connectionStatus.isOnline ? t('amr_detail.online') : t('amr_detail.offline')}
                </Tag>
                <Tag color={connectionStatus.isOverdue ? 'red' : 'blue'}>
                  {connectionStatus.isOverdue ? t('amr_detail.overdue') : t('amr_detail.normal')}
                </Tag>
                <Tag color={connectionStatus.isPosAccurate ? 'green' : 'orange'}>
                  {connectionStatus.isPosAccurate
                    ? t('amr_detail.accurate')
                    : t('amr_detail.inaccurate')}
                </Tag>
                <Tag color="default">
                  {t('amr_detail.delay', { ms: connectionStatus.networkDelay })}
                </Tag>
              </div>
            </Flex>

            <FixedDescWrapper>
              <Descriptions bordered column={1} size="middle" style={{ marginBottom: 24 }}>
                <Descriptions.Item label={t('amr_detail.battery')}>
                  <Progress
                    percent={amr.battery}
                    size="small"
                    status={amr.battery < 20 ? 'exception' : 'active'}
                  />
                </Descriptions.Item>

                <Descriptions.Item label={t('amr_detail.status')}>
                  <StatusWrapper>{amr.status || '-'}</StatusWrapper>
                </Descriptions.Item>

                <Descriptions.Item label={t('amr_detail.location')}>
                  <Text>{amr.locationId || '-'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={t('amr_detail.current_position')}>
                  <Text>
                    {pose && typeof pose === 'object' ? (
                      <PoseWrapper>
                        {`x: ${pose.x ?? '-'}, y: ${pose.y ?? '-'}, θ: ${pose.yaw ?? '-'}`}
                      </PoseWrapper>
                    ) : (
                      <PoseWrapper>-</PoseWrapper>
                    )}
                  </Text>
                </Descriptions.Item>
                <Descriptions.Item label={t('amr_detail.carrying_cargo')}>
                  {currier.isCarry ? (
                    <>
                      <Tag color="volcano">{t('utils.yes')}</Tag>
                      <Button
                        size="small"
                        style={{ marginLeft: 8 }}
                        onClick={() => setShowCargoMetadata(true)}
                      >
                        {t('amr_detail.show_cargo_metadata')}
                      </Button>
                    </>
                  ) : (
                    t('utils.no')
                  )}
                </Descriptions.Item>
                <Descriptions.Item label={t('amr_detail.maintenance')}>
                  <Text>
                    {maintenance && typeof maintenance === 'object'
                      ? maintenance.status || JSON.stringify(maintenance)
                      : maintenance
                        ? String(maintenance)
                        : '-'}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </FixedDescWrapper>
            <Button
              type="primary"
              onClick={() => setShowControlPanel((v) => !v)}
              style={{ marginBottom: showControlPanel ? 0 : 24, width: '100%', maxWidth: 300 }}
            >
              {showControlPanel ? t('amr_detail.hide_manual') : t('amr_detail.show_manual')}
            </Button>
            {showControlPanel && (
              <ControlPanel>
                <Title level={4} style={{ marginBottom: 12, fontSize: '1.2em' }}>
                  {t('amr_detail.manual_operation')}
                </Title>
                <DPadRow>
                  <DPadMain>
                    <div /> {/* Spacer */}
                    <Button icon={<UpOutlined />} />
                    <div /> {/* Spacer */}
                    <Button icon={<LeftOutlined />} />
                    <Button icon={<DownOutlined />} />
                    <Button icon={<RightOutlined />} />
                  </DPadMain>
                  <DPadSide>
                    <Flex vertical gap="middle">
                      <Button icon={<RedoOutlined />} type="default" aria-label="force_to_standby">
                        {t('amr_detail.force_to_standby')}
                      </Button>
                      <Button
                        icon={<RedoOutlined />}
                        type="primary"
                        style={{ background: '#faad14', borderColor: '#faad14', color: '#fff' }}
                        aria-label="Reset AMR position"
                      >
                        {t('amr_detail.reset')}
                      </Button>
                      <Button
                        style={{ background: '#92fa14', borderColor: '#92fa14', color: '#fff' }}
                        icon={<StopOutlined />}
                        aria-label="continue AMR"
                      >
                        {t('amr_detail.continue')}
                      </Button>
                      <Button icon={<StopOutlined />} danger aria-label="Emergency stop AMR">
                        {t('amr_detail.stop')}
                      </Button>
                    </Flex>
                  </DPadSide>
                </DPadRow>
              </ControlPanel>
            )}
            <Title level={4} style={{ fontSize: '1.1em' }}>
              {t('amr_detail.recent_tasks')}
            </Title>
            <TableWrapper>
              <Table
                dataSource={missionTasks}
                pagination={false}
                size="small"
                columns={[
                  {
                    title: t('amr_detail.task_id'),
                    dataIndex: 'id',
                    key: 'id',
                    render(value: string) {
                      return `${value.slice(0, 5)}...`;
                    }
                  },
                  { title: t('amr_detail.desc'), dataIndex: 'desc', key: 'desc' },
                  {
                    title: t('amr_detail.status'),
                    dataIndex: 'status',
                    key: 'status',
                    render: (status) => (
                      <Tag
                        color={
                          status === 'Completed'
                            ? 'green'
                            : status === 'In Progress'
                              ? 'blue'
                              : 'default'
                        }
                      >
                        {t('amr_detail.status')}: {status}
                      </Tag>
                    )
                  },
                  { title: t('amr_detail.time'), dataIndex: 'time', key: 'time' }
                ]}
                style={{ marginTop: 12 }}
                locale={{ emptyText: t('amr_detail.no_mission') }}
              />
            </TableWrapper>
          </>
        ) : (
          <Card>
            <Title level={4}>{t('amr_detail.amr_not_found')}</Title>
            <Text type="secondary">{t('amr_detail.no_data')}</Text>
          </Card>
        )}
      </Container>
      <Modal
        open={showCargoMetadata}
        onCancel={() => setShowCargoMetadata(false)}
        footer={null}
        title={t('amr_detail.cargo_metadata')}
      >
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {currier.metadata ? (
            <ReactJsonView
              displayDataTypes={false}
              value={JSON.parse(currier.metadata)}
              collapsed={false}
              enableClipboard={false}
              style={{ fontSize: 14 }}
            />
          ) : (
            t('amr_detail.no_metadata')
          )}
        </pre>
      </Modal>
    </>
  );
};

export default AmrDetail;

import { MissionInfo, useMissions } from '../../../../sockets/useMissions';
import { TableColumnsType, Table, Spin, ConfigProvider } from 'antd';
import { memo, useState } from 'react';
import '../mission_info.css';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { translate } from '@renderer/i18n';
import { darkMode } from '@renderer/utils/gloable';
import { useAtomValue } from 'jotai';

const MISSION_SORT = ['executing', 'assigned', 'pending', 'completed', 'aborting', 'canceled'];
const TaskInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TaskTitle = styled.h3`
  margin: 0;
  padding: 0;
  font-size: 1.2em;
`;

const SubTitle = styled.h4`
  margin: 0;
  padding: 0;
  font-size: 1em;
`;

const MissionTable = () => {
  const { t } = useTranslation();
  const isDark = useAtomValue(darkMode);
  const [selectionType] = useState<'checkbox' | 'radio'>('checkbox');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [_selectInfo, setSelectInfo] = useState<MissionInfo[]>([]);

  const columns: TableColumnsType<MissionInfo> = [
    {
      title: 'AMR',
      dataIndex: 'amrId',
      key: 'amrId',
      render: (code: string) => (code ? code.replace('amr-0', '#') : '---'),
      filters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => ({
        text: `${v}`,
        value: `amr-0${v < 10 ? `0${v}` : v}`
      })),
      onFilter: (value, record) => {
        return record.amrId === value;
      },
      width: 20
    },
    {
      title: t('mission.task_table.status'),
      dataIndex: 'missionStatus',
      key: 'missionStatus'
    },

    {
      title: t('toolbar.mission.mission'),
      dataIndex: 'taskInfo',
      key: 'taskInfo',
      render(_value, record) {
        const from = record.startShelfColumn === null ? '' : record.startShelfColumn;
        const to = record.endShelfColumn === null ? '' : record.endShelfColumn;

        return (
          <TaskInfo>
            <TaskTitle>{record.fullName}</TaskTitle>
            <SubTitle>{`${from} -> ${to}`}</SubTitle>
          </TaskInfo>
        );
      }
    },
    {
      title: t('utils.cost_time'),
      dataIndex: 'totalTime',
      key: 'totalTime'
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKey: React.Key[], selectedRows: MissionInfo[]) => {
      setSelectInfo(selectedRows);
      setSelectedRowKeys(selectedRowKey);
    },
    getCheckboxProps: (record: MissionInfo) => ({
      disabled: record.amrId === 'Disabled User' // Column configuration not to be checked
    })
  };
  const { missions } = useMissions();
  if (!missions)
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: '100%'
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowHoverBg: isDark ? '#313131' : '#fafafa'
          }
        }
      }}
    >
      <Table
        columns={columns}
        style={{ width: '100%' }}
        className={`custom-table ${isDark ? 'custom-table-dark' : ''}`}
        rowSelection={{
          type: selectionType,
          ...rowSelection
        }}
        dataSource={missions
          .sort((a, b) => {
            const isCompleteA = a.missionStatus === 'completed';
            const isCompleteB = b.missionStatus === 'completed';
            const typeDiff =
              MISSION_SORT.indexOf(a.missionStatus as string) -
              MISSION_SORT.indexOf(b.missionStatus as string);
            if (typeDiff !== 0) return typeDiff;
            if (isCompleteA && isCompleteB) {
              return b.createdAt.getTime() - a.createdAt.getTime();
            }

            if (!isCompleteA && !isCompleteB) {
              return a.order - b.order;
            }

            return MISSION_SORT.indexOf(a.missionStatus) - MISSION_SORT.indexOf(b.missionStatus);
          })
          .map((m) => ({
            ...m,
            missionStatus: translate('normal', m.missionStatus) || '',
            missionType: translate('normal', m.missionType) || '',
            manualMode: m.manualMode ? t('utils.yes') : t('utils.no'),
            emergencyBtn: m.emergencyBtn ? t('utils.yes') : t('utils.no'),
            recoveryBtn: m.recoveryBtn ? t('utils.yes') : t('utils.no'),

            // completedTime: m.startedAt
            //   ? diffMinute(m.startedAt, m.completedAt || new Date())
            //   : '',
            completedTime:
              m.forkStartAt && m.forkEndAt
                ? Math.round((m.forkEndAt.getTime() - m.forkStartAt.getTime()) / 6000) / 10
                : '',

            totalTime:
              m.completedAt && m.createdAt
                ? Math.round((m.completedAt.getTime() - (m.startedAt?.getTime() || 0)) / 6000) / 10
                : ''
          }))}
      />
    </ConfigProvider>
  );
};

export default memo(MissionTable);

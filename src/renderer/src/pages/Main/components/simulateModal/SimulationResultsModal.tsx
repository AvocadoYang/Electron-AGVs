import { Modal, Typography, Space, Button, Table } from 'antd';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
`;

const StatLabel = styled(Typography.Text)`
  font-weight: 500;
  color: #666;
`;

const StatValue = styled(Typography.Text)`
  color: #1a1a1a;
`;

const StyledTable = styled(Table)`
  margin-top: 16px;
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 500;
    color: #666;
  }
  .ant-table-tbody > tr > td {
    color: #1a1a1a;
  }
`;

interface SimulationResults {
  simulationId: string;
  duration: number; // In seconds
  cargosCarried: number;
  missionsPerAmr: Record<string, number>;
  batteryCostPerAmr: Record<string, number>;
  averageMissionTimePerAmr: Record<string, number>;
  totalDistanceTraveledPerAmr: Record<string, number>;
  idleTimePerAmr: Record<string, number>;
  missionSuccessRate: number;
  completedMissions: number;
}

interface SimulationResultsModalProps {
  visible: boolean;
  results: SimulationResults | null;
  onClose: () => void;
}

const SimulationResultsModal: React.FC<SimulationResultsModalProps> = ({
  visible,
  results,
  onClose
}) => {
  const { t } = useTranslation();

  const handleDownload = () => {
    if (!results) return;
    const dataStr = JSON.stringify(results, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `simulation_results_${results.simulationId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!results) return null;

  const tableData = Object.keys(results.missionsPerAmr).map((amrId) => ({
    key: amrId,
    amrId,
    missions: results.missionsPerAmr[amrId],
    batteryCost: results.batteryCostPerAmr[amrId],
    averageMissionTime: results.averageMissionTimePerAmr[amrId],
    totalDistanceTraveled: results.totalDistanceTraveledPerAmr[amrId],
    idleTime: results.idleTimePerAmr[amrId]
  }));

  const columns = [
    {
      title: t('sim.results.table.amr_id'),
      dataIndex: 'amrId',
      key: 'amrId'
    },
    {
      title: t('sim.results.table.missions'),
      dataIndex: 'missions',
      key: 'missions',
      render: (value: number) => `${value} ${t('utils.missions')}`
    },
    {
      title: t('sim.results.table.battery_cost'),
      dataIndex: 'batteryCost',
      key: 'batteryCost',
      render: (value: number) => `${value.toFixed(2)} ${t('utils.units')}`
    },
    {
      title: t('sim.results.table.average_mission_time'),
      dataIndex: 'averageMissionTime',
      key: 'averageMissionTime',
      render: (value: number) => `${value.toFixed(2)} ${t('utils.seconds')}`
    },
    {
      title: t('sim.results.table.total_distance_traveled'),
      dataIndex: 'totalDistanceTraveled',
      key: 'totalDistanceTraveled',
      render: (value: number) => `${value.toFixed(2)} ${t('utils.meters')}`
    }
    // {
    //   title: t('sim.results.table.idle_time'),
    //   dataIndex: 'idleTime',
    //   key: 'idleTime',
    //   render: (value: number) => `${value.toFixed(2)} ${t('utils.seconds')}`
    // }
  ];

  return (
    <Modal
      title={t('sim.results.title')}
      open={visible}
      onCancel={onClose}
      footer={
        <Space>
          <Button onClick={handleDownload}>{t('sim.results.download')}</Button>
          <Button type="primary" onClick={onClose}>
            {t('utils.close')}
          </Button>
        </Space>
      }
      width={800}
      centered
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <StatItem>
          <StatLabel>{t('sim.results.duration')}</StatLabel>
          <StatValue>
            {(results.duration / 60).toFixed(2)} {t('utils.minutes')}
          </StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>{t('sim.results.cargos_carried')}</StatLabel>
          <StatValue>{results.cargosCarried}</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>{t('sim.results.mission_success_rate')}</StatLabel>
          <StatValue>{results.missionSuccessRate.toFixed(2)}%</StatValue>
        </StatItem>

        <StatItem>
          <StatLabel>{t('sim.results.completed_missions')}</StatLabel>
          <StatValue>{results.completedMissions}</StatValue>
        </StatItem>

        <StyledTable
          columns={columns}
          dataSource={tableData}
          pagination={false}
          size="middle"
          bordered
        />
      </Space>
    </Modal>
  );
};

export default SimulationResultsModal;

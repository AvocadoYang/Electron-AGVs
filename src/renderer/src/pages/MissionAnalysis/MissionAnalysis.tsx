//import AMRPerformance from './AMRPerformance';
import { BatteryUsageChart } from './BatteryUsageChart';
import ChartsOverview from './ChartsOverview';
import { DistancePerMissionChart } from './DistancePerMissionChart';
import { MissionsOverTimeChart } from './MissionsOverTimeChart';
import MissionSummary from './MissionSummary';
import MissionTable from './MissionTable';
import { DashboardContainer } from './styles';
import WarningsPanel from './WarningsPanel';

const MissionAnalysis = () => {
  return (
    <DashboardContainer>
      <MissionSummary />
      {/* <AMRPerformance /> */}
      <ChartsOverview />
      <BatteryUsageChart />
      <DistancePerMissionChart />
      <MissionsOverTimeChart />
      <MissionTable />
      <WarningsPanel />
    </DashboardContainer>
  );
};

export default MissionAnalysis;

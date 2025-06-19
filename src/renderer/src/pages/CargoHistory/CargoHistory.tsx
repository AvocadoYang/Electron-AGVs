import Layout, { Content } from 'antd/es/layout/layout';
import HistoryTable from './HIstoryTable';
import { useIsMobile } from '@renderer/hooks/useIsMoblie';
import Header from '@renderer/components/Header';

const CargoHistory = () => {
  const { isMobile } = useIsMobile();
  return (
    <Layout style={{ height: `${isMobile ? '100dvh' : '100%'}` }}>
      <Header isMobile={isMobile}></Header>
      <Content>
        <HistoryTable />
      </Content>
    </Layout>
  );
};

export default CargoHistory;

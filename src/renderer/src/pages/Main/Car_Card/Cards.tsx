import { memo } from 'react';
import Card from './Card';
import { Flex } from 'antd';
import useName from '@renderer/api/useAmrName';
import useMockRobot from '@renderer/api/useMockRobot';

const Cards: React.FC<{}> = () => {
  const { data: names } = useName();
  const { data: mockRobot } = useMockRobot();

  if (!names || !names.length) return;
  if (mockRobot && mockRobot.isSimulate) {
    return (
      <Flex align="center" justify="center" wrap gap="middle" style={{ width: '95%' }}>
        {mockRobot.robot?.map((v) => {
          return <Card key={v.id} id={v.id as string} />;
        })}
      </Flex>
    );
  }
  return (
    <Flex align="center" justify="center" wrap gap="middle" style={{ width: '95%' }}>
      {names.map((item) => (
        <Card key={item.id} id={item.id}></Card>
      ))}
    </Flex>
  );
};

export default memo(Cards);

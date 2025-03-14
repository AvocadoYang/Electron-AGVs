import { memo } from 'react';
import Card from './Card';
import { Flex } from 'antd';
import useName from '@renderer/api/useAmrName';

const Cards = () => {
  const { data: name } = useName();
  if (!name || !name.length) return;
  return (
    <Flex align="center" justify="center" wrap gap="middle" style={{ width: '95%' }}>
      {name.map((item) => (
        <Card key={item.id} id={item.id}></Card>
      ))}
    </Flex>
  );
};

export default memo(Cards);

import { memo } from 'react';
import Card from './Card';
import { Flex } from 'antd';

const Cards = () => {
  return (
    <Flex align="center" justify="center" wrap gap="middle" style={{ width: '95%' }}>
      {[
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25,
        26, 27, 28, 29
      ].map((item) => (
        <Card key={item} id={item}></Card>
      ))}
    </Flex>
  );
};

export default memo(Cards);

import { memo, useMemo } from 'react';
import Card from './Card';
import { Flex, SelectProps } from 'antd';
import useName from '@renderer/api/useAmrName';

const Cards: React.FC<{ selectOption: SelectProps['options'] }> = ({ selectOption }) => {
  const { data: names } = useName();

  const display = useMemo(() => {
    if (!names) return names;
    if (selectOption?.length) {
      const filter = new Set(selectOption.map((item) => item.value));
      return names.filter((amrInfo) => {
        const amrCategory = amrInfo.id.split('-').slice(0, 3).join('-');
        return filter.has(amrCategory);
      });
    }
    return names;
  }, [selectOption, names]);
  if (!names || !names.length || !display) return;
  return (
    <Flex align="center" justify="center" wrap gap="middle" style={{ width: '95%' }}>
      {display.map((item) => (
        <Card key={item.id} id={item.id}></Card>
      ))}
    </Flex>
  );
};

export default memo(Cards);

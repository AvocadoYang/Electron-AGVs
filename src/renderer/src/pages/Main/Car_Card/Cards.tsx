import { memo, useMemo } from 'react';
import Card from './Card';
import { Flex, SelectProps } from 'antd';
import useName from '@renderer/api/useAmrName';
import { useAtomValue } from 'jotai';
import { AmrFilterCarCard } from '@renderer/utils/gloable';

const Cards: React.FC<{ selectOption: SelectProps['options'] }> = ({ selectOption }) => {
  const { data: names } = useName();
  const hintAmrId = useAtomValue(AmrFilterCarCard);
  console.log(hintAmrId);

  const display = useMemo(() => {
    if (!names) return names;
    if (hintAmrId) {
      return names.filter((amrInfo) => {
        return amrInfo.id === hintAmrId;
      });
    }
    if (selectOption?.length) {
      const filter = new Set(selectOption.map((item) => item.value));
      return names.filter((amrInfo) => {
        const amrCategory = amrInfo.id.split('-').slice(0, 3).join('-');
        return filter.has(amrCategory);
      });
    }
    return names;
  }, [selectOption, hintAmrId, names]);

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

import React, { memo } from 'react';
import './car_info.css';

import Cards from './Cards';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';
import { SelectProps } from 'antd';
import TittleTools from './TittleTools';

const options: SelectProps['options'] = [];

for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i
  });
}

const CarCardWrap: React.FC = () => {
  const isDark = useAtomValue(darkMode);
  return (
    <>
      <div className={`card-wrap-2d ${isDark ? 'dark-mode-wrap' : ''}`} draggable="false">
        <TittleTools></TittleTools>
        <Cards></Cards>
      </div>
    </>
  );
};

export default memo(CarCardWrap);

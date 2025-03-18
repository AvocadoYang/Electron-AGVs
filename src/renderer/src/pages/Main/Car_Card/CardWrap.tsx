import React, { memo, useState } from 'react';
import './car_info.css';

import Cards from './Cards';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';
import TittleTools from './TittleTools';
import { SelectProps } from 'antd';

const CarCardWrap: React.FC = () => {
  const isDark = useAtomValue(darkMode);
  const [selectedOption, setSelectedOption] = useState<SelectProps['options']>([]);
  return (
    <>
      <div className={`card-wrap-2d ${isDark ? 'dark-mode-wrap' : ''}`} draggable="false">
        <TittleTools setSelectedOption={setSelectedOption}></TittleTools>
        <Cards selectOption={selectedOption}></Cards>
      </div>
    </>
  );
};

export default memo(CarCardWrap);

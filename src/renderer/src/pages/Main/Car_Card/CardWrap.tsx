import React, { memo } from 'react';
import './car_info.css';
// import { useTranslation } from 'react-i18next'
import Card from './Card';
import { useAtomValue } from 'jotai';
import { darkMode } from '@renderer/utils/gloable';

const CarCardWrap: React.FC = () => {
  const isDark = useAtomValue(darkMode);
  // const { t } = useTranslation()
  return (
    <div className={`card-wrap-2d ${isDark ? 'dark-mode' : ''}`} draggable="false">
      <span className={`card-wrap-title ${isDark ? 'dark-mode-title' : ''}`}>AMRs</span>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map(
        (item) => (
          <Card key={item}></Card>
        )
      )}
    </div>
  );
};

export default memo(CarCardWrap);

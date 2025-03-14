import { Card } from 'antd';
import React from 'react';
import { FC, useState } from 'react';
import './style.css';
import { useTranslation } from 'react-i18next';
import UploadMap from './UploadMap';
import MapViewer from './MapViewer';

const contentList: Record<string, React.ReactNode> = {
  tab1: <MapViewer />,
  tab2: <UploadMap />
};

const ChangeMapModal: FC<{}> = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<string>('tab1');

  const tabList = [
    {
      key: 'tab1',
      tab: t('change_map.view_maps')
    },
    {
      key: 'tab2',
      tab: t('change_map.upload_map')
    }
  ];

  const onTab1Change = (key: string) => {
    setActiveTab(key);
  };

  return <div className="change-map-wrap">123</div>;
};

export default ChangeMapModal;

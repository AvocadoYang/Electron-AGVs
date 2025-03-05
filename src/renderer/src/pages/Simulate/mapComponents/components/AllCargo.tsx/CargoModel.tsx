import { Modal, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import OutputFrom from './OutputFrom';
import { useAtomValue } from 'jotai';
import { isSelectCargo } from '@renderer/pages/Simulate/utils/status';
import { FC } from 'react';

const CargoModel: FC = () => {
  const { t } = useTranslation();
  const isSelecting = useAtomValue(isSelectCargo);

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('sim.cargo.output.output'),
      children: <OutputFrom />
    },
    {
      key: '2',
      label: t('sim.cargo.input.input'),
      children: 'Content of Tab Pane 2'
    }
  ];
  return (
    <>
      <Modal open={isSelecting}>
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};

export default CargoModel;

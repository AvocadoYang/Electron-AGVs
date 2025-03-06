import { Button, Form, Modal, Tabs, TabsProps } from 'antd';
import { useTranslation } from 'react-i18next';
import OutputFrom from './OutputFrom';
import { useAtom, useSetAtom } from 'jotai';
import {
  isOpenCargoModal,
  isSelectCargo,
  outputFormData,
  targetKeyJotai
} from '@renderer/pages/Simulate/utils/status';
import { FC } from 'react';
import { SaveOutlined } from '@ant-design/icons';

const CargoModel: FC = () => {
  const [formOutput] = Form.useForm();
  const [formInput] = Form.useForm();
  const { t } = useTranslation();
  const setIsSelecting = useSetAtom(isSelectCargo);
  const [isOpening, setIsOpening] = useAtom(isOpenCargoModal);
  const setTemp = useSetAtom(outputFormData);
  const setTargetKey = useSetAtom(targetKeyJotai);

  const handleCancel = () => {
    setIsSelecting(false);
    setIsOpening(false);
    setTemp(null);
    formOutput.resetFields();
    formInput.resetFields();
    setTargetKey([]);
  };
  const handleOk = () => {
    setIsSelecting(false);
    setIsOpening(false);
    setTemp(null);
    formOutput.resetFields();
    formInput.resetFields();
    setTargetKey([]);
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('sim.cargo.output.output'),
      children: <OutputFrom form={formOutput} />
    },
    {
      key: '2',
      label: t('sim.cargo.input.input'),
      children: 'Content of Tab Pane 2'
    }
  ];
  return (
    <>
      <Modal
        open={isOpening}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={() => (
          <>
            <Button variant="filled" color="primary" icon={<SaveOutlined />}>
              {t('utils.save')}
            </Button>
          </>
        )}
      >
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </>
  );
};

export default CargoModel;

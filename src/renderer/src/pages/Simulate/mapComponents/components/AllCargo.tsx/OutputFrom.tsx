import useName from '@renderer/api/useAmrName';
import { OutputForm } from '@renderer/pages/Simulate/type/common';
import { isSelectCargo, outputFormData } from '@renderer/pages/Simulate/utils/status';
import SubmitButton from '@renderer/utils/SubmitButton';
import { Button, Form, InputNumber, Select, Space } from 'antd';
import { useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const OutputFrom: FC = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const setIsSelecting = useSetAtom(isSelectCargo);
  const setTempFormData = useSetAtom(outputFormData);
  const { data: name, isLoading: loadingCar } = useName();
  const AmrOption: { value: string; label: string }[] | undefined = name?.map((v) => ({
    value: v.id,
    label: v.id
  }));

  const tempSaveData = () => {
    setIsSelecting(false);
    const data = form.getFieldsValue() as OutputForm;
    console.log(data);
    setTempFormData(data);
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  useEffect(() => {}, []);

  return (
    <>
      <Form form={form} name="control-hooks" onFinish={onFinish} style={{ maxWidth: 600 }}>
        <Form.Item
          name="cargoNumber"
          label={t('sim.cargo.output.cargo_number')}
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="speed" label={t('sim.cargo.output.speed')} rules={[{ required: true }]}>
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="car"
          label={t('sim.cargo.output.specify_car')}
          rules={[{ required: true }]}
        >
          <Select options={AmrOption} loading={loadingCar} />
        </Form.Item>

        <Form.Item
          name="placement"
          label={t('sim.cargo.output.placement')}
          rules={[{ required: true }]}
        >
          <Button onClick={tempSaveData}>use map to select</Button>
        </Form.Item>

        <Form.Item>
          <Space>
            <SubmitButton isModel={false} form={form} text="save">
              {t('utils.save')}
            </SubmitButton>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default OutputFrom;

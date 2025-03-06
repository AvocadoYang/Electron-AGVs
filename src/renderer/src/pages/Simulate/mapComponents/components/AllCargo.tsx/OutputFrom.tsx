import useName from '@renderer/api/useAmrName';
import useMap from '@renderer/api/useMap';
import { OutputForm } from '@renderer/pages/Simulate/type/common';
import {
  isOpenCargoModal,
  isSelectCargo,
  outputFormData
} from '@renderer/pages/Simulate/utils/status';
import { Button, Flex, Form, FormInstance, InputNumber, Select } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { FC, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const OutputFrom: FC<{ form: FormInstance<unknown> }> = ({ form }) => {
  const { t } = useTranslation();
  const setIsSelecting = useSetAtom(isSelectCargo);
  const setIsOpening = useSetAtom(isOpenCargoModal);
  const [tempFormData, setTempFormData] = useAtom(outputFormData);
  const data = useMap();

  const shelves = useMemo(() => {
    return (
      data.data?.locations
        .filter((v) => v.areaType === '存貨區')
        .map((v) => ({ label: v.locationId, value: v.locationId })) || []
    );
  }, [data.data?.locations]);

  const { data: name, isLoading: loadingCar } = useName();
  const AmrOption: { value: string; label: string }[] | undefined = name?.map((v) => ({
    value: v.id,
    label: v.id
  }));

  const tempSaveData = () => {
    const data = form.getFieldsValue() as OutputForm;
    setIsOpening(false);
    setIsSelecting(true);
    setTempFormData(data);
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  useEffect(() => {
    if (tempFormData !== null) {
      form.setFieldsValue({
        cargoNumber: tempFormData.cargoNumber,
        speed: tempFormData.speed,
        car: tempFormData.car,
        placement: tempFormData?.placement || []
      });
      return;
    }
  }, [tempFormData]);

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

        <Flex gap="large">
          <Form.Item
            name="placement"
            label={t('sim.cargo.output.placement')}
            rules={[{ required: true }]}
          >
            <Select mode="multiple" size="large" style={{ width: 200 }} options={shelves} />
          </Form.Item>
          <Button onClick={tempSaveData}>{t('sim.modal.select_locations')}</Button>
        </Flex>
      </Form>
    </>
  );
};

export default OutputFrom;

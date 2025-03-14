import useName from '@renderer/api/useAmrName';
import useMap from '@renderer/api/useMap';
import { outputFormData } from '@renderer/pages/Simulate/utils/status';
import { Button, Flex, Form, FormInstance, InputNumber, Select, Switch } from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const OutputFrom: FC<{
  form: FormInstance<unknown>;
  tempSaveData: () => void;
}> = ({ form, tempSaveData }) => {
  const { t } = useTranslation();
  const tempFormData = useAtomValue(outputFormData);
  const data = useMap();
  const ref = useRef(null);

  const shelves = useMemo(() => {
    return (
      data.data?.locations
        .filter((v) => v.areaType === '存貨區')
        .map((v) => ({ label: v.locationId, value: v.locationId })) || []
    );
  }, [data.data?.locations]);

  const { data: name, isLoading: loadingCar } = useName();

  const AmrOption = useMemo(() => {
    const result =
      name?.map((v) => ({
        value: v.id,
        label: v.id
      })) || [];

    return [{ label: t('sim.modal.none'), value: 'none' }, ...result];
  }, [name]);

  useEffect(() => {
    if (tempFormData !== null && ref.current !== null) {
      form.setFieldsValue({
        is_active: tempFormData.is_active,
        cargo_number: tempFormData.cargo_number,
        output_cargo_speed: tempFormData.output_cargo_speed,
        specify_car: tempFormData.specify_car || [],
        placement: tempFormData?.placement || []
      });
      return;
    }
  }, [tempFormData]);

  return (
    <>
      <Form ref={ref} form={form} name="control-hooks" style={{ maxWidth: 600 }}>
        <Form.Item name="is_active" label={t('utils.active')}>
          <Switch checkedChildren={t('utils.active')} unCheckedChildren={t('utils.inactive')} />
        </Form.Item>

        <Form.Item name="cargo_number" label={t('sim.cargo.output.cargo_number')}>
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item name="output_cargo_speed" label={t('sim.cargo.output.speed')}>
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item name="specify_car" label={t('sim.cargo.output.specify_car')}>
          <Select mode="multiple" options={AmrOption} loading={loadingCar} />
        </Form.Item>

        <Flex gap="large">
          <Form.Item name="placement" label={t('sim.cargo.output.placement')}>
            <Select mode="multiple" size="large" style={{ width: 200 }} options={shelves} />
          </Form.Item>
          <Button onClick={tempSaveData}>{t('sim.modal.select_locations')}</Button>
        </Flex>
      </Form>
    </>
  );
};

export default OutputFrom;

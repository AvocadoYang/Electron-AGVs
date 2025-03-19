import useMap from '@renderer/api/useMap';
import { inputFormData, selectedLocation } from '@renderer/pages/Simulate/utils/status';
import { Form, FormInstance, InputNumber, Select, Switch } from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const InputFrom: FC<{ form: FormInstance<unknown> }> = ({ form }) => {
  const { t } = useTranslation();
  const data = useMap();
  const ref = useRef(null);
  const tempFormData = useAtomValue(inputFormData);
  const selectLocation = useAtomValue(selectedLocation);

  const shelves = useMemo(() => {
    const result =
      data.data?.locations
        .filter((v) => v.areaType === '存貨區')
        .filter((v) => v.locationId !== selectLocation)
        .map((v) => ({ label: v.locationId, value: v.locationId })) || [];

    return [{ label: t('sim.modal.none'), value: 'none' }, ...result];
  }, [data.data?.locations]);

  useEffect(() => {
    if (tempFormData !== null && ref.current !== null) {
      form.setFieldsValue({
        is_active: tempFormData.is_active,
        input_cargo_speed: tempFormData.input_cargo_speed,
        shift_locations: tempFormData.shift_locations
      });
      return;
    }
  }, [tempFormData]);

  return (
    <>
      <Form ref={ref} form={form} style={{ maxWidth: 600 }}>
        <Form.Item name="is_active" label={t('utils.active')}>
          <Switch checkedChildren={t('utils.active')} unCheckedChildren={t('utils.inactive')} />
        </Form.Item>

        <Form.Item name="input_cargo_speed" label={t('sim.cargo.input.shift_speed')}>
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item name="shift_locations" label={t('sim.cargo.input.shift_location')}>
          <Select options={shelves} />
        </Form.Item>
      </Form>
    </>
  );
};

export default InputFrom;

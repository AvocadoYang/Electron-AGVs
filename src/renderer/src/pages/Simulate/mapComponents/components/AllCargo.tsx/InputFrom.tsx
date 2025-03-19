import useMap from '@renderer/api/useMap';
import useSpecificShelf from '@renderer/api/useSpecificShelf';
import { inputFormData, selectedLocation } from '@renderer/pages/Simulate/utils/status';
import { Form, FormInstance, InputNumber, Select, Switch } from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const MissionStatus = styled.div<{ $isValid: boolean }>`
  margin: 0;
  position: relative;
  top: 0;
  right: 0;
  font-size: 1.2em;
  color: ${(props) => (props.$isValid ? '#0cb900' : '#c30000')};
  display: flex;
  flex-direction: row;
  gap: 1em;
`;

const InputFrom: FC<{ form: FormInstance<unknown> }> = ({ form }) => {
  const { t } = useTranslation();
  const data = useMap();
  const ref = useRef(null);
  const tempFormData = useAtomValue(inputFormData);
  const selectLocation = useAtomValue(selectedLocation);
  const [isSetMission, setIsSetMission] = useState(false);
  const { data: shelf } = useSpecificShelf(selectLocation as string);

  const shelves = useMemo(() => {
    const result =
      data.data?.locations
        .filter((v) => v.areaType === '存貨區')
        .filter((v) => v.locationId !== selectLocation)
        .map((v) => ({ label: v.locationId, value: v.locationId })) || [];

    return [{ label: t('sim.modal.none'), value: 'none' }, ...result];
  }, [data.data?.locations]);

  useEffect(() => {
    if (!shelf) return;

    const loadTaskCount =
      shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'offload').length || 0;

    setIsSetMission(loadTaskCount > 0);
  }, [shelf]);

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

      <MissionStatus $isValid={isSetMission}>
        <QuestionCircleOutlined />
        {isSetMission ? t('sim.modal.valid_mission') : t('sim.modal.not_mission_set')}
      </MissionStatus>
    </>
  );
};

export default InputFrom;

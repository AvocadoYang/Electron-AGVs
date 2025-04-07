import useMap from '@renderer/api/useMap';
import useSpecificShelf from '@renderer/api/useSpecificShelf';
import { inputFormData, selectedLocation } from '@renderer/pages/Simulate/utils/status';
import { Form, FormInstance, InputNumber, Select, Switch } from 'antd';
import { useAtomValue } from 'jotai';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { QuestionCircleOutlined } from '@ant-design/icons';

const StyledForm = styled(Form)`
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const MissionStatus = styled.div<{ $isValid: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  padding: 10px;
  background: ${({ $isValid }) => ($isValid ? '#e6ffe6' : '#fff1f0')};
  border-radius: 8px;
  border: 1px solid ${({ $isValid }) => ($isValid ? '#b7eb8f' : '#ffa39e')};
  color: ${({ $isValid }) => ($isValid ? '#389e0d' : '#cf1322')};
  font-weight: 500;
`;

const InputFrom: FC<{ form: FormInstance }> = ({ form }) => {
  const { t } = useTranslation();
  const data = useMap();
  const ref = useRef(null);
  const tempFormData = useAtomValue(inputFormData);
  const selectLocation = useAtomValue(selectedLocation);
  const [isSetMission, setIsSetMission] = useState(false);
  const { data: shelf } = useSpecificShelf(selectLocation as string);

  const shelves = useMemo(
    () => [
      { label: t('sim.modal.none'), value: 'none' },
      ...(data.data?.locations
        .filter((v) => v.areaType === '存貨區' && v.locationId !== selectLocation)
        .map((v) => ({ label: v.locationId, value: v.locationId })) || [])
    ],
    [data.data?.locations, t]
  );

  useEffect(() => {
    if (!shelf) return;
    const loadTaskCount =
      shelf.TitleBridgeLocs?.filter((v) => v.missionType === 'offload').length || 0;
    setIsSetMission(loadTaskCount > 0);
  }, [shelf]);

  useEffect(() => {
    if (tempFormData && ref.current) {
      form.setFieldsValue({
        is_active: tempFormData.is_active,
        input_cargo_speed: tempFormData.input_cargo_speed,
        shift_locations: tempFormData.shift_locations
      });
    }
  }, [tempFormData, form]);

  return (
    <StyledForm ref={ref} form={form} layout="vertical">
      <Form.Item name="is_active" label={t('utils.active')} valuePropName="checked">
        <Switch checkedChildren={t('utils.active')} unCheckedChildren={t('utils.inactive')} />
      </Form.Item>

      <Form.Item name="input_cargo_speed" label={t('sim.cargo.input.shift_speed')}>
        <InputNumber min={0} style={{ width: '100%' }} placeholder="Enter speed" />
      </Form.Item>

      <Form.Item name="shift_locations" label={t('sim.cargo.input.shift_location')}>
        <Select options={shelves} placeholder="Select location" />
      </Form.Item>

      <MissionStatus $isValid={isSetMission}>
        <QuestionCircleOutlined />
        <span>{isSetMission ? t('sim.modal.valid_mission') : t('sim.modal.not_mission_set')}</span>
      </MissionStatus>
    </StyledForm>
  );
};

export default InputFrom;
